import type { Metadata } from "next";
import { SiteNav } from "../_components/SiteNav";
import { SiteFooter } from "../_components/SiteFooter";

export const metadata: Metadata = {
  title: "ChameleonEye AI Desktop — Private Intelligence on your device",
  description:
    "ChameleonEye AI Desktop runs Private Intelligence entirely on your device. No cloud, no server, no data transmitted.",
};

const APP_URL = "https://app.chameleoneye.ai";

export default function DesktopPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: 120 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 120px" }}>

          {/* Hero */}
          <div style={{ marginBottom: 80 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 36,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#c9a84c",
                  boxShadow: "0 0 8px rgba(201,168,76,0.55)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 500,
                }}
              >
                macOS Desktop Application
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "rgba(255,255,255,0.94)",
                marginBottom: 12,
              }}
            >
              Private Intelligence
              <span style={{ color: "#c9a84c" }}>.</span>
            </h1>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 28,
              }}
            >
              Your device. No exceptions.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              ChameleonEye AI Desktop runs Private Intelligence entirely on your machine.
              No network call is made. No API is hit. No data leaves your device.
              This is the architecture, not a setting.
            </p>
          </div>

          {/* What it includes */}
          <div style={{ marginBottom: 64 }}>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.82)",
                marginBottom: 24,
              }}
            >
              What ChameleonEye AI Desktop includes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Private Intelligence — runs locally on device, zero network calls",
                "Cloud Intelligence — connect to all cloud modes with your subscription",
                "Voice input — dictate your questions natively",
                "Fully private conversation history — stored only on your device",
                "macOS native — no Electron shell pretending to be native",
              ].map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.55)",
                      flexShrink: 0,
                      marginTop: 7,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.35)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status card */}
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "36px 32px",
              marginBottom: 64,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#c9a84c",
                  boxShadow: "0 0 10px rgba(201,168,76,0.5)",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.7)",
                  fontWeight: 600,
                }}
              >
                In preparation
              </span>
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.88)",
                marginBottom: 14,
              }}
            >
              ChameleonEye AI Desktop is being prepared
              <span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.28)",
                lineHeight: 1.7,
                marginBottom: 12,
              }}
            >
              We are not publishing a download until the application meets our standards for
              private intelligence quality, stability, and security. We will not release a
              beta that compromises the private-by-design guarantee.
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.18)",
                lineHeight: 1.65,
                marginBottom: 24,
              }}
            >
              If you are interested in early access or have specific requirements,
              contact us directly. No waitlist form — just a real conversation.
            </p>
            <a
              href="mailto:desk@chameleoneye.ai"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.09)",
                fontFamily: "monospace",
                letterSpacing: "0.02em",
              }}
            >
              desk@chameleoneye.ai
            </a>
          </div>

          {/* Cloud alternative */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              paddingTop: 48,
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.88)",
                marginBottom: 14,
              }}
            >
              Cloud Intelligence is available now
              <span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.7,
                marginBottom: 28,
                maxWidth: 520,
              }}
            >
              While Desktop is in preparation, ChameleonEye AI&apos;s full Cloud Intelligence suite is
              available through the web application. Business Intelligence, Extended Review,
              Strategic Review, Executive Analysis, and Board Review — all accessible today.
            </p>
            <a
              href={`${APP_URL}/signup`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                borderRadius: 9999,
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.96) 0%, rgba(172,135,40,0.92) 100%)",
                color: "#080806",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.02em",
                boxShadow: "0 4px 24px rgba(201,168,76,0.2)",
              }}
            >
              Access Cloud Intelligence
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.12)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                }}
              >
                ↗
              </span>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
