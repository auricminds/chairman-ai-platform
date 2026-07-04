"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { streamChat, fetchEntitlements } from "@/lib/api/client";

const MODES = [
  { id: "business",  label: "Business",  description: "Business strategy, market analysis, operational decisions.", confirmRequired: false },
  { id: "extended",  label: "Extended",  description: "Deep research briefs, long document analysis.",             confirmRequired: false },
  { id: "strategic", label: "Strategic", description: "Strategic planning, competitive analysis, positioning.",    confirmRequired: false },
  { id: "executive", label: "Executive", description: "High-stakes decisions, executive briefings.",               confirmRequired: true  },
  { id: "board",     label: "Board",     description: "Board-level reporting, governance, investor-grade.",        confirmRequired: true  },
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const getAllowance = (modeId: string) => allowances.find((a) => a.mode === modeId);

  const sendMessage = useCallback(async (confirmedMode?: string) => {
    const mode = confirmedMode ?? selectedMode;
    const text = input.trim();
    if (!text || streaming) return;

    const modeConfig = MODES.find((m) => m.id === mode);
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
          prev.map((m) => m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m)
        );
      }

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

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  const currentMode = MODES.find((m) => m.id === selectedMode);

  return (
    <>
      <style>{`
        .intel-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #060608;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          position: relative;
        }

        /* Subtle top glow */
        .intel-root::before {
          content: '';
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 300px;
          background: radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Header */
        .intel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 28px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .intel-header-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.85);
        }

        .intel-header-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
          letter-spacing: 0.01em;
        }

        /* Mode pills */
        .intel-modes {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .intel-mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.01em;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.32,0.72,0,1);
        }

        .intel-mode-pill:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
        }

        .intel-mode-pill.selected {
          border-color: rgba(201,168,76,0.35);
          background: rgba(201,168,76,0.07);
          color: rgba(201,168,76,0.9);
        }

        .intel-mode-pill.locked {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .intel-mode-badge {
          font-size: 9px;
          padding: 1px 5px;
          border-radius: 4px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.02em;
        }

        .intel-mode-pill.selected .intel-mode-badge {
          background: rgba(201,168,76,0.12);
          color: rgba(201,168,76,0.6);
        }

        .intel-private-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.04);
          background: transparent;
          color: rgba(255,255,255,0.18);
          cursor: not-allowed;
        }

        /* Messages */
        .intel-messages {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
          position: relative;
          z-index: 1;
        }

        .intel-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          gap: 14px;
        }

        .intel-empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 24px rgba(201,168,76,0.06);
        }

        .intel-empty-icon img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          filter: drop-shadow(0 0 4px rgba(201,168,76,0.3));
        }

        .intel-empty-title {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.5);
        }

        .intel-empty-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          max-width: 280px;
          line-height: 1.6;
        }

        .intel-msg-row {
          display: flex;
          margin-bottom: 20px;
        }

        .intel-msg-row.user {
          justify-content: flex-end;
        }

        .intel-msg-row.assistant {
          justify-content: flex-start;
        }

        .intel-bubble-user {
          max-width: 68%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px 16px 4px 16px;
          padding: 12px 16px;
          font-size: 13px;
          line-height: 1.65;
          color: rgba(255,255,255,0.85);
        }

        .intel-bubble-assistant {
          max-width: 80%;
          font-size: 13px;
          line-height: 1.75;
          color: rgba(255,255,255,0.75);
          padding: 4px 0;
        }

        .intel-bubble-assistant .intel-thinking {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: rgba(201,168,76,0.5);
          font-size: 12px;
        }

        .intel-thinking-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(201,168,76,0.5);
          animation: thinkPulse 1.2s ease-in-out infinite;
        }

        .intel-thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .intel-thinking-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes thinkPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        /* Input area */
        .intel-input-area {
          padding: 16px 28px 20px;
          border-top: 1px solid rgba(255,255,255,0.04);
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .intel-input-shell {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 4px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.3);
          transition: border-color 0.25s ease;
        }

        .intel-input-shell:focus-within {
          border-color: rgba(201,168,76,0.25);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.3), 0 0 0 3px rgba(201,168,76,0.04);
        }

        .intel-input-inner {
          background: #0a0b0e;
          border-radius: 13px;
          padding: 12px 14px;
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }

        .intel-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          color: rgba(255,255,255,0.85);
          resize: none;
          line-height: 1.6;
          min-height: 22px;
          max-height: 160px;
          overflow-y: auto;
        }

        .intel-textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .intel-textarea:disabled {
          opacity: 0.5;
        }

        .intel-send-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,0.9), rgba(201,168,76,0.65));
          border: 1px solid rgba(201,168,76,0.3);
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s ease, opacity 0.2s;
          box-shadow: 0 2px 8px rgba(201,168,76,0.15);
        }

        .intel-send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(201,168,76,0.25);
        }

        .intel-send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .intel-send-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .intel-input-hint {
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          margin-top: 8px;
          padding: 0 4px;
          letter-spacing: 0.02em;
        }

        /* Error */
        .intel-error {
          display: flex;
          justify-content: center;
          margin: 12px 0;
        }

        .intel-error-inner {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: rgba(239,68,68,0.8);
          font-size: 12px;
          padding: 8px 14px;
          border-radius: 10px;
        }

        /* Confirmation dialog */
        .intel-confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
        }

        .intel-confirm-outer {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 5px;
          width: 100%;
          max-width: 380px;
          margin: 0 20px;
          box-shadow: 0 32px 64px rgba(0,0,0,0.7);
        }

        .intel-confirm-inner {
          background: #0c0e12;
          border-radius: 16px;
          padding: 28px 24px;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .intel-confirm-inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent);
        }

        .intel-confirm-title {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.9);
          margin-bottom: 8px;
        }

        .intel-confirm-body {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .intel-confirm-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .intel-confirm-cancel {
          padding: 9px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .intel-confirm-cancel:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
        }

        .intel-confirm-proceed {
          padding: 9px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,0.9), rgba(201,168,76,0.7));
          border: 1px solid rgba(201,168,76,0.35);
          color: #0a0a0a;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.32,0.72,0,1);
          box-shadow: 0 2px 8px rgba(201,168,76,0.15);
        }

        .intel-confirm-proceed:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201,168,76,0.25);
        }
      `}</style>

      <div className="intel-root">
        {/* Header */}
        <div className="intel-header">
          <div>
            <div className="intel-header-title">Intelligence</div>
            <div className="intel-header-desc">{currentMode?.description ?? "Select a mode to begin."}</div>
          </div>
        </div>

        {/* Mode pills */}
        <div className="intel-modes">
          {/* Private — desktop only */}
          <div className="intel-private-pill" title="Runs on your device. Use Chairman AI Desktop.">
            <svg style={{ width: 11, height: 11 }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            Private
            <span className="intel-mode-badge">Desktop</span>
          </div>

          {MODES.map((mode) => {
            const allowance = getAllowance(mode.id);
            const locked = allowance?.lockedReason != null;
            const exhausted = allowance?.remaining !== null && allowance?.remaining !== undefined && allowance.remaining <= 0;
            const isSelected = selectedMode === mode.id;

            return (
              <button
                key={mode.id}
                className={[
                  "intel-mode-pill",
                  isSelected ? "selected" : "",
                  locked || exhausted ? "locked" : "",
                ].join(" ")}
                onClick={() => !locked && !exhausted && setSelectedMode(mode.id)}
                disabled={locked || exhausted}
                title={locked ? (allowance?.lockedReason ?? "Not available") : mode.description}
              >
                {mode.label}
                {allowance?.monthlyLimit !== null && allowance?.monthlyLimit !== undefined && (
                  <span className="intel-mode-badge">
                    {exhausted ? "0 left" : `${allowance.remaining} left`}
                  </span>
                )}
                {mode.confirmRequired && !locked && !exhausted && (
                  <span className="intel-mode-badge">confirm</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Messages */}
        <div className="intel-messages">
          {messages.length === 0 && (
            <div className="intel-empty">
              <div className="intel-empty-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon.png" alt="" />
              </div>
              <div className="intel-empty-title">Ready for your brief</div>
              <div className="intel-empty-sub">
                Select an intelligence mode above, then ask your question.
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`intel-msg-row ${msg.role}`}>
              {msg.role === "user" ? (
                <div className="intel-bubble-user">{msg.content}</div>
              ) : (
                <div className="intel-bubble-assistant">
                  {msg.content ? (
                    msg.content
                  ) : (
                    <div className="intel-thinking">
                      <div className="intel-thinking-dot" />
                      <div className="intel-thinking-dot" />
                      <div className="intel-thinking-dot" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="intel-error">
              <div className="intel-error-inner">{error}</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="intel-input-area">
          <div className="intel-input-shell">
            <div className="intel-input-inner">
              <textarea
                ref={textareaRef}
                className="intel-textarea"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={streaming}
                placeholder={`Brief Chairman AI — ${currentMode?.label ?? "select a mode"}`}
                rows={1}
              />
              <button
                className="intel-send-btn"
                onClick={() => void sendMessage()}
                disabled={!input.trim() || streaming}
              >
                {streaming ? (
                  <svg style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="intel-input-hint">
            Cloud Intelligence · processed by Chairman AI servers · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Confirmation dialog */}
      {pendingConfirm && currentMode && (
        <div className="intel-confirm-overlay">
          <div className="intel-confirm-outer">
            <div className="intel-confirm-inner">
              <div className="intel-confirm-title">{currentMode.label} Analysis</div>
              <div className="intel-confirm-body">
                This will use 1 {currentMode.label} from your monthly allowance. This action cannot be undone.
              </div>
              <div className="intel-confirm-actions">
                <button
                  className="intel-confirm-cancel"
                  onClick={() => setPendingConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="intel-confirm-proceed"
                  onClick={() => {
                    const fn = pendingConfirm;
                    setPendingConfirm(null);
                    fn();
                  }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
