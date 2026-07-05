import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireActiveSubscription, AuthError } from "@/lib/auth";
import { resolveEngine } from "@/lib/engine-router";
import { checkAllowance, reserveRequest, settleRequest, releaseRequest } from "@/lib/usage";
import { ChatRequestSchema } from "@/contracts";
import type { PlanKey } from "@/contracts";
import { buildSystemPrompt, sanitiseResponse, CONSTITUTION_VERSION_NAME } from "@/policies/chairmanConstitution";
import { classifyScope, SCOPE_REDIRECT_MESSAGE } from "@/policies/scopeGate";

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

    // ─────────────────────────────────────────────
    // SCOPE GATE — Layer 1 enforcement
    // Redirect personal requests before spending tokens
    // ─────────────────────────────────────────────
    const scopeResult = classifyScope(message);
    if (!scopeResult.allowed) {
      // Stream the redirect message like a normal response (no AI call)
      const encoder = new TextEncoder();
      const redirectStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(SCOPE_REDIRECT_MESSAGE));
          controller.close();
        },
      });
      return new Response(redirectStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "X-Accel-Buffering": "no",
          "X-Chairman-Scope": scopeResult.category,
          "X-Chairman-Policy": CONSTITUTION_VERSION_NAME,
        },
      });
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

    // ─────────────────────────────────────────────
    // BUILD POLICY STACK — Layers 1+2+3
    // Core Constitution + Mode Policy + User Profile (if available)
    // Layer 4 (user message) is appended as the user turn below
    // ─────────────────────────────────────────────
    const systemPrompt = buildSystemPrompt(chairmanMode);

    // Stream from OpenRouter with Chairman Constitution injected
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
          messages: [
            // Layer 1+2+3: Chairman Constitution + Mode Policy
            { role: "system", content: systemPrompt },
            // Layer 4: User message (lowest priority)
            { role: "user", content: message },
          ],
          stream: true,
          max_tokens: engine.max_output_tokens,
        }),
      }
    );

    if (!openRouterRes.ok || !openRouterRes.body) {
      await releaseRequest(requestId);
      return NextResponse.json({ error: "Analysis unavailable. Please try again." }, { status: 503 });
    }

    const reqIdCapture = requestId;
    const scopeCategory = scopeResult.category;

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterRes.body!.getReader();
        const decoder = new TextDecoder();
        let inputTokens = estimatedTokens;
        let outputTokens = 0;
        let buffer = "";
        let accumulatedContent = "";

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
                  // Sanitise each chunk to remove provider names etc.
                  const safe = sanitiseResponse(content);
                  accumulatedContent += safe;
                  outputTokens += Math.ceil(content.length / 4);
                  controller.enqueue(new TextEncoder().encode(safe));
                }
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
          void logPolicyUsage(reqIdCapture, scopeCategory);
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
        "X-Chairman-Policy": CONSTITUTION_VERSION_NAME,
        "X-Chairman-Scope": scopeCategory,
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

// Fire-and-forget: record policy version on the ai_request row
async function logPolicyUsage(requestId: string, scopeCategory: string): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    await admin
      .from("ai_requests")
      .update({
        policy_version: CONSTITUTION_VERSION_NAME,
        scope_category: scopeCategory,
      })
      .eq("id", requestId);
  } catch {
    // Non-fatal — usage tracking must not break the response
  }
}
