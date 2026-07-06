import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#111114",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.55)",
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          Page not found
          <span style={{ color: "#c9a84c" }}>.</span>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.28)",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/intelligence"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 9999,
            background: "linear-gradient(135deg, rgba(201,168,76,0.92) 0%, rgba(172,135,40,0.88) 100%)",
            color: "#080806",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 20px rgba(201,168,76,0.18)",
          }}
        >
          Go to Chairman AI
        </Link>
      </div>
    </div>
  );
}
