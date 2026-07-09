import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-key-auth";
import { API_PLANS, API_PLAN_KEYS } from "@/contracts/plans";
import { z } from "zod";

// ─── GET /v1/developer/keys — list caller's API keys ──────────────────────────

export async function GET() {
  try {
    const user = await requireAuth();
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("api_keys")
      .select("id, name, key_prefix, status, tier, requests_used, requests_limit, rate_limit_rpm, created_at, last_used_at, expires_at")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      keys: (data ?? []).map((k) => ({
        id: k.id,
        name: k.name,
        // Show partial key: prefix + ... so user can identify which key it is
        keyPreview: `${k.key_prefix}...`,
        status: k.status,
        tier: k.tier,
        planName: API_PLANS[k.tier as keyof typeof API_PLANS]?.publicName ?? k.tier,
        requestsUsed: k.requests_used,
        requestsLimit: k.requests_limit,
        rateLimitRpm: k.rate_limit_rpm,
        createdAt: k.created_at,
        lastUsedAt: k.last_used_at,
        expiresAt: k.expires_at,
      })),
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("GET /v1/developer/keys:", e);
    return NextResponse.json({ error: "Failed to list keys." }, { status: 500 });
  }
}

// ─── POST /v1/developer/keys — create a new API key ───────────────────────────

const CreateKeySchema = z.object({
  name: z.string().min(1).max(64),
  tier: z.enum(API_PLAN_KEYS),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = CreateKeySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, tier } = parsed.data;
    const plan = API_PLANS[tier];
    const { key, prefix, hash } = generateApiKey();

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("api_keys")
      .insert({
        profile_id: user.id,
        name,
        key_prefix: prefix,
        key_hash: hash,
        tier,
        requests_limit: plan.requestsPerMonth,
        rate_limit_rpm: plan.rateLimitRpm,
      })
      .select("id, name, tier, created_at")
      .single();

    if (error) throw error;

    // Return the full key ONCE — it cannot be retrieved again
    return NextResponse.json(
      {
        id: data.id,
        name: data.name,
        tier: data.tier,
        planName: plan.publicName,
        // Full key — shown only at creation time, never stored in plain text
        key,
        keyPreview: `${prefix}...`,
        requestsLimit: plan.requestsPerMonth,
        rateLimitRpm: plan.rateLimitRpm,
        createdAt: data.created_at,
        warning: "Copy this key now — it will not be shown again.",
      },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("POST /v1/developer/keys:", e);
    return NextResponse.json({ error: "Failed to create key." }, { status: 500 });
  }
}
