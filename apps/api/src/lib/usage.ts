import { createAdminClient } from "./supabase/server";
import { PLANS, type PlanKey } from "@/contracts";

export const FREE_TIER_LIMIT = 3; // lifetime free Business Intelligence requests
export const FREE_TIER_MODE = "business";

type AllowanceResult =
  | { allowed: true; cycleId: string }
  | { allowed: false; reason: string };

type FreeTierResult =
  | { allowed: true; used: number }
  | { allowed: false; used: number; reason: string };

export async function checkFreeTierAllowance(profileId: string): Promise<FreeTierResult> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("ai_requests")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .is("usage_cycle_id", null)
    .in("status", ["completed", "reserved"]);

  const used = count ?? 0;
  if (used >= FREE_TIER_LIMIT) {
    return { allowed: false, used, reason: "FREE_TIER_EXHAUSTED" };
  }
  return { allowed: true, used };
}

export async function reserveFreeTierRequest(
  idempotencyKey: string,
  profileId: string,
  conversationId: string
): Promise<string> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("ai_requests")
    .select("id, status")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existing) {
    if (existing.status === "completed") throw new Error("IDEMPOTENT_DUPLICATE");
    return existing.id as string;
  }

  const { data: req, error } = await admin
    .from("ai_requests")
    .insert({
      profile_id: profileId,
      usage_cycle_id: null,
      conversation_id: null, // FK requires existing conversation; free tier doesn't persist conversations
      idempotency_key: idempotencyKey,
      chairman_mode: FREE_TIER_MODE,
      status: "reserved",
    })
    .select("id")
    .single();

  if (error || !req) throw new Error(`Failed to reserve free tier request slot: ${error?.message}`);
  return req.id as string;
}

export async function checkAllowance(
  profileId: string,
  planKey: PlanKey,
  chairmanMode: string,
  estimatedInputTokens: number
): Promise<AllowanceResult> {
  const planConfig = PLANS[planKey];
  if (!planConfig) return { allowed: false, reason: "Unknown plan" };

  const modeConfig = planConfig.modes[chairmanMode as keyof typeof planConfig.modes];
  if (!modeConfig || modeConfig.monthlyLimit === 0) {
    return { allowed: false, reason: `${chairmanMode} is not available on your plan.` };
  }

  if (estimatedInputTokens > modeConfig.maxInputTokens && modeConfig.maxInputTokens > 0) {
    return { allowed: false, reason: "Message exceeds the maximum length for this mode." };
  }

  const admin = createAdminClient();

  const now = new Date();
  const { data: cycle } = await admin
    .from("usage_cycles")
    .select("id, provider_cost_reserved_usd")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .gte("period_end", now.toISOString())
    .maybeSingle();

  if (!cycle) {
    return { allowed: false, reason: "No active usage period found." };
  }

  // Check hard cost ceiling — message must NEVER mention dollar amounts
  const reserved = parseFloat(String(cycle.provider_cost_reserved_usd));
  if (reserved >= planConfig.hardCostCeilingUsd) {
    return { allowed: false, reason: "Monthly analysis capacity reached. Please try again next month." };
  }

  if (modeConfig.monthlyLimit === Infinity) {
    return { allowed: true, cycleId: cycle.id as string };
  }

  // Get counter for this mode
  const { data: counter } = await admin
    .from("usage_counters")
    .select("requests_reserved")
    .eq("usage_cycle_id", cycle.id)
    .eq("chairman_mode", chairmanMode)
    .maybeSingle();

  const used = (counter?.requests_reserved as number | null) ?? 0;
  if (used >= modeConfig.monthlyLimit) {
    return { allowed: false, reason: `Monthly ${chairmanMode} allowance reached.` };
  }

  return { allowed: true, cycleId: cycle.id as string };
}

export async function reserveRequest(
  cycleId: string,
  chairmanMode: string,
  idempotencyKey: string,
  profileId: string,
  conversationId: string
): Promise<string> {
  const admin = createAdminClient();

  // Idempotency check
  const { data: existing } = await admin
    .from("ai_requests")
    .select("id, status")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existing) {
    if (existing.status === "completed") {
      throw new Error("IDEMPOTENT_DUPLICATE");
    }
    return existing.id as string;
  }

  const { data: req, error } = await admin
    .from("ai_requests")
    .insert({
      profile_id: profileId,
      usage_cycle_id: cycleId,
      conversation_id: conversationId,
      idempotency_key: idempotencyKey,
      chairman_mode: chairmanMode,
      status: "reserved",
    })
    .select("id")
    .single();

  if (error || !req) throw new Error(`Failed to reserve request slot: ${error?.message}`);

  // Increment counter atomically via RPC
  await admin.rpc("increment_usage_counter", {
    p_cycle_id: cycleId,
    p_mode: chairmanMode,
  });

  return req.id as string;
}

export async function settleRequest(
  requestId: string,
  tokens: { input: number; output: number },
  actualCostUsd: number
) {
  const admin = createAdminClient();
  await admin.from("ai_requests").update({
    status: "completed",
    input_tokens: tokens.input,
    output_tokens: tokens.output,
    total_tokens: tokens.input + tokens.output,
    actual_cost_usd: actualCostUsd,
    completed_at: new Date().toISOString(),
  }).eq("id", requestId);
}

export async function releaseRequest(requestId: string) {
  const admin = createAdminClient();
  await admin.from("ai_requests").update({
    status: "released",
    completed_at: new Date().toISOString(),
  }).eq("id", requestId);
}
