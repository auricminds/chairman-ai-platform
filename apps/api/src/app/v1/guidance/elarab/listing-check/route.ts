import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const ListingCheckSchema = z.object({
  listing_data: z.record(z.unknown()),
});

const REQUIRED_LISTING_FIELDS = [
  "title", "description", "location", "category", "salary_range",
  "contract_type", "requirements", "contact_method",
];

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "guidance:elarab");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ListingCheckSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { listing_data } = parsed.data;
  const presentFields = Object.keys(listing_data).filter(
    (k) => listing_data[k] !== null && listing_data[k] !== "" && listing_data[k] !== undefined
  );

  const missing = REQUIRED_LISTING_FIELDS.filter((f) => !presentFields.includes(f));
  const readinessScore = Math.round(
    ((REQUIRED_LISTING_FIELDS.length - missing.length) / REQUIRED_LISTING_FIELDS.length) * 100
  );

  const claritySuggestions: string[] = [];
  const warnings: string[] = [];

  if (typeof listing_data.description === "string") {
    if (listing_data.description.length < 100) {
      claritySuggestions.push("Description is too short. Aim for at least 100 characters.");
    }
  }

  if (typeof listing_data.title === "string") {
    if (listing_data.title.length < 10) {
      claritySuggestions.push("Job title is very short. Be specific for better visibility.");
    }
  }

  if (!listing_data.salary_range) {
    warnings.push("Listings without salary information receive fewer applications.");
  }

  return NextResponse.json({
    readiness_score: readinessScore,
    missing_fields: missing,
    clarity_suggestions: claritySuggestions,
    warnings,
  });
}
