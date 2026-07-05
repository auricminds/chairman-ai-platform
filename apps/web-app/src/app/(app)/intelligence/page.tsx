"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { streamChat, fetchEntitlements } from "@/lib/api/client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

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
}

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
}

export default function IntelligencePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState("business");
  const [streaming, setStreaming] = useState(false);
  const [allowances, setAllowances] = useState<ModeAllowance[]>([]);
  const [pendingConfirm, setPendingConfirm] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("conversations")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setConversations(data);
      });
  }, []);

  // Fetch entitlements
  useEffect(() => {
    fetchEntitlements()
      .then((data: { modes?: ModeAllowance[] }) => {
        if (data.modes) setAllowances(data.modes);
      })
      .catch(() => {});
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (convId: string) => {
    setActiveConvId(convId);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);
  };

  const startNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setInput("");
    setError(null);
  };

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

    // Use existing or create new conversation ID
    const convId = activeConvId ?? uuidv4();
    if (!activeConvId) setActiveConvId(convId);

    const userMsg: Message = { id: uuidv4(), role: "user", content: text };
    const assistantMsg: Message = { id: uuidv4(), role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    try {
      const gen = streamChat({
        conversationId: convId,
        message: text,
        chairmanMode: mode,
        cloudConsent: true,
        idempotencyKey: userMsg.id,
      });

      for await (const chunk of gen) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m)
        );
      }

      // Refresh conversation list (title may have been set server-side)
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("conversations")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setConversations(data);

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
  }, [input, selectedMode, streaming, activeConvId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  const currentMode = MODES.find((m) => m.id === selectedMode);
  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <>
      <style>{`
        /* ── Conversation panel ── */
        .conv-panel {
          width: 260px;
          min-width: 260px;
          height: 100%;
          background: #070708;
          border-right: 1px solid rgba(255,255,255,0.04);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
        }

        .conv-panel-header {
          padding: 16px 14px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }

        .conv-new-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 10px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.18);
          color: rgba(201,168,76,0.85);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }

        .conv-new-btn:hover {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.28);
          color: rgba(201,168,76,1);
        }

        .conv-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 6px;
        }

        .conv-empty {
          padding: 24px 14px;
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.18);
          line-height: 1.6;
        }

        .conv-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
          margin-bottom: 1px;
        }

        .conv-item:hover {
          background: rgba(255,255,255,0.04);
        }

        .conv-item.active {
          background: rgba(201,168,76,0.07);
        }

        .conv-item-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        .conv-item.active .conv-item-dot {
          background: rgba(201,168,76,0.7);
        }

        .conv-item-title {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .conv-item.active .conv-item-title {
          color: rgba(255,255,255,0.75);
        }

        /* ── Chat panel ── */
        .chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #060608;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
        }

        .chat-header {
          padding: 14px 24px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .chat-header-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          letter-spacing: -0.02em;
        }

        /* Mode pills */
        .mode-bar {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 11px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.06);
          background: transparent;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }

        .mode-pill:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.65);
        }

        .mode-pill.active {
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.07);
          color: rgba(201,168,76,0.9);
        }

        .mode-pill:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .mode-pill-badge {
          font-size: 9px;
          padding: 1px 4px;
          border-radius: 3px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
        }

        .mode-pill.active .mode-pill-badge {
          background: rgba(201,168,76,0.1);
          color: rgba(201,168,76,0.55);
        }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .chat-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
        }

        .chat-empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.13);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(201,168,76,0.05);
        }

        .chat-empty-icon img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          filter: drop-shadow(0 0 4px rgba(201,168,76,0.25));
        }

        .chat-empty-label {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        .chat-empty-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          max-width: 240px;
          line-height: 1.65;
        }

        .msg-row { margin-bottom: 18px; display: flex; }
        .msg-row.user { justify-content: flex-end; }
        .msg-row.assistant { justify-content: flex-start; }

        .msg-bubble-user {
          max-width: 66%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px 14px 3px 14px;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.65;
          color: rgba(255,255,255,0.82);
        }

        .msg-bubble-ai {
          max-width: 78%;
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.68);
          padding: 2px 0;
        }

        /* Markdown rendering inside AI bubbles */
        .msg-bubble-ai p { margin-bottom: 10px; }
        .msg-bubble-ai p:last-child { margin-bottom: 0; }
        .msg-bubble-ai strong { color: rgba(255,255,255,0.88); font-weight: 600; }
        .msg-bubble-ai em { color: rgba(255,255,255,0.6); font-style: italic; }
        .msg-bubble-ai h1, .msg-bubble-ai h2, .msg-bubble-ai h3 {
          color: rgba(255,255,255,0.85);
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 16px 0 8px;
          line-height: 1.3;
        }
        .msg-bubble-ai h1 { font-size: 16px; }
        .msg-bubble-ai h2 { font-size: 14px; }
        .msg-bubble-ai h3 { font-size: 13px; }
        .msg-bubble-ai ul, .msg-bubble-ai ol {
          margin: 8px 0 10px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .msg-bubble-ai ul { list-style: disc; }
        .msg-bubble-ai ol { list-style: decimal; }
        .msg-bubble-ai li { color: rgba(255,255,255,0.62); }
        .msg-bubble-ai code {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 5px;
          padding: 1px 6px;
          font-family: "SF Mono", "Fira Code", monospace;
          font-size: 11.5px;
          color: rgba(201,168,76,0.85);
        }
        .msg-bubble-ai pre {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 14px 16px;
          margin: 10px 0;
          overflow-x: auto;
        }
        .msg-bubble-ai pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: rgba(255,255,255,0.65);
          font-size: 12px;
        }
        .msg-bubble-ai blockquote {
          border-left: 2px solid rgba(201,168,76,0.3);
          padding-left: 12px;
          margin: 8px 0;
          color: rgba(255,255,255,0.4);
          font-style: italic;
        }
        .msg-bubble-ai hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 12px 0;
        }

        .thinking {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .thinking-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(201,168,76,0.45);
          animation: blink 1.2s ease-in-out infinite;
        }

        .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }

        /* Input */
        .chat-input-wrap {
          padding: 14px 24px 18px;
          border-top: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }

        .chat-input-shell {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 3px;
          transition: border-color 0.25s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }

        .chat-input-shell:focus-within {
          border-color: rgba(201,168,76,0.22);
          box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 0 3px rgba(201,168,76,0.04);
        }

        .chat-input-inner {
          background: #0b0c0f;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }

        .chat-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          color: rgba(255,255,255,0.82);
          resize: none;
          line-height: 1.6;
          min-height: 20px;
          max-height: 160px;
          overflow-y: auto;
        }

        .chat-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .chat-textarea:disabled { opacity: 0.4; }

        .chat-send {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, rgba(201,168,76,0.9), rgba(201,168,76,0.65));
          border: 1px solid rgba(201,168,76,0.28);
          color: #090909;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 2px 8px rgba(201,168,76,0.12);
        }

        .chat-send:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(201,168,76,0.22);
        }

        .chat-send:active:not(:disabled) { transform: scale(0.94); }
        .chat-send:disabled { opacity: 0.25; cursor: not-allowed; }

        .chat-hint {
          font-size: 10px;
          color: rgba(255,255,255,0.13);
          margin-top: 7px;
          padding: 0 2px;
          letter-spacing: 0.02em;
        }

        .chat-error {
          margin: 10px 0;
          display: flex;
          justify-content: center;
        }

        .chat-error-inner {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.16);
          color: rgba(239,68,68,0.75);
          font-size: 12px;
          padding: 7px 12px;
          border-radius: 9px;
        }

        /* Confirm dialog */
        .confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(8px);
        }

        .confirm-shell {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 5px;
          width: 100%;
          max-width: 360px;
          margin: 0 20px;
          box-shadow: 0 32px 64px rgba(0,0,0,0.7);
        }

        .confirm-inner {
          background: #0c0e12;
          border-radius: 16px;
          padding: 26px 22px;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .confirm-inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent);
        }

        .confirm-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.88);
          margin-bottom: 7px;
        }

        .confirm-body {
          font-size: 12px;
          color: rgba(255,255,255,0.32);
          line-height: 1.65;
          margin-bottom: 18px;
        }

        .confirm-actions {
          display: flex;
          gap: 7px;
          justify-content: flex-end;
        }

        .confirm-cancel {
          padding: 8px 14px;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.07);
          background: transparent;
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .confirm-cancel:hover {
          border-color: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.55);
        }

        .confirm-proceed {
          padding: 8px 14px;
          border-radius: 9px;
          background: linear-gradient(135deg, rgba(201,168,76,0.9), rgba(201,168,76,0.7));
          border: 1px solid rgba(201,168,76,0.3);
          color: #0a0a0a;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(201,168,76,0.14);
        }

        .confirm-proceed:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(201,168,76,0.24);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

        {/* ── Conversation sidebar ── */}
        <div className="conv-panel">
          <div className="conv-panel-header">
            <button className="conv-new-btn" onClick={startNewChat}>
              <svg style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New conversation
            </button>
          </div>

          <div className="conv-list">
            {conversations.length === 0 ? (
              <div className="conv-empty">No conversations yet</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conv-item${conv.id === activeConvId ? " active" : ""}`}
                  onClick={() => void loadConversation(conv.id)}
                >
                  <div className="conv-item-dot" />
                  <span className="conv-item-title">
                    {conv.title ?? "New conversation"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <span className="chat-header-title">
              {activeConv?.title ?? "New conversation"}
            </span>
          </div>

          {/* Mode bar */}
          <div className="mode-bar">
            <div
              className="mode-pill"
              style={{ cursor: "not-allowed", opacity: 0.3 }}
              title="Runs on your device. Use Chairman AI Desktop."
            >
              <svg style={{ width: 10, height: 10 }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Private
              <span className="mode-pill-badge">Desktop</span>
            </div>

            {MODES.map((mode) => {
              const allowance = getAllowance(mode.id);
              const locked = allowance?.lockedReason != null;
              const exhausted = allowance?.remaining !== null && allowance?.remaining !== undefined && allowance.remaining <= 0;

              return (
                <button
                  key={mode.id}
                  className={`mode-pill${selectedMode === mode.id ? " active" : ""}`}
                  onClick={() => !locked && !exhausted && setSelectedMode(mode.id)}
                  disabled={locked || exhausted}
                  title={locked ? (allowance?.lockedReason ?? "") : mode.description}
                >
                  {mode.label}
                  {allowance?.monthlyLimit != null && (
                    <span className="mode-pill-badge">
                      {exhausted ? "0 left" : `${allowance.remaining} left`}
                    </span>
                  )}
                  {mode.confirmRequired && !locked && !exhausted && (
                    <span className="mode-pill-badge">confirm</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-icon.png" alt="" />
                </div>
                <div className="chat-empty-label">Ready for your brief</div>
                <div className="chat-empty-sub">
                  Select an intelligence mode above, then type your question.
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`msg-row ${msg.role}`}>
                  {msg.role === "user" ? (
                    <div className="msg-bubble-user">{msg.content}</div>
                  ) : (
                    <div className="msg-bubble-ai">
                      {msg.content ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <div className="thinking">
                          <div className="thinking-dot" />
                          <div className="thinking-dot" />
                          <div className="thinking-dot" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {error && (
              <div className="chat-error">
                <div className="chat-error-inner">{error}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-wrap">
            <div className="chat-input-shell">
              <div className="chat-input-inner">
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={streaming}
                  placeholder="Message Chairman AI…"
                  rows={1}
                />
                <button
                  className="chat-send"
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || streaming}
                >
                  {streaming ? (
                    <svg style={{ width: 12, height: 12, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="chat-hint">
              Enter to send · Shift+Enter for new line · Cloud Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {pendingConfirm && currentMode && (
        <div className="confirm-overlay">
          <div className="confirm-shell">
            <div className="confirm-inner">
              <div className="confirm-title">{currentMode.label} Analysis</div>
              <div className="confirm-body">
                This uses 1 {currentMode.label} from your monthly allowance and cannot be undone.
              </div>
              <div className="confirm-actions">
                <button className="confirm-cancel" onClick={() => setPendingConfirm(null)}>Cancel</button>
                <button
                  className="confirm-proceed"
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
    </>
  );
}
