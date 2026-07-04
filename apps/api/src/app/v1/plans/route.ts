import { NextResponse } from "next/server";
import { PLANS } from "@chairman/contracts";

// Customer-safe plan data only — no cost ceilings, no model IDs
export async function GET() {
  const safe = Object.values(PLANS).map((p) => ({
    key: p.key,
    publicName: p.publicName,
    priceMonthlyUsd: p.priceMonthlyUsd,
    modes: Object.entries(p.modes).map(([mode, cfg]) => ({
      mode,
      monthlyLimit: cfg.monthlyLimit === Infinity ? null : cfg.monthlyLimit,
      requiresConfirmation: cfg.requiresConfirmation,
      confirmationMessage: cfg.confirmationMessage ?? null,
      available: cfg.monthlyLimit !== 0,
    })),
  }));
  return NextResponse.json(safe);
}
