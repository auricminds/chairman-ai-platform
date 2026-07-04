import { NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await requireAuth();
    const admin = createAdminClient();

    const now = new Date();
    const { data: cycle } = await admin
      .from("usage_cycles")
      .select("id, period_start, period_end, plan_key")
      .eq("profile_id", user.id)
      .eq("status", "active")
      .gte("period_end", now.toISOString())
      .maybeSingle();

    if (!cycle) {
      return NextResponse.json({ periodStart: null, periodEnd: null, counters: [] });
    }

    const { data: counters } = await admin
      .from("usage_counters")
      .select("chairman_mode, requests_completed, request_limit")
      .eq("usage_cycle_id", cycle.id);

    return NextResponse.json({
      periodStart: cycle.period_start,
      periodEnd: cycle.period_end,
      counters: (counters ?? []).map((c) => ({
        mode: c.chairman_mode,
        used: c.requests_completed,
        limit: c.request_limit === 0 ? null : c.request_limit,
      })),
    });
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
