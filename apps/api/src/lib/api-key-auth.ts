import crypto from "crypto";
import { headers } from "next/headers";
import { createAdminClient } from "./supabase/server";
import { AuthError } from "./auth";

export interface ApiKeyContext {
  profileId: string;
  keyId: string;
  tier: string;
  requestsUsed: number;
  requestsLimit: number | null;
}

// ─── Key Generation ────────────────────────────────────────────────────────────
// Key format: sk-chairman-{48 random hex chars}
// Stored prefix: first 20 chars of the key (used for fast DB lookup)
// Stored hash:   SHA-256 of the full key (never store plain key)

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const random = crypto.randomBytes(24).toString("hex"); // 48 hex chars
  const key = `sk-chairman-${random}`;
  const prefix = key.slice(0, 20); // "sk-chairman-" (12) + first 8 random chars
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return { key, prefix, hash };
}

// ─── Key Verification ─────────────────────────────────────────────────────────

export async function requireApiKey(): Promise<ApiKeyContext> {
  const hdrs = await headers();
  const authHeader = hdrs.get("Authorization") ?? "";

  if (!authHeader.startsWith("Bearer sk-chairman-")) {
    throw new AuthError(
      "Valid API key required. Pass Authorization: Bearer sk-chairman-...",
      401
    );
  }

  const key = authHeader.slice(7); // remove "Bearer "
  const prefix = key.slice(0, 20);
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  const admin = createAdminClient();
  const { data } = await admin
    .from("api_keys")
    .select("id, profile_id, status, tier, requests_used, requests_limit, expires_at")
    .eq("key_prefix", prefix)
    .eq("key_hash", hash)
    .single();

  if (!data) throw new AuthError("Invalid API key.", 401);
  if (data.status !== "active") throw new AuthError("This API key has been revoked.", 401);
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new AuthError("This API key has expired.", 401);
  }
  if (data.requests_limit !== null && data.requests_used >= data.requests_limit) {
    throw new AuthError(
      "Monthly request limit exceeded. Upgrade your API plan at chairmans.uk/pricing",
      429
    );
  }

  // Fire-and-forget: record last usage timestamp
  void admin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    profileId: data.profile_id,
    keyId: data.id,
    tier: data.tier,
    requestsUsed: data.requests_used,
    requestsLimit: data.requests_limit,
  };
}

// ─── Usage Increment ──────────────────────────────────────────────────────────
// Call after a successful API request to count against the monthly limit.

export async function incrementKeyUsage(keyId: string): Promise<void> {
  const admin = createAdminClient();
  // Atomic increment via RPC (see SQL migration)
  await admin.rpc("increment_api_key_usage", { p_key_id: keyId });
}
