import Link from "next/link";

const APP_URL = "https://app.ai.chairmans.uk";

function Nav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "calc(100% - 48px)",
        maxWidth: 780,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 10px 20px",
          borderRadius: 9999,
          background: "rgba(15,13,10,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.4)",
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
              filter: "drop-shadow(0 0 6px rgba(201,168,76,0.5))",
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.02em",
            }}
          >
            Chairman AI
          </span>
        </a>

        {/* Right: links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href={`${APP_URL}/signin`}
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
              padding: "6px 14px",
              transition: "color 0.2s",
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
              background: "linear-gradient(135deg, rgba(201,168,76,0.95) 0%, rgba(180,145,55,0.9) 100%)",
              padding: "8px 18px",
              borderRadius: 9999,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 2px 12px rgba(201,168,76,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
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
      {/* Ambient gold glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          background:
            "radial-gradient(ellipse at center, rgba(201,168,76,0.09) 0%, rgba(201,168,76,0.03) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#c9a84c",
              boxShadow: "0 0 8px rgba(201,168,76,0.6)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 500,
            }}
          >
            Private · Secure · Six intelligence modes
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "clamp(64px, 11vw, 112px)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.95)",
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
            fontSize: 18,
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto 52px",
          }}
        >
          Chairman AI gives you board-level analysis, strategic reviews, and private intelligence.
          Affordable plans — cancel anytime.
        </p>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 20,
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
              background: "linear-gradient(135deg, rgba(201,168,76,0.95) 0%, rgba(175,138,44,0.9) 100%)",
              color: "#0a0a08",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.02em",
              boxShadow: "0 4px 24px rgba(201,168,76,0.25), 0 1px 4px rgba(0,0,0,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
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

          <a
            href={`${APP_URL}/signin`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              backdropFilter: "blur(8px)",
            }}
          >
            Sign in
          </a>

          <Link
            href="/desktop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 9999,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.45)",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Desktop app
          </Link>
        </div>

        {/* Platform note */}
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.02em",
          }}
        >
          Cloud · macOS (Apple Silicon) · Windows 10 / 11
        </p>
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
    <section style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
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
                color: "rgba(201,168,76,0.7)",
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
              color: "rgba(255,255,255,0.3)",
              maxWidth: 440,
              lineHeight: 1.6,
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
            gap: 2,
          }}
        >
          {layers.map((layer, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "28px 28px",
                transition: "border-color 0.25s, background 0.25s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
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
                  color: "rgba(201,168,76,0.55)",
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
                  color: "rgba(255,255,255,0.3)",
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
    <section style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Feature 1: Privacy */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
            marginBottom: 120,
          }}
        >
          <div>
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
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.6)",
                  fontWeight: 500,
                }}
              >
                Privacy by architecture
              </span>
            </div>
            <h3
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Intelligence that never touches a server<span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.32)",
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
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "28px 28px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
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
                      boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
            marginBottom: 120,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "28px 28px",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
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
                      color: "rgba(255,255,255,0.35)",
                      marginBottom: 6,
                    }}
                  >
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div
                    style={{
                      height: 3,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background:
                          "linear-gradient(90deg, rgba(201,168,76,0.7) 0%, rgba(201,168,76,0.4) 100%)",
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.6)",
                  fontWeight: 500,
                }}
              >
                Cost integrity
              </span>
            </div>
            <h3
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Hard cost ceilings. No surprise bills<span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.32)",
                lineHeight: 1.7,
              }}
            >
              Every plan has an internal cost ceiling that cannot be overridden. We never show
              you token counts or AI costs. You see usage counters — not invoices. If capacity
              is reached, the response is clear and the billing is transparent.
            </p>
          </div>
        </div>

        {/* Feature 3: Site intelligence */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.6)",
                  fontWeight: 500,
                }}
              >
                Connected intelligence
              </span>
            </div>
            <h3
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Intelligence connected to your platforms<span style={{ color: "#c9a84c" }}>.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.32)",
                lineHeight: 1.7,
              }}
            >
              Chairman AI connects to Quicky CV and El Arab Club to provide guidance, profile
              analysis, and platform health reporting. All integrations use scoped API keys —
              no shared credentials, no cross-contamination of user data.
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "28px 28px",
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
                    i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.5)",
                    }}
                  />
                  <span
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}
                  >
                    {name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
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
    <section style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
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
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.6)",
                fontWeight: 500,
              }}
            >
              Pricing
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.05,
            }}
          >
            Two plans. No hidden tiers<span style={{ color: "#c9a84c" }}>.</span>
          </h2>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Private plan */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "36px 32px",
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
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
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "-0.04em",
                }}
              >
                $10
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.25)",
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
                      background: "rgba(201,168,76,0.5)",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <span
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}
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
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
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
              background: "rgba(201,168,76,0.04)",
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
                color: "rgba(201,168,76,0.7)",
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.18)",
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
                color: "rgba(255,255,255,0.85)",
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
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "-0.04em",
                }}
              >
                $50
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.25)",
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
                      background: "rgba(201,168,76,0.8)",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <span
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}
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
                  "linear-gradient(135deg, rgba(201,168,76,0.9) 0%, rgba(175,138,44,0.85) 100%)",
                color: "#0a0a08",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 20px rgba(201,168,76,0.2)",
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
              color: "rgba(255,255,255,0.25)",
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

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt="Chairman AI"
            style={{
              width: 22,
              height: 22,
              objectFit: "contain",
              filter: "drop-shadow(0 0 4px rgba(201,168,76,0.3))",
            }}
          />
          <span
            style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}
          >
            Chairman AI
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
          {[
            { label: "Pricing", href: "/pricing" },
            { label: "Desktop", href: "/desktop" },
            { label: "Privacy", href: "/legal/privacy" },
            { label: "Terms", href: "/legal/terms" },
            { label: "Sign in", href: `${APP_URL}/signin` },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.2)",
                textDecoration: "none",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Copy */}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.12)" }}>
          &copy; {new Date().getFullYear()} Chairmans Group
        </p>
      </div>
    </footer>
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
      <Footer />
    </>
  );
}
