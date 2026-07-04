import { NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { PLANS } from "@/contracts";

export async function GET() {
  try {
    const user = await requireAuth();
    const admin = createAdminClient();

    const { data: sub } = await admin
      .from("subscriptions")
      .select("id, plan_key, status, current_period_end")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({
        planKey: null,
        planPublicName: null,
        status: "none",
        currentPeriodEnd: null,
        modes: [],
      });
    }

    const planKey = sub.plan_key as keyof typeof PLANS;
    const plan = PLANS[planKey];

    // Get usage counters for current period
    const now = new Date();
    const { data: cycle } = await admin
      .from("usage_cycles")
      .select("id")
      .eq("profile_id", user.id)
      .eq("status", "active")
      .gte("period_end", now.toISOString())
      .maybeSingle();

    let counterMap: Record<string, number> = {};
    if (cycle) {
      const { data: counters } = await admin
        .from("usage_counters")
        .select("chairman_mode, requests_completed")
        .eq("usage_cycle_id", cycle.id);
      counterMap = Object.fromEntries(
        (counters ?? []).map((c) => [
          c.chairman_mode as string,
          c.requests_completed as number,
        ])
      );
    }

    const modes = Object.entries(plan?.modes ?? {}).map(([mode, cfg]) => {
      const used = counterMap[mode] ?? 0;
      const limit = cfg.monthlyLimit === Infinity ? null : cfg.monthlyLimit;
      return {
        mode,
        monthlyLimit: limit,
        used,
        remaining: limit === null ? null : Math.max(0, limit - used),
        lockedReason: cfg.monthlyLimit === 0 ? "Not available on your plan." : null,
      };
    });

    return NextResponse.json({
      planKey: sub.plan_key,
      planPublicName: plan?.publicName ?? sub.plan_key,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end,
      modes,
    });
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
