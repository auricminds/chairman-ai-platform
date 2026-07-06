const APP_URL = "https://app.ai.chairmans.uk";

export function SiteNav() {
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
        {/* Logo */}
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

        {/* Actions */}
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
              color: "#080806",
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
