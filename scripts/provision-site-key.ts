#!/usr/bin/env node
/**
 * scripts/provision-site-key.ts
 *
 * Generates a site API key and inserts it into Supabase.
 * Run with: npx ts-node scripts/provision-site-key.ts
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx ts-node scripts/provision-site-key.ts quicky-cv
 */

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const siteKey = process.argv[2];

if (!siteKey) {
  console.error("Usage: provision-site-key.ts <site-key>");
  console.error("  site-key must be one of: quicky-cv, elarab-club, chairmans-holding");
  process.exit(1);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // Find the site client
  const { data: client, error: clientError } = await supabase
    .from("site_clients")
    .select("id, display_name")
    .eq("site_key", siteKey)
    .single();

  if (clientError || !client) {
    console.error(`Site client not found for key: ${siteKey}`);
    process.exit(1);
  }

  // Generate key
  const rawKey = crypto.randomBytes(32).toString("hex");
  const prefix = rawKey.substring(0, 8);
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

  // Insert
  const { error: insertError } = await supabase.from("site_api_keys").insert({
    site_client_id: client.id,
    key_prefix: prefix,
    key_hash: keyHash,
    status: "active",
  });

  if (insertError) {
    console.error("Failed to insert key:", insertError.message);
    process.exit(1);
  }

  console.log("\n=== Site API Key Provisioned ===");
  console.log(`Site:      ${client.display_name} (${siteKey})`);
  console.log(`Key:       ${rawKey}`);
  console.log(`Prefix:    ${prefix}`);
  console.log("\nStore the full key securely — it cannot be recovered.");
  console.log("Set it as CHAIRMAN_SITE_KEY on the site's server.");
  console.log("================================\n");
}

void main();
