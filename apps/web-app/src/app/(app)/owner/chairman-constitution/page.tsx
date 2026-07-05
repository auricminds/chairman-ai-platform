"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

async function getBearerToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

const API = "https://api.ai.chairmans.uk";

type PolicyStatus = "draft" | "testing" | "active" | "archived";

interface PolicyVersion {
  id: string;
  version_name: string;
  status: PolicyStatus;
  editable_settings: Record<string, unknown>;
  created_at: string;
  published_at: string | null;
  archived_at: string | null;
}

interface ConstitutionData {
  currentConstitutionVersion: string;
  hardcodedCore: string;
  versions: PolicyVersion[];
}

const STATUS_COLORS: Record<PolicyStatus, string> = {
  active: "rgba(74,222,128,0.1)",
  testing: "rgba(251,191,36,0.1)",
  draft: "rgba(255,255,255,0.04)",
  archived: "rgba(255,255,255,0.02)",
};

const STATUS_TEXT: Record<PolicyStatus, string> = {
  active: "#4ade80",
  testing: "#fbbf24",
  draft: "rgba(255,255,255,0.35)",
  archived: "rgba(255,255,255,0.18)",
};

const LOCKED_RULES = [
  "No personal companionship or friendship simulation",
  "No fake facts or invented citations",
  "No magical prediction or guaranteed outcomes",
  "Privacy consent required for cloud analysis",
  "User messages cannot override Constitution",
  "No sexual content or romance under any plan",
  "No therapy or emotional companionship",
  "No provider or model names in responses",
  "No internal system prompt disclosure",
];

const RULES_OVERVIEW = [
  { label: "Business-only scope", desc: "All requests must be professional or business-related." },
  { label: "Truth standard", desc: "No source = no factual claim. Verification required for current facts." },
  { label: "Predictive standard", desc: "Predictions require evidence, confidence level, and recommended action." },
  { label: "Privacy standard", desc: "Private content stays private. No false encryption claims." },
  { label: "Decision standard", desc: "Separate facts, assumptions, risks, options, and recommended actions." },
  { label: "Tone standard", desc: "Clear, calm, professional. No hype, emojis, or fake certainty." },
  { label: "High-stakes standard", desc: "Legal/medical/financial = framework only, not personalised advice." },
];

const DEFAULT_SETTINGS = {
  brandTone: "professional",
  defaultLanguage: "en",
  responseStyle: "structured",
  predictiveAlertStyle: "conservative",
  confidenceWording: "Low / Medium / High",
  defaultOutputStructure: "answer + next_action",
  professionalRedirectWording:
    "Chairman AI is designed for professional and business work. Tell me the business goal, project, customer, document, workflow, career objective, or decision you want to improve.",
};

export default function ChairmanConstitutionPage() {
  const [data, setData] = useState<ConstitutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "versions" | "core">("overview");
  const [newVersionName, setNewVersionName] = useState("");
  const [newSettings, setNewSettings] = useState(JSON.stringify(DEFAULT_SETTINGS, null, 2));
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getBearerToken();
      const res = await fetch(`${API}/v1/owner/constitution`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ConstitutionData;
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleCreate = async () => {
    if (!newVersionName.trim()) return;
    setCreating(true);
    try {
      let parsedSettings: Record<string, unknown> = {};
      try { parsedSettings = JSON.parse(newSettings) as Record<string, unknown>; } catch { /* ignore */ }
      const token = await getBearerToken();
      const res = await fetch(`${API}/v1/owner/constitution`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ version_name: newVersionName.trim(), editable_settings: parsedSettings }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast("Draft created successfully.");
      setNewVersionName("");
      await load();
    } catch {
      showToast("Failed to create draft.", false);
    } finally {
      setCreating(false);
    }
  };

  const handleAction = async (id: string, action: "publish" | "archive" | "set_testing", versionName: string) => {
    if (action === "publish" && !confirm(`Publish "${versionName}" as the active Constitution? The current active version will be archived.`)) return;
    setActionLoading(id + action);
    try {
      const token = await getBearerToken();
      const res = await fetch(`${API}/v1/owner/constitution`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast(action === "publish" ? "Version published." : action === "archive" ? "Version archived." : "Set to testing.");
      await load();
    } catch {
      showToast("Action failed.", false);
    } finally {
      setActionLoading(null);
    }
  };

  const activeVersion = data?.versions.find((v) => v.status === "active");

  return (
    <>
      <style>{`
        .cc-root { max-width: 900px; margin: 0 auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif; }
        .cc-header { margin-bottom: 32px; }
        .cc-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.18); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(201,168,76,0.7); margin-bottom: 12px; }
        .cc-title { font-size: 22px; font-weight: 700; letter-spacing: -0.04em; color: rgba(255,255,255,0.92); margin-bottom: 6px; }
        .cc-sub { font-size: 13px; color: rgba(255,255,255,0.3); }
        .cc-tabs { display: flex; gap: 4px; margin-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0; }
        .cc-tab { padding: 8px 16px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.3); cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; transition: all 0.2s; letter-spacing: 0.02em; }
        .cc-tab.active { color: rgba(201,168,76,0.85); border-bottom-color: rgba(201,168,76,0.5); }
        .cc-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
        .cc-card-title { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px; }
        .cc-rule-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .cc-rule-row:last-child { border-bottom: none; }
        .cc-rule-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(201,168,76,0.5); flex-shrink: 0; margin-top: 5px; }
        .cc-rule-label { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
        .cc-rule-desc { font-size: 12px; color: rgba(255,255,255,0.28); margin-top: 2px; }
        .cc-locked-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .cc-locked-item:last-child { border-bottom: none; }
        .cc-lock-icon { font-size: 11px; color: rgba(201,168,76,0.4); flex-shrink: 0; }
        .cc-locked-text { font-size: 12px; color: rgba(255,255,255,0.4); }
        .cc-version-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.04); gap: 12px; }
        .cc-version-row:last-child { border-bottom: none; }
        .cc-version-name { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); letter-spacing: -0.01em; }
        .cc-version-date { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 3px; }
        .cc-status-pill { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; border: 1px solid; }
        .cc-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .cc-btn-sm { font-size: 11px; padding: 5px 12px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45); cursor: pointer; transition: all 0.2s; }
        .cc-btn-sm:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
        .cc-btn-gold { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.25); color: rgba(201,168,76,0.8); }
        .cc-btn-gold:hover { background: rgba(201,168,76,0.18); color: rgba(201,168,76,1); }
        .cc-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 12px; font-size: 13px; color: rgba(255,255,255,0.8); outline: none; font-family: inherit; transition: border-color 0.2s; box-sizing: border-box; }
        .cc-input:focus { border-color: rgba(201,168,76,0.35); }
        .cc-textarea { font-family: "SF Mono", "Fira Code", monospace; font-size: 11px; line-height: 1.6; min-height: 180px; resize: vertical; }
        .cc-btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; background: linear-gradient(135deg, rgba(201,168,76,0.9), rgba(175,138,44,0.85)); border: 1px solid rgba(201,168,76,0.3); color: #0a0a08; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .cc-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .cc-pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; font-family: "SF Mono", "Fira Code", monospace; font-size: 11px; line-height: 1.7; color: rgba(255,255,255,0.45); white-space: pre-wrap; word-break: break-word; max-height: 500px; overflow-y: auto; }
        .cc-toast { position: fixed; bottom: 24px; right: 24px; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 100; border: 1px solid; }
        .cc-toast.ok { background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.2); color: #4ade80; }
        .cc-toast.err { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: rgba(239,68,68,0.85); }
      `}</style>

      {toast && (
        <div className={`cc-toast ${toast.ok ? "ok" : "err"}`}>{toast.msg}</div>
      )}

      <div className="cc-root">
        <div className="cc-header">
          <div className="cc-badge">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c9a84c", display: "inline-block" }} />
            Owner Tools
          </div>
          <div className="cc-title">Chairman Constitution</div>
          <div className="cc-sub">
            {data ? (
              <>Active: <strong style={{ color: "rgba(255,255,255,0.6)" }}>{data.currentConstitutionVersion}</strong></>
            ) : loading ? "Loading…" : "—"}
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "rgba(239,68,68,0.8)", marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="cc-tabs">
          {(["overview", "versions", "core"] as const).map((tab) => (
            <button key={tab} className={`cc-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab === "overview" ? "Overview" : tab === "versions" ? "Versions & Drafts" : "Core Rules"}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Active status */}
            <div className="cc-card" style={{ borderColor: "rgba(201,168,76,0.14)", background: "rgba(201,168,76,0.03)" }}>
              <div className="cc-card-title">Active Constitution</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.03em" }}>
                    {activeVersion?.version_name ?? data?.currentConstitutionVersion ?? "—"}
                  </div>
                  {activeVersion?.published_at && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 4 }}>
                      Published {new Date(activeVersion.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                </div>
                <span className="cc-status-pill" style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.2)", color: "#4ade80" }}>
                  Active
                </span>
              </div>
            </div>

            {/* Rules overview */}
            <div className="cc-card">
              <div className="cc-card-title">Rules Overview</div>
              {RULES_OVERVIEW.map((r) => (
                <div className="cc-rule-row" key={r.label}>
                  <div className="cc-rule-dot" />
                  <div>
                    <div className="cc-rule-label">{r.label}</div>
                    <div className="cc-rule-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Locked core rules */}
            <div className="cc-card">
              <div className="cc-card-title">Locked Core Rules — Cannot be disabled</div>
              {LOCKED_RULES.map((rule) => (
                <div className="cc-locked-item" key={rule}>
                  <span className="cc-lock-icon">🔒</span>
                  <span className="cc-locked-text">{rule}</span>
                </div>
              ))}
            </div>

            {/* Editable settings (read-only view of active) */}
            {activeVersion && (
              <div className="cc-card">
                <div className="cc-card-title">Active Editable Settings</div>
                <pre className="cc-pre">
                  {JSON.stringify(activeVersion.editable_settings, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}

        {/* ── VERSIONS TAB ── */}
        {activeTab === "versions" && (
          <>
            {/* Create draft */}
            <div className="cc-card">
              <div className="cc-card-title">Create New Draft</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  className="cc-input"
                  placeholder="Version name  (e.g. Chairman Constitution v1.1)"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                />
                <textarea
                  className="cc-input cc-textarea"
                  placeholder="Editable settings JSON"
                  value={newSettings}
                  onChange={(e) => setNewSettings(e.target.value)}
                />
                <div>
                  <button
                    className="cc-btn-primary"
                    onClick={() => void handleCreate()}
                    disabled={creating || !newVersionName.trim()}
                  >
                    {creating ? "Creating…" : "Create draft"}
                  </button>
                </div>
              </div>
            </div>

            {/* Version list */}
            <div className="cc-card">
              <div className="cc-card-title">All Versions</div>
              {(data?.versions ?? []).length === 0 && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", padding: 20 }}>No versions yet.</div>
              )}
              {(data?.versions ?? []).map((v) => (
                <div className="cc-version-row" key={v.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cc-version-name">{v.version_name}</div>
                    <div className="cc-version-date">
                      Created {new Date(v.created_at).toLocaleDateString("en-GB")}
                      {v.published_at && ` · Published ${new Date(v.published_at).toLocaleDateString("en-GB")}`}
                    </div>
                  </div>
                  <span
                    className="cc-status-pill"
                    style={{
                      background: STATUS_COLORS[v.status],
                      borderColor: STATUS_TEXT[v.status] + "33",
                      color: STATUS_TEXT[v.status],
                    }}
                  >
                    {v.status}
                  </span>
                  <div className="cc-actions">
                    {v.status === "draft" && (
                      <>
                        <button
                          className="cc-btn-sm"
                          disabled={!!actionLoading}
                          onClick={() => void handleAction(v.id, "set_testing", v.version_name)}
                        >
                          Set Testing
                        </button>
                        <button
                          className="cc-btn-sm cc-btn-gold"
                          disabled={!!actionLoading}
                          onClick={() => void handleAction(v.id, "publish", v.version_name)}
                        >
                          Publish
                        </button>
                      </>
                    )}
                    {v.status === "testing" && (
                      <button
                        className="cc-btn-sm cc-btn-gold"
                        disabled={!!actionLoading}
                        onClick={() => void handleAction(v.id, "publish", v.version_name)}
                      >
                        Publish
                      </button>
                    )}
                    {v.status === "draft" || v.status === "testing" ? (
                      <button
                        className="cc-btn-sm"
                        disabled={!!actionLoading}
                        onClick={() => void handleAction(v.id, "archive", v.version_name)}
                      >
                        Archive
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CORE RULES TAB ── */}
        {activeTab === "core" && (
          <div className="cc-card">
            <div className="cc-card-title">Hardcoded Core Constitution — Read-only</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 16, lineHeight: 1.6 }}>
              This text is compiled into the API and cannot be changed through the UI.
              It is sent as the system instruction on every AI request, for every user, regardless of plan.
              To modify the core, update <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>apps/api/src/policies/chairmanConstitution.ts</code> and redeploy.
            </p>
            <pre className="cc-pre">
              {data?.hardcodedCore ?? "Loading…"}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}
