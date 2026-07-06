import Link from "next/link";
import { SiteFooter } from "./_components/SiteFooter";

const APP_URL = "https://app.ai.chairmans.uk";

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
            alt="Chairman AI"
            style={{
              width: 28,
              height: 28,
              objectFit: "contain",
              filter: "drop-shadow(0 0 6px rgba(201,168,76,0.4))",
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
            Chairman AI
          </span>
        </a>

        {/* Right: links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
      {/* Local hero accent glow */}
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
              background: "#c9a84c",
              boxShadow: "0 0 8px rgba(201,168,76,0.55)",
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
          Board-level analysis, strategic reviews, and private intelligence.
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
        "Runs entirely locally. No cloud, no server, no network call. Your most sensitive thinking never leaves your machine. Available through Chairman AI Desktop.",
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
                background: "#c9a84c",
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.65)",
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
          {layers.map((layer, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "28px",
              }}
            >
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
                      color: "rgba(201,168,76,0.5)",
                      background: "rgba(201,168,76,0.06)",
                      border: "1px solid rgba(201,168,76,0.12)",
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
                  color: "rgba(201,168,76,0.5)",
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
          ))}
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
              When you use Private Intelligence on Chairman AI Desktop, your message never leaves
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
                { label: "Business Intelligence", pct: 45 },
                { label: "Extended Review", pct: 30 },
                { label: "Strategic Review", pct: 20 },
              ].map(({ label, pct }) => (
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
                    <span>{pct}%</span>
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
                          "linear-gradient(90deg, rgba(201,168,76,0.65) 0%, rgba(201,168,76,0.35) 100%)",
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

        {/* Feature 3: Connected intelligence */}
        <div className="feat-grid">
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
              Intelligence connected to your platforms
              <span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.7,
              }}
            >
              Chairman AI connects to Quicky CV and El Arab Club to provide guidance, profile
              analysis, and platform health reporting. All integrations use scoped API keys.
              No shared credentials, no cross-contamination of user data.
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
            {[
              { name: "Quicky CV", scope: "guidance:quicky, events:write" },
              { name: "El Arab Club", scope: "guidance:elarab, events:write" },
              { name: "Chairmans Holding", scope: "internal" },
            ].map(({ name, scope }, i, arr) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom:
                    i < arr.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.45)",
                    }}
                  />
                  <span
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}
                  >
                    {name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.18)",
                    fontFamily: "monospace",
                    letterSpacing: "0.02em",
                  }}
                >
                  {scope}
                </span>
              </div>
            ))}
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
              Chairman Private
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
              Chairman Executive
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


export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <IntelligenceLayers />
        <Features />
        <PricingPreview />
      </main>
      <SiteFooter />
    </>
  );
}
