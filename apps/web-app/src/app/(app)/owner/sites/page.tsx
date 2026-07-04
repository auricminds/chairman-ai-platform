"use client";

import { useEffect, useState } from "react";

interface SiteClient {
  id: string;
  site_key: string;
  display_name: string;
  status: "active" | "inactive" | "suspended";
  allowed_scopes: string[];
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
  inactive: "bg-zinc-800 text-zinc-500 border-zinc-700",
  suspended: "bg-red-900/30 text-red-400 border-red-800",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export default function OwnerSitesPage() {
  const [sites, setSites] = useState<SiteClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSites = async () => {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setError("Not authenticated."); setLoading(false); return; }

    const res = await fetch(`${API_BASE}/v1/owner/sites`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!res.ok) {
      setError("Failed to load sites. Check your role.");
    } else {
      const data = await res.json() as SiteClient[];
      setSites(data);
    }
    setLoading(false);
  };

  useEffect(() => { void fetchSites(); }, []);

  const updateSiteStatus = async (siteId: string, newStatus: string) => {
    setSaving(siteId);
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setSaving(null); return; }

    const res = await fetch(`${API_BASE}/v1/owner/sites`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: siteId, status: newStatus }),
    });

    if (!res.ok) {
      setError("Failed to update site.");
    } else {
      setSites((prev) =>
        prev.map((s) => s.id === siteId ? { ...s, status: newStatus as SiteClient["status"] } : s)
      );
    }
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Site Connections</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage connected sites (Quicky CV, El Arab Club). Activate or suspend site API access.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {sites.map((site) => (
          <div key={site.id} className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-zinc-100">{site.display_name}</span>
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {site.site_key}
                  </span>
                  <span className={[
                    "text-[10px] px-1.5 py-0.5 rounded border",
                    STATUS_COLORS[site.status] ?? STATUS_COLORS.inactive,
                  ].join(" ")}>
                    {site.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-zinc-600">
                  Scopes: {site.allowed_scopes.length > 0 ? site.allowed_scopes.join(", ") : "none"}
                </div>
                <div className="mt-1 text-xs text-zinc-700">
                  Since {new Date(site.created_at).toLocaleDateString("en-GB")}
                </div>
              </div>

              <div className="flex-shrink-0 flex gap-2">
                {site.status !== "active" && (
                  <button
                    onClick={() => void updateSiteStatus(site.id, "active")}
                    disabled={saving === site.id}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-900 hover:bg-emerald-950/70 transition-colors disabled:opacity-50"
                  >
                    Activate
                  </button>
                )}
                {site.status === "active" && (
                  <button
                    onClick={() => void updateSiteStatus(site.id, "suspended")}
                    disabled={saving === site.id}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-red-950/40 text-red-400 border border-red-900 hover:bg-red-950/70 transition-colors disabled:opacity-50"
                  >
                    Suspend
                  </button>
                )}
                {site.status === "suspended" && (
                  <button
                    onClick={() => void updateSiteStatus(site.id, "inactive")}
                    disabled={saving === site.id}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-5 py-4 text-xs text-zinc-600 space-y-1">
        <p>API keys must be provisioned via the Supabase dashboard or a provisioning script.</p>
        <p>Site events can be reviewed in the Supabase site_events table.</p>
      </div>
    </div>
  );
}
