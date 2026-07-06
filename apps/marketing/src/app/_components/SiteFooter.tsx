import Link from "next/link";

const APP_URL = "https://app.ai.chairmans.uk";

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "48px 24px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 32,
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
                filter: "drop-shadow(0 0 4px rgba(201,168,76,0.28))",
              }}
            />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.22)" }}>
              Chairman AI
            </span>
          </div>

          {/* Nav links */}
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
                  color: "rgba(255,255,255,0.18)",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 24,
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.1)" }}>
            &copy; {new Date().getFullYear()} Chairman AI. A product of{" "}
            <a
              href="https://chairmans.uk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(201,168,76,0.45)",
                textDecoration: "none",
              }}
            >
              Chairmans Holding
            </a>
            .
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.07)" }}>
            chairmans.uk
          </p>
        </div>
      </div>
    </footer>
  );
}
