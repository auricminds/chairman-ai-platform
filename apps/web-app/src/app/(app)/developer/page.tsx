"use client";

import { useEffect, useState } from "react";
import { listApiKeys, createApiKey, revokeApiKey, type ApiKey } from "@/lib/api/client";

const API_BASE_URL = "https://api.ai.chairmans.uk";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  gold:       "rgba(201,168,76,0.9)",
  goldFaint:  "rgba(201,168,76,0.1)",
  goldBorder: "rgba(201,168,76,0.22)",
  goldText:   "rgba(201,168,76,0.75)",
  card:       "rgba(255,255,255,0.026)",
  border:     "rgba(255,255,255,0.07)",
  text:       "rgba(255,255,255,0.88)",
  textSec:    "rgba(255,255,255,0.5)",
  textMuted:  "rgba(255,255,255,0.28)",
  danger:     "rgba(239,68,68,0.7)",
  success:    "rgba(74,222,128,0.75)",
} as const;

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { void navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      style={{ padding: "4px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer",
        border: `1px solid ${C.border}`, transition: "all 0.15s",
        background: copied ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.05)",
        color: copied ? C.success : C.textMuted }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── UsageBar ─────────────────────────────────────────────────────────────────
function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  if (!limit) return (
    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
      {used.toLocaleString()} requests used · Custom volume
    </div>
  );
  const pct = Math.min((used / limit) * 100, 100);
  const bar = pct > 90 ? C.danger : pct > 70 ? "rgba(251,191,36,0.7)" : C.goldText;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: bar, transition: "width 0.4s" }} />
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
        {used.toLocaleString()} / {limit.toLocaleString()} API calls this month
      </div>
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────
function Wrap({ id, children, alt }: { id?: string; children: React.ReactNode; alt?: boolean }) {
  return (
    <section id={id} style={{ padding: "72px 24px", background: alt ? "rgba(255,255,255,0.018)" : "transparent", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SHead({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div style={{ marginBottom: 44, textAlign: center ? "center" : "left" }}>
      {eyebrow && (
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: C.text, marginBottom: 10 }}>{title}</h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65, maxWidth: center ? 580 : 640, ...(center ? { margin: "0 auto" } : {}) }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ padding: "72px 24px 60px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", marginBottom: 16 }}>
          Chairman API
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.text, lineHeight: 1.2, marginBottom: 18 }}>
          Business Intelligence APIs<br />for serious platforms.
        </h1>
        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, marginBottom: 10, maxWidth: 620 }}>
          Add guided decisions, safe drafts, readiness scoring, risk checks, and Pulse intelligence to your product.
        </p>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, marginBottom: 36, maxWidth: 580, borderLeft: `2px solid ${C.goldBorder}`, paddingLeft: 14 }}>
          Chairman API is not a general chatbot API. It is a controlled business guidance layer for platforms, marketplaces, and private systems.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => jumpTo("api-keys")} style={{ padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold, letterSpacing: "0.02em" }}>
            Start Sandbox
          </button>
          <button onClick={() => jumpTo("api-products")} style={{ padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.textSec }}>
            View API Products
          </button>
          <button onClick={() => jumpTo("custom-workflow")} style={{ padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: `1px solid ${C.border}`, color: C.textMuted }}>
            Request Custom Workflow
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── API Keys (functional section) ───────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  api_starter:    "rgba(148,163,184,0.8)",
  api_pro:        "rgba(201,168,76,0.9)",
  api_enterprise: "rgba(139,92,246,0.9)",
};
const TIER_BG: Record<string, string> = {
  api_starter:    "rgba(148,163,184,0.08)",
  api_pro:        "rgba(201,168,76,0.08)",
  api_enterprise: "rgba(139,92,246,0.08)",
};

interface KeysSectionProps {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  showCreate: boolean;
  newName: string;
  newTier: string;
  creating: boolean;
  createdKey: string | null;
  revoking: string | null;
  onOpenCreate: () => void;
  onCancelCreate: () => void;
  onNameChange: (v: string) => void;
  onTierChange: (v: string) => void;
  onCreate: (e: React.FormEvent) => void;
  onRevoke: (id: string, name: string) => void;
  onDismissCreated: () => void;
}

function ApiKeysSection(p: KeysSectionProps) {
  const active = p.keys.filter(k => k.status === "active");
  return (
    <section id="api-keys" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px 40px" }}>

        {p.createdKey && (
          <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.success, marginBottom: 6, letterSpacing: "0.04em" }}>
                  KEY CREATED — COPY IT NOW. IT WILL NOT BE SHOWN AGAIN.
                </p>
                <code style={{ display: "block", fontSize: 12, fontFamily: "monospace", color: C.text, wordBreak: "break-all", background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: 6 }}>
                  {p.createdKey}
                </code>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <CopyButton text={p.createdKey} />
                <button onClick={p.onDismissCreated} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer", border: `1px solid ${C.border}`, background: "none", color: C.textMuted }}>Dismiss</button>
              </div>
            </div>
          </div>
        )}

        {p.error && (
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", fontSize: 13, color: C.danger }}>{p.error}</div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 2 }}>
              Your API Keys{active.length > 0 ? ` (${active.length} active)` : ""}
            </h2>
            <p style={{ fontSize: 12, color: C.textMuted }}>
              Base URL: <code style={{ fontFamily: "monospace", color: C.goldText, fontSize: 11 }}>{API_BASE_URL}</code>
            </p>
          </div>
          {!p.showCreate && (
            <button onClick={p.onOpenCreate} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${C.goldBorder}`, background: C.goldFaint, color: C.gold }}>
              + New key
            </button>
          )}
        </div>

        {p.showCreate && (
          <form onSubmit={p.onCreate} style={{ marginBottom: 16, padding: "18px 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 14 }}>Create new API key</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input value={p.newName} onChange={e => p.onNameChange(e.target.value)} placeholder="Key name (e.g. Production)" required
                style={{ flex: 2, minWidth: 180, padding: "8px 12px", borderRadius: 7, fontSize: 13, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: C.text, outline: "none" }} />
              <select value={p.newTier} onChange={e => p.onTierChange(e.target.value)}
                style={{ flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 7, fontSize: 13, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: C.text, outline: "none", cursor: "pointer" }}>
                <option value="api_starter">API Starter</option>
                <option value="api_pro">API Business</option>
                <option value="api_enterprise">Private Enterprise</option>
              </select>
              <button type="submit" disabled={p.creating}
                style={{ padding: "8px 18px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: p.creating ? "not-allowed" : "pointer", opacity: p.creating ? 0.6 : 1, background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
                {p.creating ? "Creating…" : "Create"}
              </button>
              <button type="button" onClick={p.onCancelCreate}
                style={{ padding: "8px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer", background: "none", border: `1px solid ${C.border}`, color: C.textMuted }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {p.loading ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Loading keys…</div>
        ) : p.keys.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.textMuted, fontSize: 13 }}>
            No API keys yet. Create one above to start integrating Chairman API.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {p.keys.map(key => (
              <div key={key.id} style={{ padding: "16px 18px", background: key.status === "revoked" ? C.card : "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 10, opacity: key.status === "revoked" ? 0.45 : 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{key.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em", background: TIER_BG[key.tier] ?? "rgba(255,255,255,0.05)", color: TIER_COLORS[key.tier] ?? C.textSec, border: `1px solid ${(TIER_COLORS[key.tier] ?? "rgba(255,255,255,0.2)").replace("0.9", "0.2").replace("0.8", "0.2")}` }}>
                        {key.planName}
                      </span>
                      {key.status === "revoked" && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.danger, padding: "2px 7px", borderRadius: 4, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>REVOKED</span>
                      )}
                    </div>
                    <code style={{ fontSize: 12, color: C.textMuted, fontFamily: "monospace" }}>{key.keyPreview}</code>
                    <UsageBar used={key.requestsUsed} limit={key.requestsLimit} />
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>
                      Created {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsedAt ? ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}` : " · Never used"}
                      {` · ${key.rateLimitRpm} req/min`}
                    </div>
                  </div>
                  {key.status === "active" && (
                    <button onClick={() => p.onRevoke(key.id, key.name)} disabled={p.revoking === key.id}
                      style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: p.revoking === key.id ? "not-allowed" : "pointer", opacity: p.revoking === key.id ? 0.5 : 1, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: C.danger }}>
                      {p.revoking === key.id ? "Revoking…" : "Revoke"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 2. Comparison ────────────────────────────────────────────────────────────
function ComparisonSection() {
  const generic = ["Raw chat completion", "Customer writes all rules", "No business workflow structure", "No built-in safety validation", "No readiness scoring", "No Pulse intelligence", "No approval workflow"];
  const chairman = ["Business workflow endpoints", "Client-specific rules", "Structured outputs", "Safe drafts", "Missing facts detection", "Risk warnings", "Readiness scores", "Next-best-action guidance", "Audit logs", "Pulse events"];
  return (
    <Wrap alt>
      <SHead eyebrow="Why Chairman API" title="Controlled workflows, not raw AI access." subtitle="Most AI APIs give you raw intelligence. Chairman API gives your platform structured, safe, business-grade output." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div style={{ padding: "28px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.09em", marginBottom: 20 }}>GENERIC AI APIS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {generic.map(t => (
              <div key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: C.danger, flexShrink: 0, marginTop: 1 }}>✗</span>
                <span style={{ fontSize: 13, color: C.textMuted }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "28px", background: "rgba(201,168,76,0.04)", border: `1px solid ${C.goldBorder}`, borderRadius: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.09em", marginBottom: 20 }}>CHAIRMAN API</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {chairman.map(t => (
              <div key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: C.gold, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: C.textSec }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrap>
  );
}

// ─── 3. Business Modes ────────────────────────────────────────────────────────
function BusinessModesSection() {
  const modes = [
    { key: "chairman-standard",  label: "Standard",  desc: "Practical, direct business guidance for everyday platform workflows.",                               tier: "All plans" },
    { key: "chairman-extended",  label: "Extended",  desc: "Deeper review for longer forms, profiles, listings, and structured documents.",                      tier: "Starter and above" },
    { key: "chairman-strategic", label: "Strategic", desc: "Planning, positioning, risk review, and competitive business analysis.",                              tier: "Business and above" },
    { key: "chairman-executive", label: "Executive", desc: "High-stakes summaries, decision briefs, and management-ready recommendations.",                       tier: "Growth and Enterprise" },
    { key: "chairman-board",     label: "Board",     desc: "Governance-grade analysis, investor reporting, and board-level decision memos.",                      tier: "Enterprise only" },
  ];
  return (
    <Wrap>
      <SHead eyebrow="Business Modes" title="Chairman Business Modes" subtitle="Each mode is a calibrated business workflow. Send the mode that fits your use case — no model selection required." />
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", overflowX: "auto" }}>
        {modes.map((m, i) => (
          <div key={m.key} style={{ display: "grid", gridTemplateColumns: "190px 1fr 160px", padding: "14px 18px", gap: 14, alignItems: "center", borderBottom: i < modes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", minWidth: 560 }}>
            <code style={{ fontSize: 12, fontFamily: "monospace", color: C.goldText }}>{m.key}</code>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, marginRight: 10 }}>{m.label}</span>
              <span style={{ fontSize: 12, color: C.textSec }}>{m.desc}</span>
            </div>
            <span style={{ fontSize: 11, color: C.textMuted, textAlign: "right" }}>{m.tier}</span>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 4. API Products ──────────────────────────────────────────────────────────
const API_PRODUCTS = [
  { name: "Guidance API",         use: "Profiles, forms, onboarding, applications, and user journeys.",                      returns: "Missing fields, risks, next actions, confidence.",           endpoint: "POST /v1/guidance/profile-check" },
  { name: "Draft API",            use: "Generate safe drafts users can approve before publishing.",                           returns: "Editable drafts, change summary, safety notes.",             endpoint: "POST /v1/drafts/improve" },
  { name: "Readiness API",        use: "Score if a profile, job post, listing, or request is ready.",                        returns: "Readiness score, missing data, publish warnings.",           endpoint: "POST /v1/readiness/job-post" },
  { name: "Risk Check API",       use: "Detect unsupported claims, missing proof, risky wording, or weak business data.",    returns: "Risk level, flagged claims, recommended fixes.",             endpoint: "POST /v1/risk/check" },
  { name: "Pulse Events API",     use: "Send product events and detect where users get stuck.",                               returns: "Event status, operational insight, recommended fixes.",       endpoint: "POST /v1/pulse/events" },
  { name: "Decision Memo API",    use: "Turn business data into a structured decision brief.",                                returns: "Summary, options, risks, recommendation, next step.",        endpoint: "POST /v1/decision/memo" },
  { name: "Custom Workflow API",  use: "Private workflows built for your exact platform and business rules.",                 returns: "Custom structured output based on your business rules.",     endpoint: "POST /v1/workflows/{client}/{workflow}" },
];

function ApiProductsSection() {
  return (
    <Wrap alt id="api-products">
      <SHead eyebrow="API Products" title="Choose your workflow." subtitle="Ready business workflow endpoints. Connect what your platform needs — or request a custom workflow built for your system." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {API_PRODUCTS.map(prod => (
          <div key={prod.name} style={{ padding: "22px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 5 }}>{prod.name}</p>
              <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.55 }}>{prod.use}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.textMuted, marginBottom: 4 }}>RETURNS</p>
              <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{prod.returns}</p>
            </div>
            <code style={{ fontSize: 11, fontFamily: "monospace", color: C.goldText, background: "rgba(0,0,0,0.25)", padding: "6px 10px", borderRadius: 6, display: "block", marginTop: "auto" }}>
              {prod.endpoint}
            </code>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 5. Industry Packs ────────────────────────────────────────────────────────
const INDUSTRY_PACKS = [
  { name: "Recruitment Platforms",   examples: ["Profile guidance", "Video CV scripts", "Job fit scoring", "Job post readiness"] },
  { name: "Real Estate Platforms",   examples: ["Listing readiness", "Buyer seriousness check", "Property risk check", "Investment summary"] },
  { name: "Investor Platforms",      examples: ["Investor profile check", "Business listing readiness", "Deal memo", "Introduction risk"] },
  { name: "Services Marketplaces",   examples: ["Provider trust scoring", "Request improvement", "Quote guidance", "Profile readiness"] },
  { name: "Education Platforms",     examples: ["Student profile guidance", "Course fit scoring", "Application review", "Learning plan drafts"] },
  { name: "E-commerce",              examples: ["Product listing readiness", "Buyer support drafts", "Return-risk guidance"] },
  { name: "CRM / Sales",             examples: ["Lead quality scoring", "Sales script improvement", "Follow-up drafting", "Deal risk check"] },
  { name: "Legal Document Review",   examples: ["Missing facts detection", "Risky wording check", "Clause summary", "Document readiness"] },
  { name: "Hospitality / Travel",    examples: ["Guest request improvement", "Listing quality check", "Complaint response drafts"] },
  { name: "Custom Private System",   examples: ["Private workflows", "Your exact business rules", "Custom structured outputs"] },
];

function IndustryPacksSection() {
  return (
    <Wrap>
      <SHead eyebrow="Industry Packs" title="Start faster with ready workflow packs." subtitle="Industry-specific workflow packs adapted to your business type. Deploy faster with pre-configured guidance rules." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {INDUSTRY_PACKS.map(pack => (
          <div key={pack.name} style={{ padding: "20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{pack.name}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {pack.examples.map(ex => (
                <div key={ex} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: C.goldText, fontSize: 10, flexShrink: 0, marginTop: 3 }}>▸</span>
                  <span style={{ fontSize: 12, color: C.textSec }}>{ex}</span>
                </div>
              ))}
            </div>
            <button onClick={() => jumpTo("custom-workflow")} style={{ marginTop: 4, padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none", border: `1px solid ${C.border}`, borderRadius: 7, color: C.textMuted, width: "100%" }}>
              Request this pack
            </button>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 6. Structured Output ─────────────────────────────────────────────────────
const OUTPUT_EXAMPLE = `{
  "readinessScore": 78,
  "confidence": "medium",
  "missingFacts": [
    "Salary range is missing",
    "Application deadline is missing"
  ],
  "risks": [
    "Benefits are mentioned but not clearly defined"
  ],
  "safeDraft": "Updated job post draft...",
  "nextBestAction": "Add salary range and deadline before publishing."
}`;

function StructuredOutputSection() {
  return (
    <Wrap alt>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
        <div>
          <SHead eyebrow="Structured Outputs" title="What Chairman API returns." subtitle="Every response is structured for product UI, dashboards, and approval workflows — not just plain text." />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Readiness scores ready for direct display", "Missing facts listed per field", "Risk warnings by severity", "Safe editable drafts", "Next-best-action guidance"].map(t => (
              <div key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: C.gold, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: C.textSec }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Example response — Readiness API</span>
            <CopyButton text={OUTPUT_EXAMPLE} />
          </div>
          <pre style={{ margin: 0, padding: "18px 16px", fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, overflowX: "auto", whiteSpace: "pre" }}>
            {OUTPUT_EXAMPLE}
          </pre>
        </div>
      </div>
    </Wrap>
  );
}

// ─── 7. Developer Examples ────────────────────────────────────────────────────
const DEV_EXAMPLES = [
  {
    label: "Profile Check",
    endpoint: "POST /v1/guidance/profile-check",
    code: `curl -X POST ${API_BASE_URL}/v1/guidance/profile-check \\
  -H "Authorization: Bearer sk-chairman-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "mode": "chairman-standard",
    "profileType": "job_seeker",
    "language": "en",
    "fields": {
      "targetRole": "Sales Executive",
      "yearsExperience": 4,
      "skills": ["sales", "client communication", "negotiation"]
    }
  }'`,
  },
  {
    label: "Job Post Readiness",
    endpoint: "POST /v1/readiness/job-post",
    code: `curl -X POST ${API_BASE_URL}/v1/readiness/job-post \\
  -H "Authorization: Bearer sk-chairman-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "mode": "chairman-extended",
    "jobTitle": "Senior Account Manager",
    "description": "...",
    "requirements": ["5+ years experience", "CRM proficiency"]
  }'`,
  },
  {
    label: "Pulse Event",
    endpoint: "POST /v1/pulse/events",
    code: `curl -X POST ${API_BASE_URL}/v1/pulse/events \\
  -H "Authorization: Bearer sk-chairman-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "job_application_abandoned",
    "sessionId": "sess_...",
    "metadata": {
      "step": "upload_cv",
      "timeOnStep": 142
    }
  }'`,
  },
];

function DeveloperExamplesSection() {
  return (
    <Wrap>
      <SHead eyebrow="Integration" title="Business workflow examples." subtitle="Connect Chairman API to your platform using structured business workflow endpoints." />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DEV_EXAMPLES.map(({ label, endpoint, code }) => (
          <div key={label} style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{label}</span>
                <code style={{ fontSize: 11, fontFamily: "monospace", color: C.goldText, background: C.goldFaint, padding: "2px 8px", borderRadius: 4 }}>{endpoint}</code>
              </div>
              <CopyButton text={code} />
            </div>
            <pre style={{ margin: 0, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre" }}>
              {code}
            </pre>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 8. Pricing ───────────────────────────────────────────────────────────────
const PRICING_PLANS = [
  {
    key: "sandbox",
    name: "API Sandbox",
    price: "$9",
    desc: "For testing and small experiments.",
    features: ["300 API calls / month", "Standard mode", "1 project", "Developer test dashboard", "Basic structured outputs"],
    note: "Not for production-heavy usage",
    popular: false,
  },
  {
    key: "starter",
    name: "API Starter",
    price: "$19",
    desc: "For small websites and early integrations.",
    features: ["1,000 API calls / month", "Standard + Guidance workflows", "30 requests / minute", "1 project", "Basic safety validation", "Usage dashboard"],
    popular: false,
  },
  {
    key: "business",
    name: "API Business",
    price: "$49",
    desc: "For active platforms that need real business workflows.",
    features: ["5,000 API calls / month", "All workflow APIs", "Industry pack included", "Arabic + English", "Pulse events", "Admin dashboard", "Safety validation", "Custom rules"],
    popular: true,
  },
  {
    key: "growth",
    name: "API Growth",
    price: "$149",
    desc: "For SaaS platforms and marketplaces with higher volume.",
    features: ["25,000 API calls / month", "Multiple workflows", "Custom endpoints", "Webhooks", "Pulse intelligence", "Higher rate limits", "Priority routing"],
    popular: false,
  },
  {
    key: "enterprise",
    name: "Private Enterprise",
    price: "From $399",
    desc: "For serious companies and private systems.",
    features: ["Custom volume", "Private business constitution", "Custom workflows", "Advanced logs", "Dedicated routing", "Optional private deployment", "Custom integration support"],
    popular: false,
  },
];

function PricingSection() {
  return (
    <Wrap alt id="pricing">
      <SHead center eyebrow="API Plans" title="Pricing built for platforms." subtitle="Start with a sandbox and scale to a private enterprise deployment." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {PRICING_PLANS.map(plan => (
          <div key={plan.key} style={{ padding: "24px 20px", background: plan.popular ? "rgba(201,168,76,0.05)" : C.card, border: plan.popular ? `1px solid ${C.goldBorder}` : `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", position: "relative" }}>
            {plan.popular && (
              <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: C.gold, color: "#111114", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 10, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                MOST POPULAR
              </span>
            )}
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{plan.name}</p>
            <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, lineHeight: 1.4 }}>{plan.desc}</p>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: plan.popular ? C.gold : C.text }}>{plan.price}</span>
              <span style={{ fontSize: 12, color: C.textMuted }}>/mo</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16, flex: 1 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: plan.popular ? C.gold : C.goldText, flexShrink: 0, fontSize: 11, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: C.textSec }}>{f}</span>
                </div>
              ))}
            </div>
            {plan.note && <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginBottom: 14 }}>{plan.note}</p>}
            <button
              onClick={() => jumpTo(plan.key === "enterprise" ? "custom-workflow" : "api-keys")}
              style={{ padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, width: "100%", background: plan.popular ? C.goldFaint : "rgba(255,255,255,0.04)", border: plan.popular ? `1px solid ${C.goldBorder}` : `1px solid ${C.border}`, color: plan.popular ? C.gold : C.textSec }}
            >
              {plan.key === "enterprise" ? "Contact Sales" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 9. Custom Workflow ───────────────────────────────────────────────────────
const CUSTOM_EXAMPLES = [
  { industry: "Recruitment",         endpoints: ["POST /v1/workflows/recruitment/video-cv-script", "POST /v1/workflows/recruitment/job-fit"] },
  { industry: "Real Estate",         endpoints: ["POST /v1/workflows/real-estate/listing-readiness", "POST /v1/workflows/real-estate/buyer-seriousness"] },
  { industry: "Investor Platforms",  endpoints: ["POST /v1/workflows/investors/deal-memo", "POST /v1/workflows/investors/introduction-risk"] },
  { industry: "Services Marketplace",endpoints: ["POST /v1/workflows/services/provider-trust", "POST /v1/workflows/services/request-improvement"] },
];

function CustomWorkflowSection() {
  return (
    <Wrap id="custom-workflow">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>
        <div>
          <SHead eyebrow="Custom API Workflows" title="Private endpoints built for your platform." subtitle="For each client, Chairman can create private workflow endpoints based on their exact platform rules and business context." />
          <button onClick={() => jumpTo("final-cta")} style={{ padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
            Request Custom Workflow
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CUSTOM_EXAMPLES.map(({ industry, endpoints }) => (
            <div key={industry} style={{ padding: "16px 18px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 10 }}>{industry}</p>
              {endpoints.map(ep => (
                <code key={ep} style={{ display: "block", fontSize: 11, fontFamily: "monospace", color: C.goldText, marginBottom: 4 }}>{ep}</code>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── 10. Safety ───────────────────────────────────────────────────────────────
const SAFETY_CONTROLS = [
  "No unsupported claims in outputs",
  "No invented numbers or statistics",
  "No unverified certificates or credentials",
  "Draft approval before publishing",
  "Missing facts detection per field",
  "Client rules enforced per workflow",
  "Audit-friendly structured outputs",
  "Rate limits and usage controls",
  "Manual fallback if API is unavailable",
];

function SafetySection() {
  return (
    <Wrap alt>
      <SHead eyebrow="Safety and Control" title="Built for controlled business output." subtitle="Chairman API is designed for platforms where trust matters. Every response is governed, validated, and auditable." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {SAFETY_CONTROLS.map(c => (
          <div key={c} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <span style={{ color: C.gold, flexShrink: 0, marginTop: 1 }}>✓</span>
            <span style={{ fontSize: 13, color: C.textSec }}>{c}</span>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 11. Pulse ────────────────────────────────────────────────────────────────
const PULSE_EVENTS = ["profile_publish_blocked", "video_cv_cancelled", "camera_permission_denied", "job_post_incomplete", "job_application_abandoned", "service_request_abandoned", "form_error", "route_error"];

function PulseSection() {
  return (
    <Wrap>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>
        <div>
          <SHead eyebrow="Pulse Intelligence" title="Chairman Pulse." subtitle="Send safe product events to Chairman API and understand exactly where users get stuck — and why." />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {["What happened in each session", "Why it matters to your product", "Which flows need immediate attention", "Suggested product fixes"].map(t => (
              <div key={t} style={{ display: "flex", gap: 9 }}>
                <span style={{ color: C.gold, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 13, color: C.textSec }}>{t}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, borderLeft: `2px solid ${C.border}`, paddingLeft: 12 }}>
            Only safe, non-sensitive metadata is sent. No personal data, no content from user inputs.
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 12 }}>EXAMPLE EVENTS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PULSE_EVENTS.map(e => (
              <code key={e} style={{ display: "block", fontSize: 12, fontFamily: "monospace", color: C.goldText, background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: 7, border: `1px solid ${C.border}` }}>
                {e}
              </code>
            ))}
          </div>
        </div>
      </div>
    </Wrap>
  );
}

// ─── 12. Final CTA ────────────────────────────────────────────────────────────
function FinalCtaSection() {
  return (
    <section id="final-cta" style={{ padding: "80px 24px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", marginBottom: 14 }}>Get Started</p>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: C.text, marginBottom: 12 }}>
          Build your own business intelligence layer.
        </h2>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65, marginBottom: 36 }}>
          Start with a sandbox, connect a ready workflow, or request a private Chairman API built for your platform.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => jumpTo("api-keys")} style={{ padding: "11px 26px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
            Start Sandbox
          </button>
          <button onClick={() => jumpTo("custom-workflow")} style={{ padding: "11px 26px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.textSec }}>
            Request Custom Workflow
          </button>
          <button onClick={() => jumpTo("custom-workflow")} style={{ padding: "11px 26px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: `1px solid ${C.border}`, color: C.textMuted }}>
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DeveloperPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("api_starter");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    listApiKeys()
      .then(setKeys)
      .catch(() => setError("Failed to load API keys."))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const result = await createApiKey(newName.trim(), newTier);
      setCreatedKey(result.key);
      setKeys(prev => [result, ...prev]);
      setNewName("");
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key.");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string, keyName: string) => {
    if (!confirm(`Revoke "${keyName}"? This cannot be undone.`)) return;
    setRevoking(keyId);
    try {
      await revokeApiKey(keyId);
      setKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: "revoked" as const } : k));
    } catch {
      setError("Failed to revoke key.");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div style={{ color: C.text }}>
      <Hero />
      <ApiKeysSection
        keys={keys}
        loading={loading}
        error={error}
        showCreate={showCreate}
        newName={newName}
        newTier={newTier}
        creating={creating}
        createdKey={createdKey}
        revoking={revoking}
        onOpenCreate={() => setShowCreate(true)}
        onCancelCreate={() => setShowCreate(false)}
        onNameChange={setNewName}
        onTierChange={setNewTier}
        onCreate={e => void handleCreate(e)}
        onRevoke={(id, name) => void handleRevoke(id, name)}
        onDismissCreated={() => setCreatedKey(null)}
      />
      <ComparisonSection />
      <BusinessModesSection />
      <ApiProductsSection />
      <IndustryPacksSection />
      <StructuredOutputSection />
      <DeveloperExamplesSection />
      <PricingSection />
      <CustomWorkflowSection />
      <SafetySection />
      <PulseSection />
      <FinalCtaSection />
    </div>
  );
}
