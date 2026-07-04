import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiteKey } from "@/lib/site-auth";

const ImproveScriptRequestSchema = z.object({
  current_script: z.string().min(1).max(5000),
  requested_change: z.string().min(1).max(1000),
  approved_user_facts: z.array(z.string().max(500)).max(30),
  language: z.enum(["en", "ar"]),
});

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "guidance:quicky");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ImproveScriptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { current_script, requested_change, approved_user_facts, language } = parsed.data;

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
  }

  const systemPrompt =
    language === "ar"
      ? "أنت مساعد لتحسين نصوص السيرة الذاتية بالفيديو. استخدم فقط الحقائق المعتمدة. لا تخترع أي معلومات."
      : "You are a video CV script improvement assistant. Use ONLY approved facts. Never invent information.";

  const userPrompt = `Current script:
${current_script}

Requested change: ${requested_change}

Approved facts:
${approved_user_facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Return JSON only:
{
  "revised_script": "...",
  "change_summary": "...",
  "safety_notes": ["..."]
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
        max_tokens: 2000,
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Script improvement unavailable." }, { status: 503 });
  }

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Script improvement failed." }, { status: 500 });
  }

  try {
    const result = JSON.parse(content) as {
      revised_script: string;
      change_summary: string;
      safety_notes: string[];
    };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Script improvement failed." }, { status: 500 });
  }
}
