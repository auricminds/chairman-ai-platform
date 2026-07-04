import { type NextRequest } from "next/server";
import { createAdminClient } from "./supabase/server";
import { createHash } from "crypto";

type SiteKeyResult =
  | { valid: true; siteClientId: string }
  | { valid: false; reason: string };

export async function verifySiteKey(
  req: NextRequest,
  requiredScope: string
): Promise<SiteKeyResult> {
  const key = req.headers.get("X-Chairman-Site-Key");
  if (!key) return { valid: false, reason: "Site key required." };

  const prefix = key.substring(0, 8);
  const keyHash = createHash("sha256").update(key).digest("hex");

  const admin = createAdminClient();

  const { data: apiKey } = await admin
    .from("site_api_keys")
    .select("id, site_client_id, status, expires_at")
    .eq("key_prefix", prefix)
    .eq("key_hash", keyHash)
    .maybeSingle();

  if (!apiKey) return { valid: false, reason: "Invalid site key." };

  if (apiKey.status !== "active") return { valid: false, reason: "Site key revoked." };

  if (apiKey.expires_at && new Date(apiKey.expires_at as string) < new Date()) {
    return { valid: false, reason: "Site key expired." };
  }

  // Check client scope
  const { data: client } = await admin
    .from("site_clients")
    .select("status, allowed_scopes")
    .eq("id", apiKey.site_client_id)
    .single();

  if (!client || client.status !== "active") {
    return { valid: false, reason: "Site not active." };
  }

  const scopes = client.allowed_scopes as string[];
  if (!scopes.includes(requiredScope)) {
    return { valid: false, reason: "Scope not permitted." };
  }

  // Update last_used_at (fire and forget)
  void admin
    .from("site_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", apiKey.id);

  return { valid: true, siteClientId: apiKey.site_client_id as string };
}
