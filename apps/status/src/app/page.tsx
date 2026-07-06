import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chairman AI — Status",
};

export const revalidate = 60;

type CheckResult = { operational: boolean; latencyMs: number | null; error?: string };

async function checkEndpoint(url: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    return { operational: res.ok, latencyMs: Date.now() - start };
  } catch (e: unknown) {
    return { operational: false, latencyMs: null, error: e instanceof Error ? e.message : "Connection failed" };
  }
}

export default async function StatusPage() {
  const API_URL = process.env.INTERNAL_API_URL ?? "https://api.ai.chairmans.uk";
  const MARKETING_URL = process.env.INTERNAL_MARKETING_URL ?? "https://ai.chairmans.uk";
  const APP_URL = process.env.INTERNAL_APP_URL ?? "https://app.ai.chairmans.uk";

  const [apiCheck, marketingCheck, appCheck] = await Promise.all([
    checkEndpoint(`${API_URL}/health`),
    checkEndpoint(MARKETING_URL),
    checkEndpoint(APP_URL),
  ]);

  const checkedAt = new Date().toUTCString();
  const allOperational = apiCheck.operational && marketingCheck.operational && appCheck.operational;

  const services = [
    { label: "Marketing Website", sublabel: "ai.chairmans.uk", check: marketingCheck },
    { label: "Customer Application", sublabel: "app.ai.chairmans.uk", check: appCheck },
    { label: "Chairman API", sublabel: "api.ai.chairmans.uk", check: apiCheck },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080806; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif; }

        .status-header {
          position: fixed; top: 24px; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: center; padding: 0 24px; pointer-events: none;
        }
        .status-header-inner {
          width: 100%; max-width: 820px; pointer-events: auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; border-radius: 9999px;
          background: rgba(12,11,8,0.82); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .status-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .status-logo img { width: 28px; height: 28px; object-fit: contain; filter: drop-shadow(0 0 6px rgba(201,168,76,0.4)); }
        .status-logo-name { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.88); letter-spacing: -0.025em; }
        .status-badge {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500;
          padding: 4px 12px; border-radius: 9999px;
          background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.18);
          color: rgba(201,168,76,0.7);
        }

        .status-main { padding: 120px 24px 80px; max-width: 680px; margin: 0 auto; }

        .status-hero { margin-bottom: 48px; }
        .status-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          margin-bottom: 20px;
        }
        .status-dot-sm {
          width: 5px; height: 5px; border-radius: 50%; background: #c9a84c; flex-shrink: 0;
        }
        .status-hero-label {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(201,168,76,0.65); font-weight: 500;
        }
        .status-headline {
          font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.04em;
          color: rgba(255,255,255,0.92); line-height: 1.05;
        }
        .status-headline span { color: #c9a84c; }

        .status-overall {
          border-radius: 16px; padding: 20px 24px; margin-bottom: 32px;
          display: flex; align-items: center; gap: 14;
        }
        .status-overall.ok {
          background: rgba(74,222,128,0.04); border: 1px solid rgba(74,222,128,0.12);
        }
        .status-overall.degraded {
          background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.12);
        }
        .status-overall-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }
        .status-overall-dot.ok { background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,0.5); }
        .status-overall-dot.degraded { background: #ef4444; box-shadow: 0 0 10px rgba(239,68,68,0.5); }
        .status-overall-text { font-size: 14px; font-weight: 600; letter-spacing: -0.02em; }
        .status-overall-text.ok { color: rgba(74,222,128,0.85); }
        .status-overall-text.degraded { color: rgba(239,68,68,0.85); }
        .status-overall-sub { font-size: 11px; color: rgba(255,255,255,0.18); margin-top: 2px; font-family: monospace; letter-spacing: 0.02em; }

        .status-card {
          background: rgba(255,255,255,0.018); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; overflow: hidden; margin-bottom: 24px;
        }
        .status-card-header {
          padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .status-card-heading {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); font-weight: 500;
        }
        .status-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .status-row:last-child { border-bottom: none; }
        .status-row-left { display: flex; align-items: center; gap: 12px; }
        .status-row-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }
        .status-row-dot.ok { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.45); }
        .status-row-dot.degraded { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.45); }
        .status-row-dot.unknown { background: rgba(255,255,255,0.12); }
        .status-row-label { font-size: 13px; color: rgba(255,255,255,0.65); font-weight: 500; }
        .status-row-sub { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 2px; font-family: monospace; letter-spacing: 0.02em; }
        .status-row-note { font-size: 11px; color: rgba(255,255,255,0.15); margin-top: 2px; font-style: italic; line-height: 1.5; }
        .status-row-right { text-align: right; flex-shrink: 0; }
        .status-row-status { font-size: 12px; font-weight: 500; }
        .status-row-status.ok { color: rgba(74,222,128,0.75); }
        .status-row-status.degraded { color: rgba(239,68,68,0.75); }
        .status-row-status.unknown { color: rgba(255,255,255,0.18); }
        .status-row-latency { font-size: 10px; color: rgba(255,255,255,0.18); margin-top: 2px; font-family: monospace; }

        .status-notes { display: flex; flex-direction: column; gap: 8px; }
        .status-note { font-size: 12px; color: rgba(255,255,255,0.18); line-height: 1.65; }

        .status-footer {
          margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; justify-content: center; gap: 20px;
        }
        .status-footer-link {
          font-size: 12px; color: rgba(255,255,255,0.2); text-decoration: none;
          transition: color 0.2s;
        }
        .status-footer-link:hover { color: rgba(201,168,76,0.6); }
      `}</style>

      {/* Nav */}
      <header className="status-header">
        <div className="status-header-inner">
          <a href="https://ai.chairmans.uk" className="status-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="Chairman AI" />
            <span className="status-logo-name">Chairman AI</span>
          </a>
          <span className="status-badge">Status</span>
        </div>
      </header>

      <main className="status-main">
        {/* Hero */}
        <div className="status-hero">
          <div className="status-hero-eyebrow">
            <span className="status-dot-sm" />
            <span className="status-hero-label">System Status</span>
          </div>
          <h1 className="status-headline">
            {allOperational ? "All systems operational" : "Service disruption detected"}
            <span>.</span>
          </h1>
        </div>

        {/* Overall indicator */}
        <div className={`status-overall ${allOperational ? "ok" : "degraded"}`} style={{ display: "flex", gap: 14 }}>
          <div className={`status-overall-dot ${allOperational ? "ok" : "degraded"}`} />
          <div>
            <p className={`status-overall-text ${allOperational ? "ok" : "degraded"}`}>
              {allOperational ? "All services are running normally" : "One or more services are degraded"}
            </p>
            <p className="status-overall-sub">Checked at {checkedAt}</p>
          </div>
        </div>

        {/* Services card */}
        <div className="status-card">
          <div className="status-card-header">
            <span className="status-card-heading">Services</span>
          </div>

          {services.map(({ label, sublabel, check }) => (
            <div key={label} className="status-row">
              <div className="status-row-left">
                <div className={`status-row-dot ${check.operational ? "ok" : "degraded"}`} />
                <div>
                  <p className="status-row-label">{label}</p>
                  <p className="status-row-sub">{sublabel}</p>
                </div>
              </div>
              <div className="status-row-right">
                <p className={`status-row-status ${check.operational ? "ok" : "degraded"}`}>
                  {check.operational ? "Operational" : "Unavailable"}
                </p>
                {check.latencyMs !== null && (
                  <p className="status-row-latency">{check.latencyMs}ms</p>
                )}
              </div>
            </div>
          ))}

          <div className="status-row">
            <div className="status-row-left">
              <div className="status-row-dot unknown" />
              <div>
                <p className="status-row-label">Cloud Intelligence</p>
                <p className="status-row-sub">Business · Extended · Strategic · Executive · Board</p>
                <p className="status-row-note">Requires an active subscription. Not independently monitored from this page.</p>
              </div>
            </div>
            <div className="status-row-right">
              <p className="status-row-status unknown">—</p>
            </div>
          </div>

          <div className="status-row">
            <div className="status-row-left">
              <div className="status-row-dot unknown" />
              <div>
                <p className="status-row-label">Private Intelligence</p>
                <p className="status-row-note">Runs locally on your device — no server check applicable.</p>
              </div>
            </div>
            <div className="status-row-right">
              <p className="status-row-status unknown">—</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="status-notes">
          <p className="status-note">Status checks run every 60 seconds using server-side health endpoint calls.</p>
          <p className="status-note">No uptime percentage is shown. Historical data is not displayed without accurate measurement. What you see is a real check made at the time this page loaded.</p>
          <p className="status-note">Private Intelligence runs locally on your device and has no cloud dependency. Its status cannot be monitored from this page.</p>
        </div>

        {/* Footer */}
        <div className="status-footer">
          <a href="https://ai.chairmans.uk" className="status-footer-link">Chairman AI</a>
          <a href="https://ai.chairmans.uk/legal/privacy" className="status-footer-link">Privacy</a>
          <a href="https://ai.chairmans.uk/legal/terms" className="status-footer-link">Terms</a>
        </div>
      </main>
    </>
  );
}
