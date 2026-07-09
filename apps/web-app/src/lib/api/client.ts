"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.ai.chairmans.uk";

async function authHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function fetchEntitlements() {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/me/entitlements`, { headers });
  if (!res.ok) throw new Error("Failed to fetch entitlements");
  return res.json();
}

export async function fetchMe() {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/me`, { headers });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function startCheckout(planKey: string) {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/billing/checkout`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ planKey }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Billing error" })) as { error?: string };
    throw new Error(err.error ?? "Billing error");
  }
  return res.json() as Promise<{ url: string | null }>;
}

export async function openBillingPortal() {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/billing/portal`, {
    method: "POST",
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Portal error" })) as { error?: string };
    throw new Error(err.error ?? "Portal error");
  }
  return res.json() as Promise<{ url: string }>;
}

// ─── Developer API Keys ───────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  status: "active" | "revoked";
  tier: string;
  planName: string;
  requestsUsed: number;
  requestsLimit: number | null;
  rateLimitRpm: number;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/developer/keys`, { headers });
  if (!res.ok) throw new Error("Failed to fetch API keys");
  const data = await res.json() as { keys: ApiKey[] };
  return data.keys;
}

export async function createApiKey(name: string, tier: string): Promise<{ key: string } & ApiKey> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/developer/keys`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ name, tier }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create key" })) as { error?: string };
    throw new Error(err.error ?? "Failed to create key");
  }
  return res.json();
}

export async function revokeApiKey(keyId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/developer/keys/${keyId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to revoke key");
}

export async function fetchApiPlans() {
  const res = await fetch(`${API_BASE}/v1/developer/plans`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json() as Promise<{
    plans: Array<{
      key: string;
      publicName: string;
      priceMonthlyUsd: number;
      requestsPerMonth: number | null;
      rateLimitRpm: number;
      description: string;
      features: string[];
    }>;
  }>;
}

export async function* streamChat(params: {
  conversationId: string;
  message: string;
  chairmanMode: string;
  cloudConsent: boolean;
  idempotencyKey: string;
}): AsyncGenerator<string> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/v1/chat`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis unavailable." })) as { error?: string };
    throw new Error(err.error ?? "Analysis unavailable.");
  }

  if (!res.body) throw new Error("No response body.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) yield chunk;
    }
  } finally {
    reader.releaseLock();
  }
}
