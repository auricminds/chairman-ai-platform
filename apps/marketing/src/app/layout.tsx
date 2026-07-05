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
          .nav-pill {
            display: flex;
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
        `}</style>
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f0e8] antialiased">
        {children}
      </body>
    </html>
  );
}
