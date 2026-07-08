import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const Schema = z.object({
  display_name: z.string().min(1).max(200),
  headline: z.string().max(300).optional(),
  bio: z.string().max(3000).optional(),
  skills: z.array(z.string().max(100)).max(50).default([]),
  years_experience: z.number().min(0).max(60).optional(),
  role_type: z.enum(["job_seeker", "freelancer", "service_provider"]),
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
    // Mock response for dev without OpenRouter key
    return NextResponse.json({
      score: 72,
      level: "good",
      strengths: ["Clear headline", "Relevant skills listed"],
      improvements: ["Add a bio to explain your background", "Specify years of experience"],
      missing_fields: ["bio"],
      safety_notes: [],
    });
  }

  const { display_name, headline, bio, skills, years_experience, role_type, language } = parsed.data;

  const systemPrompt =
    language === "ar"
      ? "أنت مراجع محترف لملفات السير الذاتية. قيّم جودة الملف الشخصي وأعط توصيات محددة لتحسينه. استجب بصيغة JSON فقط."
      : "You are a professional profile reviewer. Evaluate the profile quality and give specific improvement recommendations. Respond in JSON only.";

  const userPrompt = `Review this ${role_type.replace("_", " ")} profile:
Name: ${display_name}
Headline: ${headline ?? "Not provided"}
Bio: ${bio ?? "Not provided"}
Skills: ${skills.join(", ") || "None listed"}
Years of experience: ${years_experience ?? "Not specified"}
Language: ${language}

Return JSON only:
{
  "score": 85,
  "level": "good",
  "strengths": ["..."],
  "improvements": ["..."],
  "missing_fields": ["..."],
  "safety_notes": ["..."]
}
Score 0-100. Level: "poor" | "fair" | "good" | "excellent".`;

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

  if (!res.ok) return NextResponse.json({ error: "Profile check unavailable." }, { status: 503 });

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "Profile check failed." }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Profile check failed." }, { status: 500 });
  }
}
