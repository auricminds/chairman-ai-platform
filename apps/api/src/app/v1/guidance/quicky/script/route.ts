import { NextRequest, NextResponse } from "next/server";
import { QuickyScriptRequestSchema } from "@chairman/contracts";
import { verifySiteKey } from "@/lib/site-auth";

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "guidance:quicky");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = QuickyScriptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { role, industry, years_experience, skills, language, tone, approved_user_facts } = parsed.data;

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
  }

  const systemPrompt =
    language === "ar"
      ? "أنت مساعد احترافي لإنشاء نصوص سيرة ذاتية بالفيديو. استخدم فقط الحقائق المعتمدة من المستخدم. لا تخترع أي خبرات أو شهادات أو أرقام."
      : "You are a professional video CV script assistant. Use ONLY the user-approved facts. Never invent experience, certificates, salaries, achievements, employers, or numbers.";

  const userPrompt = `Create a professional video CV script.
Role: ${role}
Industry: ${industry}
Years of experience: ${years_experience}
Skills: ${skills.join(", ")}
Tone: ${tone}
Language: ${language === "ar" ? "Arabic" : "English"}
Approved facts from user:
${approved_user_facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Return JSON only:
{
  "script": "...",
  "estimated_duration_seconds": 90,
  "missing_facts": ["..."],
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
    return NextResponse.json({ error: "Script generation unavailable." }, { status: 503 });
  }

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Script generation failed." }, { status: 500 });
  }

  try {
    const result = JSON.parse(content) as {
      script: string;
      estimated_duration_seconds: number;
      missing_facts: string[];
      safety_notes: string[];
    };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Script generation failed." }, { status: 500 });
  }
}
