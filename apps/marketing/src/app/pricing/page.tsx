import type { Metadata } from "next";
import { SiteNav } from "../_components/SiteNav";
import { SiteFooter } from "../_components/SiteFooter";

export const metadata: Metadata = {
  title: "Pricing — ChameleonEye AI",
  description: "ChameleonEye Private at $10/month and ChameleonEye Executive at $50/month. No hidden tiers.",
};

const APP_URL = "https://app.chameleoneye.ai";

const FEATURES = [
  {
    category: "Private Intelligence",
    rows: [
      {
        label: "On-device processing (Desktop)",
        note: "Runs locally. No cloud calls.",
        private: "Unlimited",
        executive: "Unlimited",
      },
    ],
  },
  {
    category: "Cloud Intelligence",
    rows: [
      { label: "Business Intelligence / month", note: null, private: "300", executive: "1,200" },
      { label: "Extended Review / month", note: null, private: "10", executive: "75" },
      { label: "Strategic Review / month", note: null, private: "3", executive: "40" },
      {
        label: "Executive Analysis / month",
        note: "Confirmation required per use",
        private: "2",
        executive: "20",
      },
      {
        label: "Board Review / month",
        note: "Confirmation required per use",
        private: "Not included",
        executive: "4",
      },
    ],
  },
  {
    category: "Platform",
    rows: [
      { label: "Streaming responses", note: null, private: "Yes", executive: "Yes" },
      { label: "Provider visibility", note: "Model names never shown", private: "None", executive: "None" },
      { label: "Usage tracking", note: "No cost figures shown", private: "Yes", executive: "Yes" },
      { label: "Billing portal", note: "Via Stripe", private: "Yes", executive: "Yes" },
    ],
  },
  {
    category: "Site Intelligence (API)",
    rows: [
      { label: "Quicky CV guidance", note: null, private: "Via site key", executive: "Via site key" },
      { label: "El Arab Club guidance", note: null, private: "Via site key", executive: "Via site key" },
      { label: "Site event ingestion", note: null, private: "Yes", executive: "Yes" },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: 120 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 120px" }}>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.94)",
                lineHeight: 1.02,
                marginBottom: 16,
              }}
            >
              Two plans. No surprises
              <span style={{ color: "#c9a84c" }}>.</span>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.28)",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              Every plan includes Private Intelligence on Desktop — unlimited and fully local.
              Cloud Intelligence usage is counted, not throttled.
            </p>
          </div>

          {/* Plan cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
              marginBottom: 72,
            }}
          >
            {/* Private */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "36px 32px",
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.82)",
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                }}
              >
                ChameleonEye Private
              </h2>
              <div style={{ marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  $10
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.22)",
                    marginLeft: 6,
                  }}
                >
                  / month
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.28)",
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}
              >
                Individual use. Covers everyday cloud intelligence needs with Desktop included.
              </p>
              <a
                href={`${APP_URL}/signup`}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "13px 20px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Start with Private
              </a>
            </div>

            {/* Executive */}
            <div
              style={{
                background: "rgba(201,168,76,0.035)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 20,
                padding: "36px 32px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.65)",
                  background: "rgba(201,168,76,0.07)",
                  border: "1px solid rgba(201,168,76,0.16)",
                  padding: "4px 10px",
                  borderRadius: 9999,
                  fontWeight: 500,
                }}
              >
                Full access
              </div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.82)",
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                }}
              >
                ChameleonEye Executive
              </h2>
              <div style={{ marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  $50
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.22)",
                    marginLeft: 6,
                  }}
                >
                  / month
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.28)",
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}
              >
                Executives and leadership teams. Board Review access, 4x business capacity.
              </p>
              <a
                href={`${APP_URL}/signup`}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "13px 20px",
                  borderRadius: 9999,
                  background:
                    "linear-gradient(135deg, rgba(201,168,76,0.92) 0%, rgba(172,135,40,0.88) 100%)",
                  color: "#080806",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 4px 24px rgba(201,168,76,0.18)",
                }}
              >
                Start with Executive
              </a>
            </div>
          </div>

          {/* Comparison table */}
          <div
            style={{
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 32,
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 140px",
                padding: "16px 28px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Feature</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
                Private
              </span>
              <span style={{ fontSize: 12, color: "rgba(201,168,76,0.65)", textAlign: "center" }}>
                Executive
              </span>
            </div>

            {/* Table body */}
            {FEATURES.map((section, si) => (
              <div key={section.category}>
                {/* Category header */}
                <div
                  style={{
                    padding: "18px 28px 10px",
                    borderTop: si > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.55)",
                      fontWeight: 600,
                    }}
                  >
                    {section.category}
                  </span>
                </div>

                {/* Rows */}
                {section.rows.map((row, ri) => (
                  <div
                    key={row.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 140px 140px",
                      padding: "12px 28px",
                      borderTop:
                        ri === 0
                          ? "none"
                          : "1px solid rgba(255,255,255,0.03)",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
                        {row.label}
                      </span>
                      {row.note && (
                        <span
                          style={{
                            display: "block",
                            fontSize: 11,
                            color: "rgba(255,255,255,0.15)",
                            marginTop: 2,
                          }}
                        >
                          {row.note}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.35)",
                        textAlign: "center",
                      }}
                    >
                      {row.private}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                      }}
                    >
                      {row.executive}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Notes */}
          <div
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              "All prices are in USD. Subscriptions renew monthly via Stripe.",
              "Private Intelligence is available exclusively through ChameleonEye AI Desktop (macOS). Cloud Intelligence requires an active subscription.",
              "Usage counts are per calendar billing period. There are no rollover allowances. Unused allowances do not carry forward.",
              "Executive Analysis and Board Review require in-app confirmation before each use.",
            ].map((note) => (
              <p key={note} style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", lineHeight: 1.6 }}>
                {note}
              </p>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
