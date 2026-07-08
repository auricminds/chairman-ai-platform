import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const Schema = z.object({
  request_title: z.string().min(1).max(200),
  request_description: z.string().max(3000).optional(),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  deadline: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
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
      quality_score: 70,
      quality_level: "good",
      improvements: ["Describe the deliverables more specifically", "Add a realistic deadline"],
      missing_fields: ["request_description"],
      budget_feedback: "Budget range not specified — providers may skip this request.",
      tips: ["Be specific about what you need delivered", "Mention your preferred communication style"],
      safety_notes: [],
    });
  }

  const { request_title, request_description, budget_min, budget_max, deadline, location, category, language } = parsed.data;

  const systemPrompt =
    language === "ar"
      ? "أنت مستشار محترف لطلبات الخدمات. قيّم جودة الطلب وأعط إرشادات لتحسينه. استجب بصيغة JSON فقط."
      : "You are a professional service request advisor. Evaluate quality and give guidance to improve it. Respond in JSON only.";

  const userPrompt = `Review this service request:
Title: ${request_title}
Description: ${request_description ?? "Not provided"}
Category: ${category ?? "Not specified"}
Budget: ${budget_min && budget_max ? `${budget_min}–${budget_max}` : "Not specified"}
Deadline: ${deadline ?? "Not specified"}
Location: ${location ?? "Not specified"}

Help the requester get better responses from providers.

Return JSON only:
{
  "quality_score": 75,
  "quality_level": "good",
  "improvements": ["..."],
  "missing_fields": ["..."],
  "budget_feedback": "...",
  "tips": ["..."],
  "safety_notes": ["..."]
}
quality_score 0-100. quality_level: "poor" | "fair" | "good" | "excellent".`;

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

  if (!res.ok) return NextResponse.json({ error: "Service request guide unavailable." }, { status: 503 });

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "Service request guide failed." }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Service request guide failed." }, { status: 500 });
  }
}
