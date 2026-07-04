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

function UsageBar({ allowance }: { allowance: ModeAllowance }) {
  if (allowance.mode === "private") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">{MODE_LABELS[allowance.mode] ?? allowance.mode}</span>
          <span className="text-xs text-zinc-500">Available on your device</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full">
          <div className="h-full w-full rounded-full bg-zinc-700" />
        </div>
      </div>
    );
  }

  if (allowance.lockedReason) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">{MODE_LABELS[allowance.mode] ?? allowance.mode}</span>
          <span className="text-xs text-zinc-700">Not on your plan</span>
        </div>
        <div className="h-1.5 bg-zinc-900 rounded-full" />
      </div>
    );
  }

  const limit = allowance.monthlyLimit;
  const used = allowance.used;
  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
  const variant = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-amber-600";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-300">{MODE_LABELS[allowance.mode] ?? allowance.mode}</span>
        <span className="text-xs text-zinc-500">
          {limit === null
            ? "Unlimited"
            : `${used} of ${limit} used this period`}
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={["h-full rounded-full transition-all", variant].join(" ")}
          style={{ width: limit === null ? "0%" : `${pct}%` }}
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
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  const hasSubscription = entitlement?.status !== "none" && entitlement?.planKey;
  const periodEnd = entitlement?.currentPeriodEnd
    ? new Date(entitlement.currentPeriodEnd).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Billing &amp; Usage</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your subscription and track usage for the current period.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Current plan</p>
            <p className="text-base font-semibold text-zinc-100">
              {hasSubscription ? entitlement?.planPublicName : "No active plan"}
            </p>
            {entitlement?.status === "cancelled" && periodEnd && (
              <p className="text-xs text-amber-500 mt-0.5">Access until {periodEnd}</p>
            )}
            {entitlement?.status === "past_due" && (
              <p className="text-xs text-red-400 mt-0.5">Payment past due — update billing to continue access.</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={[
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border",
              entitlement?.status === "active"
                ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                : entitlement?.status === "none"
                  ? "bg-zinc-800 text-zinc-500 border-zinc-700"
                  : "bg-amber-900/30 text-amber-400 border-amber-800",
            ].join(" ")}>
              {entitlement?.status === "none" ? "No plan" : entitlement?.status ?? "—"}
            </span>
          </div>
        </div>

        {/* Usage bars */}
        {hasSubscription && (entitlement?.modes?.length ?? 0) > 0 && (
          <div className="px-6 py-5 space-y-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Monthly usage</p>
            {entitlement!.modes.map((mode) => (
              <UsageBar key={mode.mode} allowance={mode} />
            ))}
            {periodEnd && (
              <p className="text-xs text-zinc-600 pt-1">
                Usage resets on {periodEnd}.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          {!hasSubscription ? (
            <>
              <button
                onClick={() => void handleCheckout("chairman_private")}
                disabled={actionLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                Chairman Private — $10/month
              </button>
              <button
                onClick={() => void handleCheckout("chairman_executive")}
                disabled={actionLoading}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                Chairman Executive — $50/month
              </button>
            </>
          ) : (
            <button
              onClick={() => void handlePortal()}
              disabled={actionLoading}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Loading..." : "Manage subscription"}
            </button>
          )}
        </div>
      </div>

      {/* Upgrade prompt */}
      {entitlement?.planKey === "chairman_private" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-1">Chairman Executive</h2>
          <p className="text-sm text-zinc-500 mb-4">
            4x more Business Intelligence, Board Review access, and higher limits across every mode.
          </p>
          <button
            onClick={() => void handleCheckout("chairman_executive")}
            disabled={actionLoading}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            Upgrade to Executive
          </button>
        </div>
      )}
    </div>
  );
}
