import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const Schema = z.object({
  job_title: z.string().min(1).max(200),
  job_description: z.string().min(1).max(5000),
  required_skills: z.array(z.string().max(100)).max(30).default([]),
  candidate_skills: z.array(z.string().max(100)).max(50).default([]),
  candidate_headline: z.string().max(300).optional(),
  candidate_years_experience: z.number().min(0).max(60).optional(),
  language: z.enum(["en", "ar"]).default("en"),
});

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "guidance:quicky");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({
      fit_score: 68,
      fit_level: "moderate",
      matched_skills: ["Communication", "Teamwork"],
      missing_skills: ["React", "TypeScript"],
      strengths: ["Relevant industry experience"],
      gaps: ["Missing key technical skills listed in the job"],
      recommendation: "Consider applying — you meet some requirements but should highlight transferable skills.",
      safety_notes: [],
    });
  }

  const { job_title, job_description, required_skills, candidate_skills, candidate_headline, candidate_years_experience, language } = parsed.data;

  const systemPrompt =
    language === "ar"
      ? "أنت محلل توافق وظيفي محترف. قيّم مدى توافق المرشح مع الوظيفة. استجب بصيغة JSON فقط."
      : "You are a professional job fit analyst. Evaluate how well a candidate matches a job. Respond in JSON only.";

  const userPrompt = `Evaluate job fit:

Job Title: ${job_title}
Job Description: ${job_description.slice(0, 2000)}
Required Skills: ${required_skills.join(", ") || "Not specified"}

Candidate:
Headline: ${candidate_headline ?? "Not provided"}
Skills: ${candidate_skills.join(", ") || "None listed"}
Years of experience: ${candidate_years_experience ?? "Not specified"}

Return JSON only:
{
  "fit_score": 75,
  "fit_level": "good",
  "matched_skills": ["..."],
  "missing_skills": ["..."],
  "strengths": ["..."],
  "gaps": ["..."],
  "recommendation": "...",
  "safety_notes": ["..."]
}
fit_score 0-100. fit_level: "poor" | "moderate" | "good" | "excellent".`;

  const res = await fetch(
    `${process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://api.ai.chairmans.uk",
        "X-Title": "Chairman AI",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "qwen/qwen3-30b-a3b-instruct-2507",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      }),
    }
  );

  if (!res.ok) return NextResponse.json({ error: "Job fit analysis unavailable." }, { status: 503 });

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "Job fit analysis failed." }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Job fit analysis failed." }, { status: 500 });
  }
}
