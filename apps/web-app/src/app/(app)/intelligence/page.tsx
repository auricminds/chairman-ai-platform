"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { streamChat, fetchEntitlements } from "@/lib/api/client";

// Mode definitions — names only, never model IDs
const MODES = [
  {
    id: "business",
    label: "Business Intelligence",
    description: "Business strategy, market analysis, operational decisions.",
    cloudRequired: true,
    confirmRequired: false,
  },
  {
    id: "extended",
    label: "Extended Review",
    description: "Deep research briefs, long document analysis.",
    cloudRequired: true,
    confirmRequired: false,
  },
  {
    id: "strategic",
    label: "Strategic Review",
    description: "Strategic planning, competitive analysis, positioning.",
    cloudRequired: true,
    confirmRequired: false,
  },
  {
    id: "executive",
    label: "Executive Analysis",
    description: "High-stakes decisions, executive briefings.",
    cloudRequired: true,
    confirmRequired: true,
  },
  {
    id: "board",
    label: "Board Review",
    description: "Board-level reporting, governance, investor-grade analysis.",
    cloudRequired: true,
    confirmRequired: true,
  },
];

interface ModeAllowance {
  mode: string;
  monthlyLimit: number | null;
  used: number;
  remaining: number | null;
  lockedReason: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
}

function ModeSelector({
  selectedMode,
  onSelect,
  allowances,
}: {
  selectedMode: string;
  onSelect: (id: string) => void;
  allowances: ModeAllowance[];
}) {
  const getAllowance = (modeId: string) =>
    allowances.find((a) => a.mode === modeId);

  return (
    <div className="flex flex-wrap gap-2">
      {/* Private Intelligence — desktop only, always greyed */}
      <button
        disabled
        title="Private Intelligence runs entirely on your device. Use Chairman AI Desktop."
        className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-600 text-sm cursor-not-allowed"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        Private Intelligence
        <span className="text-[10px] text-zinc-700 bg-zinc-800 px-1.5 py-0.5 rounded">Desktop only</span>
      </button>

      {MODES.map((mode) => {
        const allowance = getAllowance(mode.id);
        const locked = allowance?.lockedReason != null;
        const exhausted =
          allowance?.remaining !== null &&
          allowance?.remaining !== undefined &&
          allowance.remaining <= 0;
        const isSelected = selectedMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => !locked && !exhausted && onSelect(mode.id)}
            disabled={locked || exhausted}
            title={locked ? allowance?.lockedReason ?? "Not available" : mode.description}
            className={[
              "flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors",
              locked || exhausted
                ? "border-zinc-800 bg-zinc-900/30 text-zinc-600 cursor-not-allowed"
                : isSelected
                  ? "border-amber-600 bg-amber-900/20 text-amber-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100",
            ].join(" ")}
          >
            {mode.label}
            {allowance && allowance.monthlyLimit !== null && (
              <span className={[
                "text-[10px] px-1.5 py-0.5 rounded",
                locked || exhausted
                  ? "text-zinc-700 bg-zinc-800"
                  : "text-zinc-500 bg-zinc-800/60",
              ].join(" ")}>
                {exhausted ? "0 left" : `${allowance.remaining} left`}
              </span>
            )}
            {locked && (
              <svg className="h-3 w-3 text-zinc-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
            )}
            {mode.confirmRequired && !locked && !exhausted && (
              <span className="text-[10px] text-amber-700">confirm</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ConfirmationDialog({
  mode,
  onConfirm,
  onCancel,
}: {
  mode: typeof MODES[0];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-zinc-100">{mode.label}</h2>
        <p className="text-sm text-zinc-400">
          This will use 1 {mode.label} from your monthly allowance. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IntelligencePage() {
  const [selectedMode, setSelectedMode] = useState("business");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [allowances, setAllowances] = useState<ModeAllowance[]>([]);
  const [pendingConfirm, setPendingConfirm] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<boolean>(false);

  useEffect(() => {
    fetchEntitlements()
      .then((data: { modes?: ModeAllowance[] }) => {
        if (data.modes) setAllowances(data.modes);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (confirmedMode?: string) => {
    const mode = confirmedMode ?? selectedMode;
    const text = input.trim();
    if (!text || streaming) return;

    const modeConfig = MODES.find((m) => m.id === mode);

    // Check if confirmation needed
    if (modeConfig?.confirmRequired && !confirmedMode) {
      setPendingConfirm(() => () => sendMessage(mode));
      return;
    }

    setInput("");
    setError(null);
    abortRef.current = false;

    const userMsg: Message = { id: uuidv4(), role: "user", content: text, mode };
    const assistantMsg: Message = { id: uuidv4(), role: "assistant", content: "", mode };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    try {
      const gen = streamChat({
        conversationId: conversationId.current,
        message: text,
        chairmanMode: mode,
        cloudConsent: true,
        idempotencyKey: userMsg.id,
      });

      for await (const chunk of gen) {
        if (abortRef.current) break;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m
          )
        );
      }

      // Refresh allowances after a successful call
      fetchEntitlements()
        .then((data: { modes?: ModeAllowance[] }) => {
          if (data.modes) setAllowances(data.modes);
        })
        .catch(() => {});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis unavailable.";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
    } finally {
      setStreaming(false);
    }
  }, [input, selectedMode, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const currentModeConfig = MODES.find((m) => m.id === selectedMode);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-zinc-800/60 px-6 py-4">
        <h1 className="text-base font-semibold text-zinc-100">Intelligence</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          {currentModeConfig?.description ?? "Select a mode to begin."}
        </p>
      </div>

      {/* Mode selector */}
      <div className="border-b border-zinc-800/60 px-6 py-3">
        <ModeSelector
          selectedMode={selectedMode}
          onSelect={setSelectedMode}
          allowances={allowances}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-40">
            <div className="h-12 w-12 rounded bg-amber-900/30 border border-amber-800/30 flex items-center justify-center">
              <span className="text-amber-600 text-lg font-bold">C</span>
            </div>
            <p className="text-sm text-zinc-500">
              Select a mode and ask a question to begin.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={[
                "max-w-2xl rounded-lg px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-zinc-800 text-zinc-100 ml-12"
                  : "bg-transparent text-zinc-200 mr-12",
              ].join(" ")}
            >
              {msg.content || (
                <span className="inline-flex gap-1 text-zinc-600">
                  <span className="animate-pulse">...</span>
                </span>
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-sm rounded px-4 py-2">
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800/60 px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={streaming}
            placeholder={`Ask Chairman AI... (${currentModeConfig?.label ?? "select a mode"})`}
            rows={3}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:border-amber-600 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || streaming}
            className="flex-shrink-0 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {streaming ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[11px] text-zinc-700 mt-2">
          Cloud Intelligence — messages are processed by Chairman AI servers. Press Shift+Enter for new line.
        </p>
      </div>

      {/* Confirmation dialog */}
      {pendingConfirm && currentModeConfig && (
        <ConfirmationDialog
          mode={currentModeConfig}
          onConfirm={() => {
            const fn = pendingConfirm;
            setPendingConfirm(null);
            fn();
          }}
          onCancel={() => setPendingConfirm(null)}
        />
      )}
    </div>
  );
}
