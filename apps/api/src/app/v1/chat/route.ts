import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireActiveSubscription, AuthError } from "@/lib/auth";
import { resolveEngine } from "@/lib/engine-router";
import { checkAllowance, reserveRequest, settleRequest, releaseRequest } from "@/lib/usage";
import { ChatRequestSchema } from "@chairman/contracts";
import type { PlanKey } from "@chairman/contracts";

export async function POST(req: NextRequest) {
  let requestId: string | null = null;

  try {
    const user = await requireAuth();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { conversationId, message, chairmanMode, cloudConsent, idempotencyKey } = parsed.data;

    // Private mode is desktop-only — never call cloud AI
    if (chairmanMode === "private") {
      return NextResponse.json(
        { error: "Private Intelligence is available through Chairman AI Desktop." },
        { status: 400 }
      );
    }

    if (!cloudConsent) {
      return NextResponse.json({ error: "Cloud consent is required." }, { status: 403 });
    }

    const sub = await requireActiveSubscription(user.id);
    const planKey = sub.plan_key as PlanKey;

    const estimatedTokens = Math.ceil(message.length / 4);

    const allowanceCheck = await checkAllowance(user.id, planKey, chairmanMode, estimatedTokens);
    if (!allowanceCheck.allowed) {
      return NextResponse.json({ error: allowanceCheck.reason }, { status: 429 });
    }

    const engine = await resolveEngine(chairmanMode, planKey);

    try {
      requestId = await reserveRequest(
        allowanceCheck.cycleId,
        chairmanMode,
        idempotencyKey,
        user.id,
        conversationId
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "IDEMPOTENT_DUPLICATE") {
        return NextResponse.json({ error: "This request was already processed." }, { status: 409 });
      }
      throw err;
    }

    // Stream from OpenRouter — never expose provider identity in responses
    const openRouterRes = await fetch(
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
          model: engine.provider_model_id,
          messages: [{ role: "user", content: message }],
          stream: true,
          max_tokens: engine.max_output_tokens,
        }),
      }
    );

    if (!openRouterRes.ok || !openRouterRes.body) {
      await releaseRequest(requestId);
      // Never expose provider errors or model names to customers
      return NextResponse.json({ error: "Analysis unavailable. Please try again." }, { status: 503 });
    }

    const reqIdCapture = requestId;

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterRes.body!.getReader();
        const decoder = new TextDecoder();
        let inputTokens = estimatedTokens;
        let outputTokens = 0;
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const chunk = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                  usage?: { prompt_tokens?: number; completion_tokens?: number };
                };
                const content = chunk.choices?.[0]?.delta?.content ?? "";
                if (content) {
                  outputTokens += Math.ceil(content.length / 4);
                  controller.enqueue(new TextEncoder().encode(content));
                }
                // Capture actual usage when provider sends it
                if (chunk.usage) {
                  inputTokens = chunk.usage.prompt_tokens ?? inputTokens;
                  outputTokens = chunk.usage.completion_tokens ?? outputTokens;
                }
              } catch {
                // Skip malformed SSE chunk
              }
            }
          }

          await settleRequest(reqIdCapture, { input: inputTokens, output: outputTokens }, 0);
        } catch {
          await releaseRequest(reqIdCapture);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e: unknown) {
    if (requestId) {
      await releaseRequest(requestId).catch(() => {});
    }
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("Chat route error:", e);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
