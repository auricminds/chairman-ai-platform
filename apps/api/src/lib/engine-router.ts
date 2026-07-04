import { createAdminClient } from "./supabase/server";

export interface ResolvedEngine {
  internal_key: string;
  owner_name: string;
  chairman_mode: string;
  provider: string;
  provider_model_id: string;
  max_input_tokens: number;
  max_output_tokens: number;
  input_price_per_million: number;
  output_price_per_million: number;
  requires_confirmation: boolean;
}

export async function resolveEngine(
  chairmanMode: string,
  planKey: string
): Promise<ResolvedEngine> {
  // Reject any raw model IDs from the frontend — modes are simple strings only
  if (chairmanMode.includes("/") || chairmanMode.includes(":")) {
    throw new Error("Invalid chairman mode");
  }

  const admin = createAdminClient();
  const { data: engine, error } = await admin
    .from("engine_registry")
    .select(
      "internal_key, owner_name, chairman_mode, provider, provider_model_id, " +
      "max_input_tokens, max_output_tokens, input_price_per_million, " +
      "output_price_per_million, requires_confirmation"
    )
    .eq("chairman_mode", chairmanMode)
    .eq("enabled", true)
    .contains("allowed_plans", [planKey])
    .order("priority", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Engine lookup error: ${error.message}`);
  if (!engine) {
    throw new Error(`No engine available for mode: ${chairmanMode}`);
  }
  if (!engine.provider_model_id) {
    throw new Error(`Engine ${engine.internal_key} has no model configured`);
  }

  return engine as ResolvedEngine;
}
