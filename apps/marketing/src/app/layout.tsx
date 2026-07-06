import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chairman AI — Private Intelligence Platform",
  description:
    "Chairman AI brings enterprise-grade intelligence to your decisions. Private by design. Powered by cloud when you choose.",
  openGraph: {
    title: "Chairman AI",
    description: "Private intelligence platform for serious decisions.",
    url: "https://ai.chairmans.uk",
    siteName: "Chairman AI",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          /* ── Responsive grid utilities ── */
          .feat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
          }
          .price-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          @media (max-width: 768px) {
            .feat-grid {
              grid-template-columns: 1fr;
              gap: 40px;
            }
            .feat-grid-reverse > :first-child {
              order: 2;
            }
            .feat-grid-reverse > :last-child {
              order: 1;
            }
            .price-grid {
              grid-template-columns: 1fr;
            }
            .hero-headline {
              font-size: clamp(52px, 14vw, 80px) !important;
            }
            .nav-pill {
              width: calc(100% - 32px) !important;
              max-width: 100% !important;
            }
          }

          /* ── Background orb animations ── */
          @keyframes orbBreath {
            0%, 100% {
              opacity: 1;
              transform: scale(1) translate(0, 0);
            }
            40% {
              opacity: 0.55;
              transform: scale(1.14) translate(24px, -36px);
            }
            70% {
              opacity: 0.82;
              transform: scale(0.94) translate(-18px, 22px);
            }
          }

          @keyframes orbFloat {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            30% {
              transform: translate(-28px, 18px) scale(1.07);
              opacity: 0.6;
            }
            65% {
              transform: translate(22px, -12px) scale(0.96);
              opacity: 0.85;
            }
          }

          @keyframes orbPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.45; transform: scale(1.18); }
          }

          @media (prefers-reduced-motion: reduce) {
            .bg-orb { animation: none !important; }
          }

          /* ── Ambient background layer ── */
          .bg-ambient {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
          }

          /* Scan-line texture — very subtle depth */
          .bg-ambient::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(255,255,255,0.007) 3px,
              rgba(255,255,255,0.007) 4px
            );
            pointer-events: none;
          }

          .bg-orb {
            position: absolute;
            border-radius: 50%;
          }

          /* Large hero orb — top, slow breath */
          .bg-orb-1 {
            width: 1100px;
            height: 800px;
            top: -280px;
            left: 50%;
            margin-left: -300px;
            background: radial-gradient(
              ellipse at 40% 45%,
              rgba(201,168,76,0.13),
              rgba(201,168,76,0.05) 48%,
              transparent 70%
            );
            filter: blur(90px);
            animation: orbBreath 22s ease-in-out infinite;
          }

          /* Bottom-left warmth — slow drift */
          .bg-orb-2 {
            width: 700px;
            height: 650px;
            bottom: -180px;
            left: -120px;
            background: radial-gradient(
              ellipse at 55% 55%,
              rgba(201,168,76,0.08),
              rgba(180,148,60,0.03) 50%,
              transparent 70%
            );
            filter: blur(110px);
            animation: orbFloat 27s ease-in-out infinite;
            animation-delay: -11s;
          }

          /* Right-side ambient — subtle pulse */
          .bg-orb-3 {
            width: 460px;
            height: 460px;
            top: 38%;
            right: -80px;
            background: radial-gradient(
              ellipse at center,
              rgba(255,255,255,0.028),
              transparent 65%
            );
            filter: blur(80px);
            animation: orbPulse 19s ease-in-out infinite;
            animation-delay: -7s;
          }

          /* Hover states */
          a:hover { opacity: 0.85; }

          /* Content sits above the ambient layer */
          .page-content {
            position: relative;
            z-index: 1;
          }
        `}</style>
      </head>
      <body className="bg-[#080806] text-[#f5f0e8] antialiased" style={{ margin: 0 }}>
        {/* Fixed ambient background */}
        <div className="bg-ambient" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>

        {/* Page content above ambient layer */}
        <div className="page-content">
          {children}
        </div>
      </body>
    </html>
  );
}
