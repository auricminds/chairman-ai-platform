import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const ProfileWriteRequestSchema = z.object({
  role: z.enum(["jobseeker", "employer"]),
  approved_facts: z.array(z.string().max(500)).min(1).max(30),
  language: z.enum(["en", "ar"]),
  requested_style: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "guidance:elarab");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ProfileWriteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { role, approved_facts, language, requested_style } = parsed.data;

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
  }

  const systemPrompt =
    language === "ar"
      ? "أنت مساعد لكتابة نصوص الملفات الشخصية. استخدم فقط الحقائق المعتمدة. لا تخترع أي معلومات."
      : `You are a professional profile bio writer for a job platform. Use ONLY the approved facts provided. Never invent employers, qualifications, salaries, achievements, or experience. Always add a review warning.`;

  const userPrompt = `Write a ${role === "employer" ? "company" : "professional"} profile in ${language === "ar" ? "Arabic" : "English"}.
Style: ${requested_style}

Approved facts:
${approved_facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Return JSON only:
{
  "suggested_profile_text": "...",
  "review_warning": "Please review before publishing: AI-generated content must be verified for accuracy."
}`;

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
        model: "qwen/qwen3-30b-a3b-instruct-2507",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Profile writing unavailable." }, { status: 503 });
  }

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Profile generation failed." }, { status: 500 });
  }

  try {
    const result = JSON.parse(content) as { suggested_profile_text: string; review_warning: string };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Profile generation failed." }, { status: 500 });
  }
}
