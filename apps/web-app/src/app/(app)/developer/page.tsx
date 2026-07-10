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

// ─── 3. Ready Workflow APIs ────────────────────────────────────────────────────
interface WorkflowCard {
  name: string;
  short: string;
  bestFor: string[];
  solves: string[];
  returns: string[];
  endpoint: string;
  ctaLabel: string;
  ctaTarget: string;
  safetyNote?: string;
  extraNote?: string;
  extraList?: string[];
}

const WORKFLOW_CARDS: WorkflowCard[] = [
  {
    name: "Guidance API",
    short: "Guide users before they submit weak, incomplete, or risky information.",
    bestFor: ["Onboarding flows", "User profiles", "Job applications", "Service requests", "Business listings", "Investor forms", "Marketplace submissions"],
    solves: ["Users don't know what to write", "Profiles are incomplete", "Forms are abandoned", "Listings are low quality", "Support teams waste time explaining what's missing"],
    returns: ["Missing facts", "Weak fields", "Next best actions", "Confidence level", "User-friendly guidance", "Structured checklist"],
    endpoint: "POST /v1/guidance/profile-check",
    ctaLabel: "Add guided onboarding",
    ctaTarget: "api-keys",
  },
  {
    name: "Readiness API",
    short: "Score whether a profile, post, listing, request, or application is ready to publish.",
    bestFor: ["Job posts", "Service provider profiles", "Real estate listings", "Investor listings", "Application forms", "Company profiles", "Public marketplace cards"],
    solves: ["Low-quality listings", "Weak job posts", "Profiles published too early", "Missing business details", "Admin teams manually reviewing everything"],
    returns: ["Readiness score", "Readiness level", "Missing required fields", "Optional improvements", "Publish warnings", "Next action"],
    endpoint: "POST /v1/readiness/job-post",
    ctaLabel: "Improve content quality",
    ctaTarget: "api-keys",
  },
  {
    name: "Draft API",
    short: "Generate safe drafts that users must approve before publishing.",
    bestFor: ["Video CV scripts", "Job post descriptions", "Service request descriptions", "Company summaries", "Investor summaries", "Application messages"],
    solves: ["Users struggle to write professionally", "Companies publish unclear job posts", "Service requests lack detail", "Users copy weak generic text"],
    returns: ["Safe draft", "Change summary", "Safety notes", "Editable version", "Suggested next action"],
    endpoint: "POST /v1/drafts/improve",
    ctaLabel: "Generate safer drafts",
    ctaTarget: "api-keys",
    safetyNote: "Chairman drafts never invent achievements, salaries, certificates, or business results unless the user provides them.",
  },
  {
    name: "Risk Check API",
    short: "Detect unsupported claims, missing proof, risky language, and weak business data.",
    bestFor: ["Job posts", "Public profiles", "Investment listings", "Property listings", "Service provider claims", "Company descriptions"],
    solves: ["Fake or exaggerated claims", "Unclear promises", "Unsupported numbers", "Risky public wording", "Missing proof before publishing"],
    returns: ["Risk level", "Flagged claims", "Missing proof", "Unsupported statements", "Safer wording", "Recommended fix"],
    endpoint: "POST /v1/risk/check",
    ctaLabel: "Protect platform trust",
    ctaTarget: "api-keys",
  },
  {
    name: "Pulse Events API",
    short: "Understand where users get stuck, abandon flows, or hit errors.",
    bestFor: ["SaaS dashboards", "Marketplaces", "Onboarding journeys", "Video recording flows", "Application funnels", "Checkout flows"],
    solves: ["Users abandon forms", "Camera/microphone errors are invisible", "Admins don't know where users get stuck", "Support tickets arrive after the problem"],
    returns: ["Event status", "Flow insight", "Failure reason", "Severity level", "Recommended product fix", "Operational log"],
    endpoint: "POST /v1/pulse/events",
    ctaLabel: "Add Pulse intelligence",
    ctaTarget: "pricing",
    extraList: ["profile_publish_blocked", "video_cv_cancelled", "camera_permission_denied", "job_application_abandoned", "service_request_abandoned"],
    safetyNote: "Pulse sends safe metadata only. No passwords, private messages, payment data, or ID files.",
  },
  {
    name: "Decision Memo API",
    short: "Turn business data into structured decision briefs for managers, investors, and teams.",
    bestFor: ["Investor platforms", "Management dashboards", "Deal review", "Internal approvals", "Board summaries", "Strategic decisions"],
    solves: ["Scattered business information", "Unclear options", "Slow decision-making", "Weak executive summaries", "No clear recommendation"],
    returns: ["Executive summary", "Options", "Pros and cons", "Risks", "Confidence level", "Recommendation", "Next step"],
    endpoint: "POST /v1/decision/memo",
    ctaLabel: "Create decision briefs",
    ctaTarget: "api-keys",
  },
  {
    name: "Custom Workflow API",
    short: "Build private endpoints for your exact platform, industry, and business rules.",
    bestFor: ["SaaS companies", "Marketplaces", "Private portals", "Investor clubs", "Real estate platforms", "Internal enterprise systems"],
    solves: ["Generic AI doesn't understand the business flow", "Every platform has different rules", "Developers don't want to build prompt systems from zero"],
    returns: ["Custom structured output", "Workflow-specific scoring", "Client-specific rules", "Safe drafts", "Audit logs", "Private endpoint documentation"],
    endpoint: "POST /v1/workflows/{client}/{workflow}",
    ctaLabel: "Request custom workflow",
    ctaTarget: "custom-workflow",
  },
  {
    name: "Translation & Localization API",
    short: "Adapt business guidance across languages without sounding like machine translation.",
    bestFor: ["Arabic/English platforms", "GCC companies", "International marketplaces", "Recruitment platforms", "Education platforms"],
    solves: ["Translated content sounds unnatural", "Arabic output feels like translated English", "Tone doesn't match local business culture", "Platforms need RTL-ready outputs"],
    returns: ["Localized text", "Language-specific tone", "RTL/LTR display hints", "Translated safe drafts", "Next actions in the selected language"],
    endpoint: "POST /v1/localization/business-text",
    ctaLabel: "Localize workflows",
    ctaTarget: "api-keys",
  },
  {
    name: "Compliance Guard API",
    short: "Keep AI output inside the rules your business defines.",
    bestFor: ["Regulated platforms", "Job platforms", "Investment platforms", "Legal document workflows", "Financial service portals", "Enterprise systems"],
    solves: ["AI inventing facts", "AI making promises", "Risky wording", "False verification claims", "Content that violates platform policy"],
    returns: ["Blocked phrases", "Policy warnings", "Safe replacement", "Approval requirement", "Compliance notes", "Retry/fallback result"],
    endpoint: "POST /v1/compliance/guard",
    ctaLabel: "Control AI output",
    ctaTarget: "api-keys",
    extraNote: "This is not legal advice. It is platform policy and content safety guidance.",
  },
  {
    name: "Business Scoring API",
    short: "Turn messy user input into clear business scores your dashboard can use.",
    bestFor: ["Profile completion", "Provider trust", "Buyer seriousness", "Listing quality", "Job post quality", "Application strength", "Deal readiness"],
    solves: ["Admins can't quickly compare quality", "Platforms need ranking signals", "Users need clear progress", "Manual review is slow"],
    returns: ["Score", "Score reason", "Missing data", "Improvement actions", "Risk flags", "Dashboard-ready fields"],
    endpoint: "POST /v1/scoring/business-readiness",
    ctaLabel: "Add business scoring",
    ctaTarget: "api-keys",
  },
];

function ReadyWorkflowApisSection() {
  return (
    <Wrap id="api-products" alt>
      <SHead
        eyebrow="API Products"
        title="Ready Business Workflow APIs"
        subtitle="Plug controlled business intelligence into the places where your users make decisions, submit forms, publish profiles, apply for jobs, request services, or create listings."
      />
      <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.7, marginBottom: 36, maxWidth: 760 }}>
        Instead of sending a raw prompt to a general AI model, Chairman API gives your platform structured business outputs your product can use immediately: scores, missing facts, safe drafts, warnings, next actions, and approval-ready recommendations.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {WORKFLOW_CARDS.map(card => (
          <div key={card.name} style={{ padding: "28px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{card.name}</p>
              <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.55 }}>{card.short}</p>
            </div>

            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>BEST FOR</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {card.bestFor.map(item => (
                  <div key={item} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.goldText, fontSize: 9, flexShrink: 0, marginTop: 4 }}>▸</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>SOLVES</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {card.solves.map(item => (
                  <div key={item} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.danger, fontSize: 9, flexShrink: 0, marginTop: 4 }}>✗</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>RETURNS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {card.returns.map(item => (
                  <div key={item} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.gold, fontSize: 9, flexShrink: 0, marginTop: 4 }}>✓</span>
                    <span style={{ fontSize: 12, color: C.textSec }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {card.safetyNote && (
              <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", lineHeight: 1.5, borderLeft: `2px solid ${C.border}`, paddingLeft: 10 }}>
                {card.safetyNote}
              </p>
            )}

            {card.extraList && (
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>EXAMPLE EVENTS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {card.extraList.map(item => (
                    <code key={item} style={{ fontSize: 11, fontFamily: "monospace", color: C.goldText }}>{item}</code>
                  ))}
                </div>
              </div>
            )}

            {card.extraNote && (
              <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", lineHeight: 1.5 }}>{card.extraNote}</p>
            )}

            <div style={{ marginTop: "auto" }}>
              <code style={{ fontSize: 11, fontFamily: "monospace", color: C.goldText, background: "rgba(0,0,0,0.25)", padding: "6px 10px", borderRadius: 6, display: "block", marginBottom: 12 }}>
                {card.endpoint}
              </code>
              <button
                onClick={() => jumpTo(card.ctaTarget)}
                style={{ width: "100%", padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 7, background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}
              >
                {card.ctaLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 4. Who Should Use ────────────────────────────────────────────────────────
interface PersonaCard {
  title: string;
  pain: string;
  chairman: string;
  pack: string[];
  ctaLabel: string;
  ctaTarget: string;
}

const PERSONAS: PersonaCard[] = [
  {
    title: "SaaS Founders",
    pain: "You need AI features but don't want to build prompts, safety, scoring, and logs from scratch.",
    chairman: "Ready workflows, structured outputs, usage control, and admin visibility.",
    pack: ["Guidance API", "Readiness API", "Pulse Events"],
    ctaLabel: "See workflows",
    ctaTarget: "api-products",
  },
  {
    title: "Marketplace Owners",
    pain: "Users publish weak profiles, unclear requests, and low-quality listings.",
    chairman: "Guidance, readiness scoring, safer drafts, and trust signals.",
    pack: ["Guidance API", "Readiness API", "Risk Check API"],
    ctaLabel: "See workflows",
    ctaTarget: "api-products",
  },
  {
    title: "Recruitment Platforms",
    pain: "Job seekers struggle to present themselves, and companies publish weak job posts.",
    chairman: "Profile guidance, video CV scripts, job fit, job post readiness.",
    pack: ["Recruitment Pack", "Guidance API", "Readiness API"],
    ctaLabel: "See industry packs",
    ctaTarget: "industry-packs",
  },
  {
    title: "Real Estate Platforms",
    pain: "Listings lack proof, buyers are hard to qualify, and investment details are incomplete.",
    chairman: "Listing readiness, buyer seriousness, risk flags, investment summaries.",
    pack: ["Real Estate Pack", "Readiness API", "Risk Check API"],
    ctaLabel: "See industry packs",
    ctaTarget: "industry-packs",
  },
  {
    title: "Investor Platforms",
    pain: "Business opportunities need structure before investors can review them.",
    chairman: "Deal memos, missing facts, introduction risk, investor-ready summaries.",
    pack: ["Investor Pack", "Decision Memo API"],
    ctaLabel: "See industry packs",
    ctaTarget: "industry-packs",
  },
  {
    title: "Service Marketplaces",
    pain: "Providers don't explain services well and customers submit unclear requests.",
    chairman: "Provider guidance, request improvement, trust scoring, draft replies.",
    pack: ["Services Pack", "Draft API", "Business Scoring API"],
    ctaLabel: "See workflows",
    ctaTarget: "api-products",
  },
  {
    title: "Agencies and Consultants",
    pain: "Clients need AI features but custom implementation takes too long.",
    chairman: "White-label workflows, custom endpoints, business-ready API products.",
    pack: ["Custom Workflow API"],
    ctaLabel: "Request custom setup",
    ctaTarget: "custom-workflow",
  },
  {
    title: "Enterprise Teams",
    pain: "Internal workflows need control, auditability, and safe outputs.",
    chairman: "Private workflows, custom rules, logs, admin control, optional private deployment.",
    pack: ["Compliance Guard", "Custom Workflow", "Private Enterprise"],
    ctaLabel: "Request Enterprise",
    ctaTarget: "custom-workflow",
  },
  {
    title: "Developers",
    pain: "Normal AI APIs are powerful but require too much prompt engineering and validation.",
    chairman: "Ready endpoints, structured JSON, policy guard, retry/sanitize/fallback.",
    pack: ["All APIs", "Sandbox Plan"],
    ctaLabel: "Start Sandbox",
    ctaTarget: "api-keys",
  },
  {
    title: "Non-technical Business Owners",
    pain: "You want smart features in your platform but don't know how to design AI logic.",
    chairman: "Business workflows that can be connected by your developer without building everything from zero.",
    pack: ["All packs available"],
    ctaLabel: "Talk to Chairman AI",
    ctaTarget: "final-cta",
  },
];

function WhoShouldUseSection() {
  return (
    <Wrap id="who-should-use">
      <SHead
        eyebrow="For platforms"
        title="Who should use Chairman API?"
        subtitle="Built for platforms where users must complete serious business actions — not just chat."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {PERSONAS.map(persona => (
          <div key={persona.title} style={{ padding: "24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{persona.title}</p>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 5 }}>CHALLENGE</p>
              <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.55 }}>{persona.pain}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 5 }}>CHAIRMAN GIVES YOU</p>
              <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.55 }}>{persona.chairman}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>SUGGESTED PACK</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {persona.pack.map(p => (
                  <span key={p} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.goldText }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => jumpTo(persona.ctaTarget)}
              style={{ marginTop: "auto", padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 7, background: "none", border: `1px solid ${C.border}`, color: C.textMuted, width: "100%" }}
            >
              {persona.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 5. Industry Packs ────────────────────────────────────────────────────────
interface IndustryPack {
  name: string;
  forLine: string;
  workflows: string[];
  outputs: string[];
  note?: string;
}

const INDUSTRY_PACKS_DATA: IndustryPack[] = [
  {
    name: "Recruitment Pack",
    forLine: "Job boards, HR platforms, CV builders, hiring marketplaces",
    workflows: ["Job seeker profile check", "Video CV script", "Improve script", "Job fit", "Job post readiness"],
    outputs: ["Readiness score", "Script draft", "Missing facts", "Fit guidance"],
  },
  {
    name: "Real Estate Pack",
    forLine: "Property platforms, brokers, investment listing sites",
    workflows: ["Listing readiness", "Buyer seriousness", "Property risk check", "Investment summary"],
    outputs: ["Listing score", "Missing documents", "Risk flags", "Buyer questions"],
  },
  {
    name: "Investor Platform Pack",
    forLine: "Investor clubs, business-for-sale platforms, funding marketplaces",
    workflows: ["Investor profile guidance", "Business listing readiness", "Deal memo", "Introduction risk"],
    outputs: ["Deal summary", "Missing facts", "Risk level", "Next action"],
  },
  {
    name: "Services Marketplace Pack",
    forLine: "Freelance platforms, service request apps, local service marketplaces",
    workflows: ["Provider profile check", "Service request improvement", "Quote guidance", "Trust score"],
    outputs: ["Provider score", "Request draft", "Missing info", "Trust suggestions"],
  },
  {
    name: "Education Pack",
    forLine: "Schools, course platforms, training portals",
    workflows: ["Student profile guidance", "Course fit", "Application review", "Study plan draft"],
    outputs: ["Fit level", "Missing info", "Plan draft", "Next action"],
  },
  {
    name: "E-commerce Pack",
    forLine: "Marketplaces, product sellers, catalog platforms",
    workflows: ["Product listing readiness", "Buyer support draft", "Return-risk guidance", "Product Q&A improvement"],
    outputs: ["Listing score", "Missing specs", "Safer descriptions", "Support draft"],
  },
  {
    name: "CRM / Sales Pack",
    forLine: "Sales teams, lead platforms, CRM products",
    workflows: ["Lead quality score", "Follow-up draft", "Sales script improvement", "Deal risk"],
    outputs: ["Lead score", "Follow-up draft", "Risk flags", "Next step"],
  },
  {
    name: "Legal Document Review Pack",
    forLine: "Document platforms, compliance teams, admin review tools",
    workflows: ["Missing facts", "Clause summary", "Risky wording", "Document readiness"],
    outputs: ["Missing points", "Risk notes", "Plain-language summary"],
    note: "Does not constitute legal advice.",
  },
  {
    name: "Hospitality / Travel Pack",
    forLine: "Travel platforms, hotels, concierge apps, rental platforms",
    workflows: ["Guest request improvement", "Listing quality check", "Complaint response draft", "Booking issue summary"],
    outputs: ["Clear request", "Response draft", "Issue level", "Next action"],
  },
  {
    name: "Custom Private System Pack",
    forLine: "Companies with unique workflows",
    workflows: ["Built around your exact forms, users, rules, and approval process"],
    outputs: ["Custom structured JSON", "Custom scoring", "Private workflow logic"],
  },
];

function IndustryPacksSection() {
  return (
    <Wrap id="industry-packs" alt>
      <SHead
        eyebrow="Industry Packs"
        title="Start faster with ready workflow packs."
        subtitle="Industry-specific workflow packs adapted to your business type."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {INDUSTRY_PACKS_DATA.map(pack => (
          <div key={pack.name} style={{ padding: "24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{pack.name}</p>
              <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: C.goldText }}>For:</span> {pack.forLine}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>WORKFLOWS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {pack.workflows.map(w => (
                  <div key={w} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.goldText, fontSize: 9, flexShrink: 0, marginTop: 4 }}>▸</span>
                    <span style={{ fontSize: 12, color: C.textSec }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 6 }}>OUTPUTS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {pack.outputs.map(o => (
                  <div key={o} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.gold, fontSize: 9, flexShrink: 0, marginTop: 4 }}>✓</span>
                    <span style={{ fontSize: 12, color: C.textSec }}>{o}</span>
                  </div>
                ))}
              </div>
            </div>
            {pack.note && (
              <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic" }}>{pack.note}</p>
            )}
            <button
              onClick={() => jumpTo("custom-workflow")}
              style={{ marginTop: "auto", padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none", border: `1px solid ${C.border}`, borderRadius: 7, color: C.textMuted, width: "100%" }}
            >
              Request this pack
            </button>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 6. Process Flow ──────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  { num: "1", title: "User submits data", desc: "A profile, job post, request, listing, or business form." },
  { num: "2", title: "Chairman applies workflow rules", desc: "The API understands what the platform is trying to achieve." },
  { num: "3", title: "Safety checks run", desc: "Unsupported claims, fake numbers, risky wording, and missing proof are detected." },
  { num: "4", title: "Structured output returns", desc: "Scores, missing facts, risks, safe drafts, and next actions." },
  { num: "5", title: "User approves", desc: "Nothing is auto-published without user or platform approval." },
  { num: "6", title: "Platform improves", desc: "Better content, fewer abandoned flows, stronger trust, cleaner data." },
];

function ProcessFlowSection() {
  return (
    <Wrap id="process-flow">
      <SHead
        eyebrow="How it works"
        title="From raw input to business output."
        subtitle="Chairman API transforms user data into structured, safe, approval-ready business intelligence."
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
        {PROCESS_STEPS.map((step, i) => (
          <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
            <div style={{ padding: "20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, minWidth: 160, maxWidth: 200, flex: "1 1 160px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.gold, marginBottom: 8, lineHeight: 1 }}>{step.num}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>{step.title}</p>
              <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.55 }}>{step.desc}</p>
            </div>
            {i < PROCESS_STEPS.length - 1 && (
              <div style={{ alignSelf: "center", fontSize: 18, color: C.gold, fontWeight: 700, padding: "0 4px", flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 7. Structured Output ─────────────────────────────────────────────────────
const OUTPUT_EXAMPLE = `{
  "completionPercentage": 72,
  "readinessLevel": "almost_ready",
  "missingFacts": [
    "Previous company name",
    "Video CV",
    "Location preference"
  ],
  "risks": [
    "Experience mentioned but not supported with examples"
  ],
  "nextBestActions": [
    "Add a short video CV",
    "Add one real example of your sales experience"
  ],
  "safeDraft": "Suggested profile summary...",
  "requiresUserApproval": true
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
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Example response — Profile Guidance API</span>
            <CopyButton text={OUTPUT_EXAMPLE} />
          </div>
          <pre style={{ margin: 0, padding: "18px 16px", fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, overflowX: "auto", whiteSpace: "pre" }}>
            {OUTPUT_EXAMPLE}
          </pre>
          <div style={{ padding: "10px 16px 14px", borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>
              This response can be shown directly inside your product UI. Your platform gets structure, not just text.
            </p>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

// ─── 8. Developer Examples ────────────────────────────────────────────────────
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

// ─── 9. Implementation Options ────────────────────────────────────────────────
const IMPL_OPTIONS = [
  {
    title: "API only",
    desc: "For teams with developers. Use REST endpoints and structured JSON. Start in minutes with any language.",
    ctaLabel: "Start Sandbox",
    ctaTarget: "api-keys",
  },
  {
    title: "API + ready UI blocks",
    desc: "For platforms that want faster implementation. Use prebuilt guidance cards, draft panels, readiness widgets.",
    ctaLabel: "Talk to Chairman AI",
    ctaTarget: "final-cta",
  },
  {
    title: "Custom workflow setup",
    desc: "For businesses that need a private workflow designed around their own forms, users, and rules.",
    ctaLabel: "Request custom workflow",
    ctaTarget: "custom-workflow",
  },
  {
    title: "Enterprise / private deployment",
    desc: "For companies needing stronger data control, custom routing, and dedicated support.",
    ctaLabel: "Request Enterprise",
    ctaTarget: "custom-workflow",
  },
];

function ImplementationOptionsSection() {
  return (
    <Wrap id="implementation" alt>
      <SHead
        eyebrow="Integration"
        title="How you can integrate."
        subtitle="Choose the integration path that fits your team and timeline."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {IMPL_OPTIONS.map(opt => (
          <div key={opt.title} style={{ padding: "24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{opt.title}</p>
            <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6, flex: 1 }}>{opt.desc}</p>
            <button
              onClick={() => jumpTo(opt.ctaTarget)}
              style={{ padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 7, background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold, width: "100%" }}
            >
              {opt.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 10. Pulse ────────────────────────────────────────────────────────────────
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

// ─── 11. Safety Strip ─────────────────────────────────────────────────────────
const SAFETY_ITEMS = [
  "No unsupported claims",
  "No fake numbers",
  "No fake certificates",
  "No auto-publish",
  "User approval required",
  "Rate limits included",
  "Safe metadata for Pulse",
  "Manual fallback supported",
];

function SafetyStripSection() {
  return (
    <section id="safety-strip" style={{ borderTop: `1px solid ${C.goldBorder}`, borderBottom: `1px solid ${C.goldBorder}`, background: "rgba(201,168,76,0.04)", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 20, textAlign: "center" }}>Built for platforms where trust matters.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {SAFETY_ITEMS.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 9999, border: `1px solid ${C.goldBorder}`, background: "rgba(201,168,76,0.06)" }}>
              <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 12, color: C.textSec }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 12. Pricing ──────────────────────────────────────────────────────────────
const PRICING_PLANS = [
  {
    key: "sandbox",
    name: "API Sandbox",
    price: "$9",
    desc: "Test Chairman workflows before connecting production. For developers, founders, and agencies.",
    forLine: "Developers, founders, agencies testing Chairman API",
    features: ["300 API calls / month", "Standard mode", "1 project", "Developer test dashboard", "Basic structured outputs"],
    note: "Not for production-heavy usage",
    popular: false,
    ctaLabel: "Start Sandbox",
  },
  {
    key: "starter",
    name: "API Starter",
    price: "$19",
    desc: "Add guidance to one product flow without building your own AI system. For small websites and first live integrations.",
    forLine: "Small websites and first live integrations",
    features: ["1,000 API calls / month", "Standard + Guidance workflows", "30 requests / minute", "1 project", "Basic safety validation", "Usage dashboard"],
    popular: false,
    ctaLabel: "Start Starter",
  },
  {
    key: "business",
    name: "API Business",
    price: "$49",
    desc: "The best plan for platforms that want real workflows, scoring, drafts, and Pulse intelligence.",
    forLine: "Active platforms and marketplaces",
    features: ["5,000 API calls / month", "All workflow APIs", "Industry pack included", "Arabic + English", "Pulse events", "Admin dashboard", "Safety validation", "Custom rules"],
    popular: true,
    ctaLabel: "Choose Business",
  },
  {
    key: "growth",
    name: "API Growth",
    price: "$149",
    desc: "For teams that need higher volume, multiple workflows, custom endpoints, and operational intelligence.",
    forLine: "SaaS platforms and growing marketplaces",
    features: ["25,000 API calls / month", "Multiple workflows", "Custom endpoints", "Webhooks", "Pulse intelligence", "Higher rate limits", "Priority routing"],
    popular: false,
    ctaLabel: "Scale with Growth",
  },
  {
    key: "enterprise",
    name: "Private Enterprise",
    price: "From $399",
    desc: "A private Chairman API setup built around your business rules, workflows, and approval process.",
    forLine: "Serious companies and private systems",
    features: ["Custom volume", "Private business constitution", "Custom workflows", "Advanced logs", "Dedicated routing", "Optional private deployment", "Custom integration support"],
    popular: false,
    ctaLabel: "Request Enterprise",
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
            <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, lineHeight: 1.4 }}>{plan.desc}</p>
            <p style={{ fontSize: 10, color: C.goldText, marginBottom: 16, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 600 }}>For:</span> {plan.forLine}
            </p>
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
            {"note" in plan && plan.note && <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginBottom: 14 }}>{plan.note}</p>}
            <button
              onClick={() => jumpTo(plan.key === "enterprise" ? "custom-workflow" : "api-keys")}
              style={{ padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, width: "100%", background: plan.popular ? C.goldFaint : "rgba(255,255,255,0.04)", border: plan.popular ? `1px solid ${C.goldBorder}` : `1px solid ${C.border}`, color: plan.popular ? C.gold : C.textSec }}
            >
              {plan.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── 13. Custom Workflow ──────────────────────────────────────────────────────
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

// ─── 14. Final CTA ────────────────────────────────────────────────────────────
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
      <ReadyWorkflowApisSection />
      <WhoShouldUseSection />
      <IndustryPacksSection />
      <ProcessFlowSection />
      <StructuredOutputSection />
      <DeveloperExamplesSection />
      <ImplementationOptionsSection />
      <PulseSection />
      <SafetyStripSection />
      <PricingSection />
      <CustomWorkflowSection />
      <FinalCtaSection />
    </div>
  );
}
