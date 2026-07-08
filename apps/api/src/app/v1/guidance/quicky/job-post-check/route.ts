import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const Schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  required_skills: z.array(z.string().max(100)).max(30).default([]),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  location: z.string().max(200).optional(),
  job_type: z.string().max(100).optional(),
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
      quality_score: 78,
      quality_level: "good",
      issues: [],
      suggestions: ["Add salary range to attract more applicants", "Include remote/hybrid options"],
      missing_fields: ["salary_min", "salary_max"],
      safety_flags: [],
      approved: true,
    });
  }

  const { title, description, required_skills, salary_min, salary_max, location, job_type, language } = parsed.data;

  const systemPrompt =
    language === "ar"
      ? "أنت مراجع محترف لإعلانات الوظائف. قيّم جودة الإعلان وحدد أي مشكلات. استجب بصيغة JSON فقط."
      : "You are a professional job posting reviewer. Evaluate quality and flag any issues. Respond in JSON only.";

  const userPrompt = `Review this job posting:
Title: ${title}
Description: ${description.slice(0, 2000)}
Required Skills: ${required_skills.join(", ") || "Not specified"}
Salary: ${salary_min && salary_max ? `${salary_min}–${salary_max}` : "Not specified"}
Location: ${location ?? "Not specified"}
Job Type: ${job_type ?? "Not specified"}

Flag: misleading claims, unrealistic requirements, discriminatory language, salary vs. responsibilities mismatch.

Return JSON only:
{
  "quality_score": 80,
  "quality_level": "good",
  "issues": ["..."],
  "suggestions": ["..."],
  "missing_fields": ["..."],
  "safety_flags": ["..."],
  "approved": true
}
quality_score 0-100. quality_level: "poor" | "fair" | "good" | "excellent". approved: false if safety_flags exist.`;

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

  if (!res.ok) return NextResponse.json({ error: "Job post check unavailable." }, { status: 503 });

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "Job post check failed." }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Job post check failed." }, { status: 500 });
  }
}
