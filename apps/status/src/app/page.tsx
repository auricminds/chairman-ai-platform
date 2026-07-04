import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chairman AI — Status",
};

// Revalidate every 60 seconds
export const revalidate = 60;

type CheckResult = { operational: boolean; latencyMs: number | null; error?: string };

async function checkEndpoint(url: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const latencyMs = Date.now() - start;
    return { operational: res.ok, latencyMs };
  } catch (e: unknown) {
    return {
      operational: false,
      latencyMs: null,
      error: e instanceof Error ? e.message : "Connection failed",
    };
  }
}

function StatusDot({ operational }: { operational: boolean }) {
  return (
    <span
      className={[
        "inline-block h-2.5 w-2.5 rounded-full flex-shrink-0",
        operational ? "bg-emerald-500" : "bg-red-500",
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

function StatusRow({
  label,
  sublabel,
  operational,
  latencyMs,
  note,
}: {
  label: string;
  sublabel?: string;
  operational: boolean | null;
  latencyMs?: number | null;
  note?: string;
}) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-zinc-900 last:border-0">
      <div className="flex items-start gap-3">
        {operational !== null ? (
          <StatusDot operational={operational} />
        ) : (
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="text-sm text-zinc-200">{label}</p>
          {sublabel && <p className="text-xs text-zinc-600 mt-0.5">{sublabel}</p>}
          {note && <p className="text-xs text-zinc-600 mt-0.5 italic">{note}</p>}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-6">
        {operational === null ? (
          <span className="text-xs text-zinc-600">—</span>
        ) : operational ? (
          <div className="space-y-0.5">
            <span className="text-xs text-emerald-400">Operational</span>
            {latencyMs !== null && latencyMs !== undefined && (
              <p className="text-[10px] text-zinc-600">{latencyMs}ms</p>
            )}
          </div>
        ) : (
          <span className="text-xs text-red-400">Unavailable</span>
        )}
      </div>
    </div>
  );
}

export default async function StatusPage() {
  const API_URL = process.env.INTERNAL_API_URL ?? "https://api.ai.chairmans.uk";
  const MARKETING_URL = process.env.INTERNAL_MARKETING_URL ?? "https://ai.chairmans.uk";
  const APP_URL = process.env.INTERNAL_APP_URL ?? "https://app.ai.chairmans.uk";

  // Run checks in parallel
  const [apiCheck, marketingCheck, appCheck] = await Promise.all([
    checkEndpoint(`${API_URL}/health`),
    checkEndpoint(`${MARKETING_URL}`),
    checkEndpoint(`${APP_URL}`),
  ]);

  const checkedAt = new Date().toUTCString();
  const allOperational = apiCheck.operational && marketingCheck.operational && appCheck.operational;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <header className="border-b border-zinc-900 px-6 h-16 flex items-center">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-sm bg-amber-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-wider">C</span>
          </div>
          <span className="text-sm font-semibold text-[#f5f0e8]">Chairman AI</span>
          <span className="text-zinc-600 text-sm mx-1">/</span>
          <span className="text-sm text-zinc-500">Status</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Overall status */}
        <div className={[
          "border rounded-lg px-6 py-5 flex items-center gap-4",
          allOperational
            ? "border-emerald-800/50 bg-emerald-950/20"
            : "border-red-800/50 bg-red-950/20",
        ].join(" ")}>
          <div className={[
            "h-3 w-3 rounded-full flex-shrink-0",
            allOperational ? "bg-emerald-500" : "bg-red-500",
          ].join(" ")} />
          <div>
            <p className={[
              "text-sm font-semibold",
              allOperational ? "text-emerald-300" : "text-red-300",
            ].join(" ")}>
              {allOperational ? "All systems operational" : "Service disruption detected"}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">
              Checked at {checkedAt}
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg px-6">
          <h2 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold py-4 border-b border-zinc-800">
            Services
          </h2>

          <StatusRow
            label="Marketing Website"
            sublabel="ai.chairmans.uk"
            operational={marketingCheck.operational}
            latencyMs={marketingCheck.latencyMs}
          />

          <StatusRow
            label="Customer Application"
            sublabel="app.ai.chairmans.uk"
            operational={appCheck.operational}
            latencyMs={appCheck.latencyMs}
          />

          <StatusRow
            label="Chairman API"
            sublabel="api.ai.chairmans.uk"
            operational={apiCheck.operational}
            latencyMs={apiCheck.latencyMs}
          />

          <StatusRow
            label="Cloud Intelligence"
            sublabel="Business, Extended, Strategic, Executive, Board"
            operational={null}
            note="Requires an active subscription. Not independently monitored from this page."
          />

          <StatusRow
            label="Private Intelligence"
            operational={null}
            note="Available through Chairman AI Desktop — not cloud-dependent. No server check applicable."
          />
        </div>

        {/* Explanation */}
        <div className="text-xs text-zinc-700 space-y-1.5">
          <p>
            Status checks run every 60 seconds using server-side health endpoint calls.
          </p>
          <p>
            No uptime percentage is shown. Historical data is not displayed without accurate
            measurement. What you see is a real check made at the time this page loaded.
          </p>
          <p>
            Private Intelligence runs locally on your device and has no cloud dependency.
            Its status cannot be monitored from this page.
          </p>
        </div>
      </main>
    </div>
  );
}
