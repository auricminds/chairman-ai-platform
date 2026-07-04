import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chairman AI — System Status",
  description: "Real-time system status for Chairman AI services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#f5f0e8] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
