import { headers } from "next/headers";
import { createClient, createAdminClient } from "./supabase/server";

export async function requireAuth() {
  // Prefer Bearer token (cross-origin requests from web app)
  const headersList = await headers();
  const authHeader = headersList.get("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const admin = createAdminClient();
    const { data: { user }, error } = await admin.auth.getUser(token);
    if (error || !user) throw new AuthError("Unauthorized", 401);
    return user;
  }

  // Fall back to cookie-based auth (same-origin)
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AuthError("Unauthorized", 401);
  return user;
}

export async function requireActiveSubscription(userId: string) {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("*")
    .eq("profile_id", userId)
    .in("status", ["active", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) throw new AuthError("No active subscription", 403);

  if (sub.status === "cancelled" && sub.current_period_end) {
    const end = new Date(sub.current_period_end as string);
    if (end < new Date()) throw new AuthError("Subscription expired", 403);
  }

  return sub as {
    id: string;
    profile_id: string;
    plan_key: string;
    status: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    current_period_end: string | null;
  };
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}
