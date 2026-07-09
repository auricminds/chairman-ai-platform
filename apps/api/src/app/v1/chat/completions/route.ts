/**
 * POST /v1/chat/completions
 *
 * OpenAI-compatible endpoint for external developer use.
 * Auth: API key via Authorization: Bearer sk-chairman-...
 *
 * Request body mirrors the OpenAI Chat Completions format:
 * {
 *   model: "chairman-standard" | "chairman-strategic" | "chairman-executive" | "chairman-board" | "chairman-extended",
 *   messages: [{ role: "system" | "user" | "assistant", content: string }],
 *   stream?: boolean,       // default false
 *   max_tokens?: number,
 *   temperature?: number,   // ignored — constitution controls tone
 *   user?: string,          // ignored
 * }
 *
 * Non-streaming: returns OpenAI-format JSON chat.completion object.
 * Streaming: returns SSE stream of chat.completion.chunk objects + data: [DONE]
 */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey, incrementKeyUsage } from "@/lib/api-key-auth";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveEngineForFreeTier } from "@/lib/engine-router";
import { buildSystemPrompt, sanitiseResponse, CONSTITUTION_VERSION_NAME } from "@/policies/chairmanConstitution";
import { AuthError } from "@/lib/auth";
import { z } from "zod";

// ─── Model → Chairman Mode mapping ────────────────────────────────────────────
// Developers use familiar model-name strings; we map them to internal modes.

const MODEL_TO_MODE: Record<string, string> = {
  // Prefixed names (preferred — unambiguous)
  "chairman-standard":   "business",
  "chairman-extended":   "extended",
  "chairman-strategic":  "strategic",
  "chairman-executive":  "executive",
  "chairman-board":      "board",
  // Short names (convenience)
  standard:  "business",
  extended:  "extended",
  strategic: "strategic",
  executive: "executive",
  board:     "board",
  // Aliases
  "chairman-business": "business",
  business:            "business",
};

const DEFAULT_MODEL = "chairman-standard";
const DEFAULT_MODE  = "business";

// ─── Request Schema ───────────────────────────────────────────────────────────

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).max(50000),
});

const CompletionsRequestSchema = z.object({
  model: z.string().default(DEFAULT_MODEL),
  messages: z.array(MessageSchema).min(1).max(100),
  stream: z.boolean().optional().default(false),
  max_tokens: z.number().int().positive().max(8000).optional(),
  // These params are accepted for API compatibility but ignored
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  n: z.number().optional(),
  user: z.string().optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCompletionId() {
  return `chatcmpl-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function unixNow() {
  return Math.floor(Date.now() / 1000);
}

// Extract last user message (for scope gate + token estimation)
function lastUserMessage(messages: z.infer<typeof MessageSchema>[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

// Build the messages array sent to OpenRouter:
// - Our system prompt replaces / prepends any caller-provided system message
// - Conversation history (user+assistant turns) is passed through as-is
function buildOpenRouterMessages(
  messages: z.infer<typeof MessageSchema>[],
  chairmanMode: string
) {
  const constitution = buildSystemPrompt(chairmanMode);
  const conversationTurns = messages.filter((m) => m.role !== "system");

  // Prepend the constitution as the system message
  return [
    { role: "system", content: constitution },
    ...conversationTurns,
  ];
}

// ─── Track request in ai_requests table ──────────────────────────────────────

async function recordApiRequest(opts: {
  apiKeyId: string;
  profileId: string;
  chairmanMode: string;
  inputTokens: number;
  outputTokens: number;
  status: "completed" | "failed";
}) {
  try {
    const admin = createAdminClient();
    await admin.from("ai_requests").insert({
      profile_id: opts.profileId,
      api_key_id: opts.apiKeyId,
      chairman_mode: opts.chairmanMode,
      status: opts.status,
      input_tokens: opts.inputTokens,
      output_tokens: opts.outputTokens,
      total_tokens: opts.inputTokens + opts.outputTokens,
      policy_version: CONSTITUTION_VERSION_NAME,
      completed_at: new Date().toISOString(),
    });
  } catch {
    // Non-fatal — tracking must never break the response
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let apiKeyCtx: Awaited<ReturnType<typeof requireApiKey>> | null = null;

  try {
    // 1. Authenticate via API key
    apiKeyCtx = await requireApiKey();

    // 2. Parse and validate request
    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: { message: "Invalid JSON request body.", type: "invalid_request_error" } }, { status: 400 });
    }

    const parsed = CompletionsRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Invalid request.", type: "invalid_request_error", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { model, messages, stream, max_tokens } = parsed.data;

    // 3. Resolve chairman mode from model string
    const chairmanMode = MODEL_TO_MODE[model] ?? DEFAULT_MODE;

    // 4. Check tier permissions
    const tier = apiKeyCtx.tier;
    const tierRestrictedModes: Record<string, string[]> = {
      api_starter: ["business", "extended", "strategic"],
      api_pro:     ["business", "extended", "strategic", "executive"],
      api_enterprise: ["business", "extended", "strategic", "executive", "board"],
    };
    const allowedModes = tierRestrictedModes[tier] ?? ["business"];
    if (!allowedModes.includes(chairmanMode)) {
      return NextResponse.json(
        {
          error: {
            message: `The "${model}" model requires API Pro or higher. Upgrade at chairmans.uk/pricing`,
            type: "insufficient_quota",
            code: "model_not_available_on_tier",
          },
        },
        { status: 403 }
      );
    }

    // 5. Resolve engine
    const engine = await resolveEngineForFreeTier(chairmanMode);

    // 6. Build messages for OpenRouter
    const openRouterMessages = buildOpenRouterMessages(messages, chairmanMode);
    const estimatedInputTokens = Math.ceil(
      openRouterMessages.reduce((acc, m) => acc + m.content.length, 0) / 4
    );

    // 7. Call OpenRouter
    const completionId = makeCompletionId();
    const created = unixNow();

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
          messages: openRouterMessages,
          stream,
          max_tokens: max_tokens ?? engine.max_output_tokens,
        }),
      }
    );

    if (!openRouterRes.ok || !openRouterRes.body) {
      void recordApiRequest({
        apiKeyId: apiKeyCtx.keyId,
        profileId: apiKeyCtx.profileId,
        chairmanMode,
        inputTokens: estimatedInputTokens,
        outputTokens: 0,
        status: "failed",
      });
      return NextResponse.json(
        { error: { message: "AI service temporarily unavailable. Please retry.", type: "service_unavailable" } },
        { status: 503 }
      );
    }

    // ─── Streaming response ───────────────────────────────────────────────────
    if (stream) {
      const keyId = apiKeyCtx.keyId;
      const profileId = apiKeyCtx.profileId;
      const encoder = new TextEncoder();

      const sseStream = new ReadableStream({
        async start(controller) {
          const reader = openRouterRes.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let outputTokens = 0;

          // Send the role delta first (mirrors OpenAI behaviour)
          const roleDelta = {
            id: completionId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [{ index: 0, delta: { role: "assistant", content: "" }, finish_reason: null }],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(roleDelta)}\n\n`));

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
                    choices?: Array<{ delta?: { content?: string }; finish_reason?: string | null }>;
                    usage?: { prompt_tokens?: number; completion_tokens?: number };
                  };
                  const content = chunk.choices?.[0]?.delta?.content ?? "";
                  const finishReason = chunk.choices?.[0]?.finish_reason ?? null;

                  if (content) {
                    const safe = sanitiseResponse(content);
                    outputTokens += Math.ceil(safe.length / 4);
                    // Emit OpenAI-format chunk
                    const outChunk = {
                      id: completionId,
                      object: "chat.completion.chunk",
                      created,
                      model,
                      choices: [{ index: 0, delta: { content: safe }, finish_reason: null }],
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(outChunk)}\n\n`));
                  }

                  if (finishReason) {
                    // Emit stop chunk
                    const stopChunk = {
                      id: completionId,
                      object: "chat.completion.chunk",
                      created,
                      model,
                      choices: [{ index: 0, delta: {}, finish_reason: finishReason }],
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(stopChunk)}\n\n`));
                  }

                  if (chunk.usage) {
                    outputTokens = chunk.usage.completion_tokens ?? outputTokens;
                  }
                } catch { /* skip malformed chunk */ }
              }
            }
          } finally {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();

            // Fire-and-forget: tracking + usage increment
            void incrementKeyUsage(keyId);
            void recordApiRequest({
              apiKeyId: keyId,
              profileId,
              chairmanMode,
              inputTokens: estimatedInputTokens,
              outputTokens,
              status: "completed",
            });
          }
        },
      });

      return new Response(sseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-store",
          "X-Accel-Buffering": "no",
          "X-Chairman-Policy": CONSTITUTION_VERSION_NAME,
        },
      });
    }

    // ─── Non-streaming response ───────────────────────────────────────────────
    const data = await openRouterRes.json() as {
      choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    };

    const rawContent = data.choices?.[0]?.message?.content ?? "";
    const safeContent = sanitiseResponse(rawContent);
    const finishReason = data.choices?.[0]?.finish_reason ?? "stop";
    const promptTokens = data.usage?.prompt_tokens ?? estimatedInputTokens;
    const completionTokens = data.usage?.completion_tokens ?? Math.ceil(safeContent.length / 4);

    // Fire-and-forget: tracking
    void incrementKeyUsage(apiKeyCtx.keyId);
    void recordApiRequest({
      apiKeyId: apiKeyCtx.keyId,
      profileId: apiKeyCtx.profileId,
      chairmanMode,
      inputTokens: promptTokens,
      outputTokens: completionTokens,
      status: "completed",
    });

    return NextResponse.json({
      id: completionId,
      object: "chat.completion",
      created,
      model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: safeContent },
          finish_reason: finishReason,
        },
      ],
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
      },
    });
  } catch (e) {
    if (e instanceof AuthError) {
      // Return OpenAI-format error for auth failures
      return NextResponse.json(
        { error: { message: e.message, type: "authentication_error", code: "invalid_api_key" } },
        { status: e.status }
      );
    }
    console.error("POST /v1/chat/completions:", e);
    return NextResponse.json(
      { error: { message: "An internal error occurred.", type: "api_error" } },
      { status: 500 }
    );
  }
}
