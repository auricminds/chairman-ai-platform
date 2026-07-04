import { NextRequest, NextResponse } from "next/server";
import { ElArabProfileCheckRequestSchema } from "@/contracts";
import { verifySiteKey } from "@/lib/site-auth";

// Required fields per role — rules-based, no AI needed
const REQUIRED_JOBSEEKER_FIELDS = [
  "full_name", "email", "phone", "location", "job_title",
  "skills", "experience", "education", "languages",
];

const REQUIRED_EMPLOYER_FIELDS = [
  "company_name", "email", "phone", "industry", "company_size",
  "website", "location", "description",
];

const FIELD_GUIDANCE: Record<string, string> = {
  full_name: "Add your full name so employers can identify your profile.",
  email: "A verified email address is required for contact.",
  phone: "Add a phone number with country code.",
  location: "Add your city and country of residence.",
  job_title: "Add your current or target job title.",
  skills: "List at least 3 relevant skills.",
  experience: "Add at least one work experience entry.",
  education: "Add your highest level of education.",
  languages: "Add the languages you speak and your proficiency level.",
  company_name: "Add your company or organisation name.",
  industry: "Select the industry your company operates in.",
  company_size: "Indicate your company size (e.g. 1-10, 10-50, etc.).",
  website: "Add your company website URL.",
  description: "Write a short description of your company (50+ words).",
};

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "guidance:elarab");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ElArabProfileCheckRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { role, completed_fields } = parsed.data;

  const required =
    role === "employer" ? REQUIRED_EMPLOYER_FIELDS : REQUIRED_JOBSEEKER_FIELDS;

  const missing = required.filter((f) => !completed_fields.includes(f));
  const completionPercentage = Math.round(
    ((required.length - missing.length) / required.length) * 100
  );

  const nextBestActions: string[] = [];
  if (missing.length > 0) {
    nextBestActions.push(
      `Complete ${missing[0]?.replace(/_/g, " ")}: this is the highest priority missing field.`
    );
  }
  if (missing.length > 1) {
    nextBestActions.push(
      `Add ${missing[1]?.replace(/_/g, " ")} to increase your profile visibility.`
    );
  }
  if (completionPercentage === 100) {
    nextBestActions.push(
      "Your profile is complete. Keep it updated as your experience grows."
    );
  }

  const fieldGuidance: Record<string, string> = {};
  for (const field of missing) {
    if (FIELD_GUIDANCE[field]) {
      fieldGuidance[field] = FIELD_GUIDANCE[field];
    }
  }

  return NextResponse.json({
    completion_percentage: completionPercentage,
    missing_required_fields: missing,
    next_best_actions: nextBestActions,
    field_guidance: fieldGuidance,
  });
}
