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
      <head />
      <body className="bg-[#0a0a0a] text-[#f5f0e8] antialiased">
        {children}
      </body>
    </html>
  );
}
