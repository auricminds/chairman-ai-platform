import { NextResponse } from "next/server";
import { API_PLANS } from "@/contracts/plans";

// GET /v1/developer/plans — public, no auth required
// Returns safe public data about API subscription tiers

export async function GET() {
  const plans = Object.values(API_PLANS).map((p) => ({
    key: p.key,
    publicName: p.publicName,
    priceMonthlyUsd: p.priceMonthlyUsd,
    requestsPerMonth: p.requestsPerMonth,
    rateLimitRpm: p.rateLimitRpm,
    description: p.description,
    features: p.features,
  }));

  return NextResponse.json({ plans });
}
