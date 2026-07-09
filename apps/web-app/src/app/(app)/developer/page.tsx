"use client";

import { useEffect, useState } from "react";
import { listApiKeys, createApiKey, revokeApiKey, fetchApiPlans, type ApiKey } from "@/lib/api/client";

const API_BASE_URL = "https://api.ai.chairmans.uk";

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} style={{
      padding: "4px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600,
      cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
      background: copied ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
      color: copied ? "rgba(74,222,128,0.8)" : "rgba(255,255,255,0.5)",
      transition: "all 0.15s",
    }}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  if (!limit) return (
    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
      {used.toLocaleString()} requests used · Unlimited
    </div>
  );
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct > 90 ? "rgba(239,68,68,0.7)" : pct > 70 ? "rgba(251,191,36,0.7)" : "rgba(201,168,76,0.7)";
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color, transition: "width 0.4s" }} />
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
        {used.toLocaleString()} / {limit.toLocaleString()} requests this month
      </div>
    </div>
  );
}

export default function DeveloperPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [plans, setPlans] = useState<Awaited<ReturnType<typeof fetchApiPlans>>["plans"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("api_starter");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  // Revoke state
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [keysData, plansData] = await Promise.all([listApiKeys(), fetchApiPlans()]);
        setKeys(keysData);
        setPlans(plansData.plans);
      } catch {
        setError("Failed to load API data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const result = await createApiKey(newName.trim(), newTier);
      setCreatedKey(result.key);
      setKeys((prev) => [result, ...prev]);
      setNewName("");
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key.");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string, keyName: string) => {
    if (!confirm(`Revoke "${keyName}"? This cannot be undone — any app using this key will stop working.`)) return;
    setRevoking(keyId);
    try {
      await revokeApiKey(keyId);
      setKeys((prev) => prev.map((k) => k.id === keyId ? { ...k, status: "revoked" as const } : k));
    } catch {
      setError("Failed to revoke key.");
    } finally {
      setRevoking(null);
    }
  };

  const activeKeys = keys.filter((k) => k.status === "active");

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 60px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", marginBottom: 6 }}>
          Developer API
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
          Integrate Chairman AI into your products. Base URL:{" "}
          <code style={{ fontFamily: "monospace", color: "rgba(201,168,76,0.8)", fontSize: 12 }}>{API_BASE_URL}</code>
        </p>
      </div>

      {/* New key — just created banner */}
      {createdKey && (
        <div style={{
          marginBottom: 24, padding: "16px 18px",
          background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(74,222,128,0.8)", marginBottom: 6, letterSpacing: "0.04em" }}>
                KEY CREATED — COPY IT NOW. IT WILL NOT BE SHOWN AGAIN.
              </p>
              <code style={{
                display: "block", fontSize: 12, fontFamily: "monospace",
                color: "rgba(255,255,255,0.85)", wordBreak: "break-all",
                background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: 6,
              }}>
                {createdKey}
              </code>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <CopyButton text={createdKey} />
              <button onClick={() => setCreatedKey(null)} style={{
                padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.08)", background: "none",
                color: "rgba(255,255,255,0.35)",
              }}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: 20, padding: "10px 14px", borderRadius: 8,
          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
          fontSize: 13, color: "rgba(239,68,68,0.85)",
        }}>{error}</div>
      )}

      {/* API Keys Section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            Your API Keys{activeKeys.length > 0 ? ` (${activeKeys.length})` : ""}
          </h2>
          {!showCreate && (
            <button onClick={() => setShowCreate(true)} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "1px solid rgba(201,168,76,0.35)",
              background: "rgba(201,168,76,0.1)", color: "rgba(201,168,76,0.9)",
            }}>
              + New key
            </button>
          )}
        </div>

        {/* Create form */}
        {showCreate && (
          <form onSubmit={handleCreate} style={{
            marginBottom: 16, padding: "18px 20px",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>
              Create new API key
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Key name (e.g. Production)"
                required
                style={{
                  flex: 2, minWidth: 180, padding: "8px 12px", borderRadius: 7, fontSize: 13,
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.85)", outline: "none",
                }}
              />
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                style={{
                  flex: 1, minWidth: 140, padding: "8px 12px", borderRadius: 7, fontSize: 13,
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.85)", outline: "none", cursor: "pointer",
                }}
              >
                <option value="api_starter">API Starter ($29/mo)</option>
                <option value="api_pro">API Pro ($99/mo)</option>
                <option value="api_enterprise">API Enterprise ($399/mo)</option>
              </select>
              <button type="submit" disabled={creating} style={{
                padding: "8px 18px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.6 : 1,
                background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
                color: "rgba(201,168,76,0.9)",
              }}>
                {creating ? "Creating…" : "Create"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} style={{
                padding: "8px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer",
                background: "none", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.35)",
              }}>Cancel</button>
            </div>
          </form>
        )}

        {/* Keys list */}
        {loading ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
            Loading keys…
          </div>
        ) : keys.length === 0 ? (
          <div style={{
            padding: "32px 24px", textAlign: "center",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10, color: "rgba(255,255,255,0.35)", fontSize: 13,
          }}>
            No API keys yet. Create one to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {keys.map((key) => (
              <div key={key.id} style={{
                padding: "16px 18px",
                background: key.status === "revoked" ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                opacity: key.status === "revoked" ? 0.45 : 1,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                        {key.name}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                        letterSpacing: "0.05em",
                        background: TIER_BG[key.tier] ?? "rgba(255,255,255,0.05)",
                        color: TIER_COLORS[key.tier] ?? "rgba(255,255,255,0.5)",
                        border: `1px solid ${(TIER_COLORS[key.tier] ?? "rgba(255,255,255,0.2)").replace("0.9", "0.2").replace("0.8", "0.2")}`,
                      }}>
                        {key.planName}
                      </span>
                      {key.status === "revoked" && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(239,68,68,0.7)", padding: "2px 7px", borderRadius: 4, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                          REVOKED
                        </span>
                      )}
                    </div>
                    <code style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                      {key.keyPreview}
                    </code>
                    <UsageBar used={key.requestsUsed} limit={key.requestsLimit} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                      Created {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsedAt ? ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}` : " · Never used"}
                      {" · "}{key.rateLimitRpm} req/min rate limit
                    </div>
                  </div>
                  {key.status === "active" && (
                    <button
                      onClick={() => void handleRevoke(key.id, key.name)}
                      disabled={revoking === key.id}
                      style={{
                        flexShrink: 0, padding: "6px 12px", borderRadius: 6, fontSize: 11,
                        fontWeight: 600, cursor: revoking === key.id ? "not-allowed" : "pointer",
                        opacity: revoking === key.id ? 0.5 : 1,
                        background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                        color: "rgba(239,68,68,0.7)",
                      }}
                    >
                      {revoking === key.id ? "Revoking…" : "Revoke"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
          Quick Start
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              label: "Non-streaming (JSON response)",
              code: `curl -X POST ${API_BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer sk-chairman-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "chairman-strategic",
    "messages": [{"role": "user", "content": "Analyse market entry risks for fintech in MENA"}],
    "stream": false
  }'`,
            },
            {
              label: "Streaming response",
              code: `curl -X POST ${API_BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer sk-chairman-..." \\
  -H "Content-Type: application/json" \\
  -d '{"model": "chairman-strategic", "messages": [{"role": "user", "content": "Your question here"}], "stream": true}'`,
            },
            {
              label: "Python (OpenAI SDK — just change base_url)",
              code: `from openai import OpenAI

client = OpenAI(
    api_key="sk-chairman-...",
    base_url="${API_BASE_URL}/v1",
)

response = client.chat.completions.create(
    model="chairman-strategic",
    messages=[{"role": "user", "content": "Analyse this market opportunity..."}],
)
print(response.choices[0].message.content)`,
            },
          ].map(({ label, code }) => (
            <div key={label} style={{
              background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, overflow: "hidden",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 14px", background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{label}</span>
                <CopyButton text={code} />
              </div>
              <pre style={{
                margin: 0, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace",
                color: "rgba(255,255,255,0.65)", lineHeight: 1.7, overflowX: "auto",
                whiteSpace: "pre",
              }}>
                {code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Available Models */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
          Available Models
        </h2>
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, overflow: "hidden",
        }}>
          {[
            { model: "chairman-standard",   mode: "Business",   desc: "Practical, direct answers for everyday business questions",     tier: "All plans" },
            { model: "chairman-extended",   mode: "Extended",   desc: "Thorough analysis for complex briefs and long documents",        tier: "All plans" },
            { model: "chairman-strategic",  mode: "Strategic",  desc: "Strategic planning, competitive analysis, risk review",          tier: "All plans" },
            { model: "chairman-executive",  mode: "Executive",  desc: "High-stakes decisions and board-ready executive summaries",       tier: "Pro + Enterprise" },
            { model: "chairman-board",      mode: "Board",      desc: "Governance-grade analysis and investor-level reporting",          tier: "Enterprise only" },
          ].map((row, i, arr) => (
            <div key={row.model} style={{
              display: "grid", gridTemplateColumns: "200px 1fr auto",
              padding: "12px 16px", gap: 12, alignItems: "center",
              borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <code style={{ fontSize: 12, fontFamily: "monospace", color: "rgba(201,168,76,0.75)" }}>
                {row.model}
              </code>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginRight: 8 }}>{row.mode}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{row.desc}</span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{row.tier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
          API Plans
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {plans.map((plan) => (
            <div key={plan.key} style={{
              padding: "20px", background: "rgba(255,255,255,0.02)",
              border: plan.key === "api_pro"
                ? "1px solid rgba(201,168,76,0.25)"
                : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>
                    {plan.publicName}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{plan.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                    ${plan.priceMonthlyUsd}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>/mo</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: "rgba(201,168,76,0.7)", flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
