import Link from "next/link";
import { SiteFooter } from "./_components/SiteFooter";

const APP_URL = "https://app.chameleoneye.ai";

function Nav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 24,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 24px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 820,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 10px 20px",
          borderRadius: 9999,
          background: "rgba(12,11,8,0.82)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Left: logo + name */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            opacity: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt="ChameleonEye AI"
            style={{
              width: 28,
              height: 28,
              objectFit: "contain",
              filter: "drop-shadow(0 0 5px rgba(201,168,76,0.38)) drop-shadow(0 0 14px rgba(22,163,74,0.22))",
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "-0.025em",
            }}
          >
            ChameleonEye AI
          </span>
        </a>

        {/* Right: links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <a
            href="#for-platforms"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.38)",
              textDecoration: "none",
              padding: "6px 14px",
            }}
          >
            API
          </a>
          <a
            href={`${APP_URL}/signin`}
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.38)",
              textDecoration: "none",
              padding: "6px 14px",
            }}
          >
            Sign in
          </a>
          <a
            href={`${APP_URL}/signup`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#0a0a08",
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.96) 0%, rgba(178,142,48,0.92) 100%)",
              padding: "8px 18px",
              borderRadius: 9999,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 2px 16px rgba(201,168,76,0.28)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Get started
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.14)",
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
    </header>
  );
}

function Hero() {
  return (
    <section
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Gold hero glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 680,
          height: 480,
          background:
            "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Emerald accent glow — chameleon identity */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "15%",
          left: "15%",
          width: 360,
          height: 360,
          background:
            "radial-gradient(ellipse at center, rgba(22,163,74,0.055) 0%, rgba(22,163,74,0.015) 45%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "15%",
          right: "15%",
          width: 280,
          height: 280,
          background:
            "radial-gradient(ellipse at center, rgba(22,163,74,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 740, margin: "0 auto" }}>
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 44,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(22,163,74,0.9)",
              boxShadow: "0 0 8px rgba(22,163,74,0.6)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
            }}
          >
            Private · Secure · Six intelligence modes
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="hero-headline"
          style={{
            fontSize: "clamp(64px, 11vw, 112px)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.94)",
            marginBottom: 32,
          }}
        >
          Your AI.
          <br />
          Your rules
          <span style={{ color: "#c9a84c" }}>.</span>
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.32)",
            lineHeight: 1.65,
            maxWidth: 500,
            margin: "0 auto 52px",
          }}
        >
          Intelligence that <span style={{ color: "rgba(22,163,74,0.85)", fontStyle: "italic" }}>adapts</span>. Board-level analysis, strategic reviews, and private intelligence.
          Affordable plans. Cancel anytime.
        </p>

        {/* CTA row — 2 buttons only */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <a
            href={`${APP_URL}/signup`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 9999,
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.96) 0%, rgba(172,135,40,0.92) 100%)",
              color: "#080806",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.02em",
              boxShadow:
                "0 4px 28px rgba(201,168,76,0.22), 0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            Start for free
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.12)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
              }}
            >
              ↗
            </span>
          </a>

          <Link
            href="/desktop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              backdropFilter: "blur(8px)",
            }}
          >
            Desktop app
          </Link>
        </div>
      </div>
    </section>
  );
}

function IntelligenceLayers() {
  const layers = [
    {
      mode: "Private Intelligence",
      label: "Stays on your device",
      description:
        "Runs entirely locally. No cloud, no server, no network call. Your most sensitive thinking never leaves your machine. Available through ChameleonEye AI Desktop.",
      badge: "Desktop only",
    },
    {
      mode: "Business Intelligence",
      label: "Everyday analysis",
      description:
        "Market analysis, operational decisions, business correspondence, and strategic context. Your most-used intelligence layer.",
      badge: null,
    },
    {
      mode: "Extended Review",
      label: "Deep document analysis",
      description:
        "Long briefs, contract reviews, research documents, and multi-source synthesis. Handles substantially more context than standard analysis.",
      badge: null,
    },
    {
      mode: "Strategic Review",
      label: "Strategic planning",
      description:
        "Competitive positioning, scenario planning, three-horizon thinking, and board-ready strategy synthesis.",
      badge: null,
    },
    {
      mode: "Executive Analysis",
      label: "High-stakes decisions",
      description:
        "Investor-grade analysis, acquisition targets, key executive decisions. Requires confirmation. Each analysis is counted.",
      badge: "Uses allowance",
    },
    {
      mode: "Board Review",
      label: "Governance-grade output",
      description:
        "Board-level reporting, governance briefings, shareholder materials. Executive plan only. Each review is counted.",
      badge: "Executive plan",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "rgba(22,163,74,0.85)",
                boxShadow: "0 0 6px rgba(22,163,74,0.5)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(22,163,74,0.7)",
                fontWeight: 500,
              }}
            >
              Intelligence layers
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            One platform.
            <br />
            Six levels of depth
            <span style={{ color: "#c9a84c" }}>.</span>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.28)",
              maxWidth: 420,
              lineHeight: 1.65,
            }}
          >
            From quick business answers to full board-level synthesis. Each mode is purpose-built,
            not a generic prompt adjustment.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {layers.map((layer, i) => {
            const isGreen = i % 2 === 0;
            const accent = isGreen ? "22,163,74" : "201,168,76";
            return (
            <div
              key={i}
              style={{
                background: `rgba(${accent},0.02)`,
                border: `1px solid rgba(${accent},0.08)`,
                borderRadius: 16,
                padding: "28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: "absolute",
                top: 0, left: "20%", right: "20%",
                height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${accent},0.25), transparent)`,
              }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.82)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {layer.mode}
                </span>
                {layer.badge && (
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: `rgba(${accent},0.6)`,
                      background: `rgba(${accent},0.06)`,
                      border: `1px solid rgba(${accent},0.15)`,
                      padding: "3px 8px",
                      borderRadius: 9999,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {layer.badge}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: `rgba(${accent},0.55)`,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                {layer.label}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.28)",
                  lineHeight: 1.65,
                }}
              >
                {layer.description}
              </p>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      style={{
        padding: "120px 24px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Feature 1: Privacy */}
        <div className="feat-grid" style={{ marginBottom: 120 }}>
          <div>
            <h3
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.08,
                marginBottom: 20,
              }}
            >
              Intelligence that never touches a server
              <span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.7,
              }}
            >
              When you use Private Intelligence on ChameleonEye AI Desktop, your message never leaves
              your device. There is no API call, no log, no cloud processing. The model runs
              entirely on your machine. This is not a privacy setting — it is the architecture.
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "28px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.18)",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
                marginBottom: 20,
                textTransform: "uppercase",
              }}
            >
              private_intelligence.log
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Network calls: 0",
                "Cloud requests: 0",
                "Data transmitted: 0 bytes",
                "Inference: local",
              ].map((line) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 8px rgba(74,222,128,0.45)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "monospace",
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2: Cost integrity */}
        <div className="feat-grid feat-grid-reverse" style={{ marginBottom: 120 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "28px",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.18)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 16,
              }}
            >
              Usage this period
            </p>
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.05)",
                marginBottom: 16,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Business Intelligence", pct: 45, color: "22,163,74" },
                { label: "Extended Review", pct: 30, color: "201,168,76" },
                { label: "Strategic Review", pct: 20, color: "22,163,74" },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 6,
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ color: `rgba(${color},0.6)` }}>{pct}%</span>
                  </div>
                  <div
                    style={{
                      height: 2,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background:
                          `linear-gradient(90deg, rgba(${color},0.7) 0%, rgba(${color},0.35) 100%)`,
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.08,
                marginBottom: 20,
              }}
            >
              Hard cost ceilings. No surprise bills
              <span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.7,
              }}
            >
              Every plan has an internal cost ceiling that cannot be overridden. We never show
              you token counts or AI costs. You see usage counters, not invoices. If capacity
              is reached, the response is clear and the billing is transparent.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section
      style={{
        padding: "120px 24px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.05,
            }}
          >
            Two plans. No hidden tiers
            <span style={{ color: "#c9a84c" }}>.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="price-grid">
          {/* Private plan */}
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "36px 32px",
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              ChameleonEye Private
            </h3>
            <div style={{ marginBottom: 32 }}>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.88)",
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 32,
              }}
            >
              {[
                "Private Intelligence on Desktop (unlimited)",
                "300 Business Intelligence per month",
                "10 Extended Reviews per month",
                "3 Strategic Reviews per month",
                "2 Executive Analyses per month",
                "Board Review: not included",
              ].map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.45)",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.28)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={`${APP_URL}/signup`}
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 20px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Get started
            </a>
          </div>

          {/* Executive plan */}
          <div
            style={{
              background: "rgba(201,168,76,0.035)",
              border: "1px solid rgba(201,168,76,0.14)",
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
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              ChameleonEye Executive
            </h3>
            <div style={{ marginBottom: 32 }}>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.88)",
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 32,
              }}
            >
              {[
                "Private Intelligence on Desktop (unlimited)",
                "1,200 Business Intelligence per month",
                "75 Extended Reviews per month",
                "40 Strategic Reviews per month",
                "20 Executive Analyses per month",
                "4 Board Reviews per month",
              ].map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.75)",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.32)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={`${APP_URL}/signup`}
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 20px",
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
              Get Executive access
            </a>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link
            href="/pricing"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.2)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            See full feature comparison
          </Link>
        </div>
      </div>
    </section>
  );
}


// ─── For Platforms / API section ─────────────────────────────────────────────
function ForPlatformsSection() {
  const apiPlans = [
    {
      name: "API Sandbox",
      price: "$9",
      desc: "For testing and experiments.",
      features: ["300 API calls / month", "Standard mode", "1 project", "Basic structured outputs"],
      popular: false,
    },
    {
      name: "API Starter",
      price: "$19",
      desc: "For small integrations.",
      features: ["1,000 API calls / month", "Guidance workflows", "30 req / min", "Usage dashboard"],
      popular: false,
    },
    {
      name: "API Business",
      price: "$49",
      desc: "For active platforms.",
      features: ["5,000 API calls / month", "All workflow APIs", "Industry pack", "Pulse events", "Custom rules"],
      popular: true,
    },
    {
      name: "API Growth",
      price: "$149",
      desc: "For SaaS & marketplaces.",
      features: ["25,000 API calls / month", "Custom endpoints", "Webhooks", "Priority routing"],
      popular: false,
    },
    {
      name: "Private Enterprise",
      price: "From $399",
      desc: "For serious companies.",
      features: ["Custom volume", "Private workflows", "Dedicated routing", "Custom deployment"],
      popular: false,
    },
  ];

  const workflows = [
    { name: "Guidance API",    desc: "Profile checks, forms, onboarding.",    endpoint: "POST /v1/guidance/profile-check" },
    { name: "Readiness API",   desc: "Score listings, posts, applications.",  endpoint: "POST /v1/readiness/job-post" },
    { name: "Draft API",       desc: "Safe drafts users approve before live.", endpoint: "POST /v1/drafts/improve" },
    { name: "Risk Check API",  desc: "Flag risky claims and missing proof.",   endpoint: "POST /v1/risk/check" },
    { name: "Pulse Events API",desc: "Detect where users get stuck.",          endpoint: "POST /v1/pulse/events" },
    { name: "Decision Memo",   desc: "Turn data into structured briefs.",      endpoint: "POST /v1/decision/memo" },
  ];

  const gold = "rgba(201,168,76,0.9)";
  const goldFaint = "rgba(201,168,76,0.08)";
  const goldBorder = "rgba(201,168,76,0.2)";
  const card = "rgba(255,255,255,0.025)";
  const border = "rgba(255,255,255,0.06)";
  const textSec = "rgba(255,255,255,0.3)";

  return (
    <section
      id="for-platforms"
      style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(22,163,74,0.85)", boxShadow: "0 0 6px rgba(22,163,74,0.5)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(22,163,74,0.7)", fontWeight: 500 }}>
              ChameleonEye API
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.92)", lineHeight: 1.05, marginBottom: 16 }}>
            Business Intelligence APIs<br />for serious platforms<span style={{ color: "#c9a84c" }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: textSec, maxWidth: 520, lineHeight: 1.65, marginBottom: 28 }}>
            Add guided decisions, safe drafts, readiness scoring, risk checks, and Pulse intelligence to your product. ChameleonEye API is a controlled business guidance layer — not a generic AI API.
          </p>
          <a
            href={`${APP_URL}/developer`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 9999, background: goldFaint, border: `1px solid ${goldBorder}`, color: gold, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            Explore ChameleonEye API ↗
          </a>
        </div>

        {/* Comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 80 }}>
          <div style={{ padding: "28px", background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const, marginBottom: 20 }}>Generic AI APIs</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Raw chat completion", "No business workflow structure", "No built-in safety validation", "No readiness scoring", "No Pulse intelligence", "No approval workflow"].map(t => (
                <div key={t} style={{ display: "flex", gap: 9 }}>
                  <span style={{ color: "rgba(239,68,68,0.6)", flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "28px", background: "rgba(201,168,76,0.03)", border: `1px solid ${goldBorder}`, borderRadius: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: gold, textTransform: "uppercase" as const, marginBottom: 20 }}>ChameleonEye API</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Business workflow endpoints", "Structured outputs", "Safe drafts", "Readiness scores", "Risk warnings & missing facts", "Pulse events", "Next-best-action guidance", "Audit-friendly outputs", "Custom rules per workflow"].map(t => (
                <div key={t} style={{ display: "flex", gap: 9 }}>
                  <span style={{ color: gold, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: textSec }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow products */}
        <div style={{ marginBottom: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const, marginBottom: 20 }}>Ready workflow endpoints</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {workflows.map(w => (
              <div key={w.name} style={{ padding: "20px", background: card, border: `1px solid ${border}`, borderRadius: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>{w.name}</p>
                <p style={{ fontSize: 12, color: textSec, marginBottom: 12 }}>{w.desc}</p>
                <code style={{ fontSize: 10.5, fontFamily: "monospace", color: "rgba(201,168,76,0.6)", background: "rgba(0,0,0,0.25)", padding: "5px 9px", borderRadius: 5, display: "block" }}>
                  {w.endpoint}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* API Pricing */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const, marginBottom: 20 }}>API Plans</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {apiPlans.map(plan => (
              <div
                key={plan.name}
                style={{ padding: "22px 18px", background: plan.popular ? "rgba(201,168,76,0.04)" : card, border: plan.popular ? `1px solid ${goldBorder}` : `1px solid ${border}`, borderRadius: 16, display: "flex", flexDirection: "column", position: "relative" as const }}
              >
                {plan.popular && (
                  <span style={{ position: "absolute" as const, top: -9, left: "50%", transform: "translateX(-50%)", background: "#c9a84c", color: "#080806", fontSize: 8, fontWeight: 800, padding: "2px 9px", borderRadius: 9999, letterSpacing: "0.1em", whiteSpace: "nowrap" as const }}>
                    MOST POPULAR
                  </span>
                )}
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 3 }}>{plan.name}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", marginBottom: 14, lineHeight: 1.4 }}>{plan.desc}</p>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: plan.popular ? "#c9a84c" : "rgba(255,255,255,0.82)", letterSpacing: "-0.03em" }}>{plan.price}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>/mo</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                      <span style={{ color: plan.popular ? "#c9a84c" : "rgba(201,168,76,0.5)", flexShrink: 0, fontSize: 10, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 12, color: textSec }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`${APP_URL}/developer`}
                  style={{ marginTop: 18, display: "block", textAlign: "center" as const, padding: "8px 0", fontSize: 12, fontWeight: 600, borderRadius: 9999, textDecoration: "none", background: plan.popular ? goldFaint : "rgba(255,255,255,0.04)", border: plan.popular ? `1px solid ${goldBorder}` : `1px solid ${border}`, color: plan.popular ? gold : "rgba(255,255,255,0.35)" }}
                >
                  {plan.name === "Private Enterprise" ? "Contact Sales" : "Get Started"}
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, textAlign: "center" as const }}>
            <a
              href={`${APP_URL}/developer`}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              View full API documentation and workflow details
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <IntelligenceLayers />
        <Features />
        <PricingPreview />
        <ForPlatformsSection />
      </main>
      <SiteFooter />
    </>
  );
}
