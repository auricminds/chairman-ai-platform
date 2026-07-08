import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const Schema = z.object({
  service_title: z.string().min(1).max(200),
  service_description: z.string().max(3000).optional(),
  category: z.string().max(100).optional(),
  skills: z.array(z.string().max(100)).max(30).default([]),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  availability: z.string().max(100).optional(),
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
      score: 75,
      level: "good",
      strengths: ["Clear service title", "Skills listed"],
      improvements: ["Add a detailed description of what you deliver", "Specify your turnaround time"],
      missing_fields: ["service_description"],
      safety_notes: [],
    });
  }

  const { service_title, service_description, category, skills, price_min, price_max, availability, language } = parsed.data;

  const systemPrompt =
    language === "ar"
      ? "أنت مراجع محترف لملفات مزودي الخدمات. قيّم جودة الملف وقدم توصيات لتحسينه. استجب بصيغة JSON فقط."
      : "You are a professional service profile reviewer. Evaluate quality and give improvement recommendations. Respond in JSON only.";

  const userPrompt = `Review this service provider profile:
Service Title: ${service_title}
Description: ${service_description ?? "Not provided"}
Category: ${category ?? "Not specified"}
Skills: ${skills.join(", ") || "None listed"}
Price: ${price_min && price_max ? `${price_min}–${price_max}` : "Not specified"}
Availability: ${availability ?? "Not specified"}

Return JSON only:
{
  "score": 80,
  "level": "good",
  "strengths": ["..."],
  "improvements": ["..."],
  "missing_fields": ["..."],
  "safety_notes": ["..."]
}
score 0-100. level: "poor" | "fair" | "good" | "excellent".`;

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

  if (!res.ok) return NextResponse.json({ error: "Service profile check unavailable." }, { status: 503 });

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "Service profile check failed." }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Service profile check failed." }, { status: 500 });
  }
}
