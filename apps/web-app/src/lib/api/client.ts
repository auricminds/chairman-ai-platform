"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

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
