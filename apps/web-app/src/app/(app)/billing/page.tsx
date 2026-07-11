"use client";

import { useEffect, useState } from "react";
import { fetchEntitlements, startCheckout, openBillingPortal } from "@/lib/api/client";

interface ModeAllowance {
  mode: string;
  monthlyLimit: number | null;
  used: number;
  remaining: number | null;
  lockedReason: string | null;
}

interface Entitlement {
  planKey: string | null;
  planPublicName: string | null;
  status: "active" | "cancelled" | "past_due" | "none";
  currentPeriodEnd: string | null;
  modes: ModeAllowance[];
}

const MODE_LABELS: Record<string, string> = {
  private: "Private Intelligence",
  business: "Business Intelligence",
  extended: "Extended Review",
  strategic: "Strategic Review",
  executive: "Executive Analysis",
  board: "Board Review",
};

const PRIVATE_FEATURES = [
  "Private Intelligence (on-device, unlimited)",
  "Business Intelligence — 40 requests / month",
  "Extended Review — 20 requests / month",
  "Strategic Review — 10 requests / month",
  "File and document attachment",
  "Voice input",
];

const EXECUTIVE_FEATURES = [
  "Private Intelligence (on-device, unlimited)",
  "Business Intelligence — 160 requests / month",
  "Extended Review — 80 requests / month",
  "Strategic Review — 40 requests / month",
  "Executive Analysis — 20 requests / month",
  "Board Review — 10 requests / month",
  "File and document attachment",
  "Voice input",
  "Priority response speed",
];

function UsageBar({ allowance }: { allowance: ModeAllowance }) {
  if (allowance.mode === "private") {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
            {MODE_LABELS[allowance.mode] ?? allowance.mode}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>On-device · Unlimited</span>
        </div>
        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", width: "100%", borderRadius: 99, background: "rgba(201,168,76,0.2)" }} />
        </div>
      </div>
    );
  }

  if (allowance.lockedReason) {
    return (
      <div style={{ marginBottom: 16, opacity: 0.35 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            {MODE_LABELS[allowance.mode] ?? allowance.mode}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Not on your plan</span>
        </div>
        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.04)" }} />
      </div>
    );
  }

  const limit = allowance.monthlyLimit;
  const used = allowance.used;
  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
  const barColor = pct >= 90 ? "rgba(239,68,68,0.8)" : pct >= 70 ? "rgba(245,158,11,0.8)" : "rgba(201,168,76,0.75)";

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
          {MODE_LABELS[allowance.mode] ?? allowance.mode}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          {limit === null ? "Unlimited" : `${used} of ${limit} used`}
        </span>
      </div>
      <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: limit === null ? "0%" : `${pct}%`,
            borderRadius: 99,
            background: barColor,
            transition: "width 0.6s cubic-bezier(0.32,0.72,0,1)",
          }}
        />
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ff = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif' };

  useEffect(() => {
    fetchEntitlements()
      .then((data: Entitlement) => setEntitlement(data))
      .catch(() => setError("Failed to load billing information."))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (planKey: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const { url } = await startCheckout(planKey);
      if (url) window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const { url } = await openBillingPortal();
      window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Portal unavailable.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", ...ff }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "2px solid rgba(201,168,76,0.2)",
          borderTopColor: "rgba(201,168,76,0.8)",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const hasSubscription = entitlement?.status !== "none" && entitlement?.planKey;
  const periodEnd = entitlement?.currentPeriodEnd
    ? new Date(entitlement.currentPeriodEnd).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    overflow: "hidden",
  };

  const sectionStyle: React.CSSProperties = {
    maxWidth: 700,
    margin: "0 auto",
    padding: "40px 28px 60px",
    ...ff,
  };

  return (
    <div style={sectionStyle}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontWeight: 500, marginBottom: 10 }}>
          Billing & Usage
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em", color: "rgba(255,255,255,0.92)", lineHeight: 1.1 }}>
          Your plan<span style={{ color: "#c9a84c" }}>.</span>
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
          Manage your subscription and track usage for the current billing period.
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 24,
          fontSize: 13, color: "rgba(239,68,68,0.8)", lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* Current plan status */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>Current plan</p>
            <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.92)" }}>
              {hasSubscription ? entitlement?.planPublicName : "No active plan"}
            </p>
            {entitlement?.status === "cancelled" && periodEnd && (
              <p style={{ fontSize: 12, color: "rgba(245,158,11,0.75)", marginTop: 4 }}>Access continues until {periodEnd}</p>
            )}
            {entitlement?.status === "past_due" && (
              <p style={{ fontSize: 12, color: "rgba(239,68,68,0.75)", marginTop: 4 }}>Payment past due — update billing to continue access.</p>
            )}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 9999, fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
            ...(entitlement?.status === "active"
              ? { background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)", color: "rgba(74,222,128,0.85)" }
              : entitlement?.status === "none"
                ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }
                : { background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", color: "rgba(245,158,11,0.8)" }),
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block", flexShrink: 0 }} />
            {entitlement?.status === "none" ? "No plan" : entitlement?.status ?? "—"}
          </div>
        </div>

        {/* Usage bars if subscribed */}
        {hasSubscription && (entitlement?.modes?.length ?? 0) > 0 && (
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Monthly usage</p>
            {entitlement!.modes.map((mode) => (
              <UsageBar key={mode.mode} allowance={mode} />
            ))}
            {periodEnd && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 8, fontFamily: "monospace" }}>
                Resets on {periodEnd}
              </p>
            )}
          </div>
        )}

        {/* Action */}
        {hasSubscription && (
          <div style={{ padding: "16px 24px" }}>
            <button
              onClick={() => void handlePortal()}
              disabled={actionLoading}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)",
                fontSize: 13, fontWeight: 500, cursor: actionLoading ? "not-allowed" : "pointer",
                opacity: actionLoading ? 0.5 : 1, transition: "all 0.2s",
                ...ff,
              }}
            >
              {actionLoading ? "Loading…" : "Manage subscription →"}
            </button>
          </div>
        )}
      </div>

      {/* Plan cards — shown when no subscription or showing upgrade */}
      {(!hasSubscription || entitlement?.planKey === "chairman_private") && (
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>
            {hasSubscription ? "Upgrade available" : "Choose a plan"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* ChameleonEye Private */}
            {!hasSubscription && (
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 24,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>ChameleonEye</p>
                  <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.035em", color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>Private</p>
                  <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.95)" }}>
                    $10<span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>/mo</span>
                  </p>
                </div>
                <div style={{ flex: 1, marginBottom: 24 }}>
                  {PRIVATE_FEATURES.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                      <span style={{ color: "rgba(201,168,76,0.7)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => void handleCheckout("chairman_private")}
                  disabled={actionLoading}
                  style={{
                    width: "100%", padding: "11px 16px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)",
                    fontSize: 13, fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer",
                    opacity: actionLoading ? 0.5 : 1, transition: "all 0.2s", ...ff,
                  }}
                >
                  Get started →
                </button>
              </div>
            )}

            {/* ChameleonEye Executive */}
            <div style={{
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 16, padding: 24,
              display: "flex", flexDirection: "column",
              gridColumn: !hasSubscription ? undefined : "1 / -1",
              position: "relative", overflow: "hidden",
            }}>
              {/* Top gold line */}
              <div style={{
                position: "absolute", top: 0, left: "15%", right: "15%",
                height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
              }} />
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)" }}>ChameleonEye</p>
                  <span style={{
                    fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                    padding: "3px 8px", borderRadius: 9999,
                    background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                    color: "rgba(201,168,76,0.75)",
                  }}>Most capable</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.035em", color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>Executive</p>
                <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.95)" }}>
                  $50<span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>/mo</span>
                </p>
              </div>
              <div style={{ flex: 1, marginBottom: 24 }}>
                {EXECUTIVE_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <span style={{ color: "rgba(201,168,76,0.8)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => void handleCheckout("chairman_executive")}
                disabled={actionLoading}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 10,
                  border: "1px solid rgba(201,168,76,0.35)",
                  background: "linear-gradient(135deg, rgba(201,168,76,0.85) 0%, rgba(201,168,76,0.65) 100%)",
                  color: "#0a0a0a", fontSize: 13, fontWeight: 700,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.5 : 1, transition: "all 0.2s",
                  boxShadow: "0 4px 16px rgba(201,168,76,0.15)",
                  ...ff,
                }}
              >
                {hasSubscription ? "Upgrade to Executive →" : "Get started →"}
              </button>
            </div>
          </div>

          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 14, lineHeight: 1.6 }}>
            Billed monthly via Stripe. Cancel at any time — access continues until the end of the billing period. Prices in USD.
          </p>
        </div>
      )}
    </div>
  );
}
