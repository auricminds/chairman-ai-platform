import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Chairman AI",
  description: "Chairman Private at $10/month and Chairman Executive at $50/month. No hidden tiers.",
};

const APP_URL = "https://app.ai.chairmans.uk";

const FEATURES = [
  {
    category: "Private Intelligence",
    rows: [
      {
        label: "On-device processing (Desktop)",
        private: "Unlimited",
        executive: "Unlimited",
        note: "Runs locally. No cloud calls.",
      },
    ],
  },
  {
    category: "Cloud Intelligence",
    rows: [
      { label: "Business Intelligence / month", private: "300", executive: "1,200", note: null },
      { label: "Extended Review / month", private: "10", executive: "75", note: null },
      { label: "Strategic Review / month", private: "3", executive: "40", note: null },
      {
        label: "Executive Analysis / month",
        private: "2",
        executive: "20",
        note: "Confirmation required per use",
      },
      {
        label: "Board Review / month",
        private: "Not included",
        executive: "4",
        note: "Confirmation required per use",
      },
    ],
  },
  {
    category: "Platform",
    rows: [
      { label: "Streaming responses", private: "Yes", executive: "Yes", note: null },
      {
        label: "Provider visibility",
        private: "None",
        executive: "None",
        note: "Model names are never shown",
      },
      { label: "Usage tracking", private: "Yes", executive: "Yes", note: "No cost figures shown" },
      { label: "Billing portal", private: "Yes", executive: "Yes", note: "Via Stripe" },
    ],
  },
  {
    category: "Site Intelligence (API)",
    rows: [
      { label: "Quicky CV guidance", private: "Via site key", executive: "Via site key", note: null },
      {
        label: "El Arab Club guidance",
        private: "Via site key",
        executive: "Via site key",
        note: null,
      },
      { label: "Site event ingestion", private: "Yes", executive: "Yes", note: null },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      {/* Nav */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/90">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-sm bg-amber-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-wider">C</span>
            </div>
            <span className="text-sm font-semibold text-[#f5f0e8] tracking-wide">Chairman AI</span>
          </Link>
          <a
            href={`${APP_URL}/signup`}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
          >
            Get started
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 space-y-16">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-amber-600 mb-3">Pricing</p>
          <h1 className="text-4xl font-semibold text-[#f5f0e8] tracking-tight mb-4">
            Two plans. No surprises.
          </h1>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Every plan includes Private Intelligence on Desktop — unlimited and fully local.
            Cloud Intelligence usage is counted, not throttled.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Private */}
          <div className="border border-zinc-800 rounded-lg p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#f5f0e8]">Chairman Private</h2>
              <p className="text-4xl font-semibold mt-3 text-[#f5f0e8]">
                $10{" "}
                <span className="text-lg font-normal text-zinc-500">/ month</span>
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Individual use. Covers everyday cloud intelligence needs with Desktop included.
              </p>
            </div>
            <a
              href={`${APP_URL}/signup`}
              className="block w-full text-center py-3 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-[#f5f0e8] rounded text-sm font-medium transition-colors"
            >
              Start with Private
            </a>
          </div>

          {/* Executive */}
          <div className="border border-amber-800/50 bg-amber-950/10 rounded-lg p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#f5f0e8]">Chairman Executive</h2>
                <span className="text-[10px] text-amber-400 border border-amber-800 px-2 py-0.5 rounded">
                  Full access
                </span>
              </div>
              <p className="text-4xl font-semibold mt-3 text-[#f5f0e8]">
                $50{" "}
                <span className="text-lg font-normal text-zinc-500">/ month</span>
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Executives and leadership teams. Board Review access, 4x business capacity.
              </p>
            </div>
            <a
              href={`${APP_URL}/signup`}
              className="block w-full text-center py-3 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
            >
              Start with Executive
            </a>
          </div>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 pr-6 text-zinc-500 font-normal w-1/2">Feature</th>
                <th className="text-center py-3 px-4 text-zinc-300 font-semibold">Private</th>
                <th className="text-center py-3 px-4 text-amber-400 font-semibold">Executive</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((section) => (
                <>
                  <tr key={section.category}>
                    <td
                      colSpan={3}
                      className="pt-6 pb-2 text-xs uppercase tracking-widest text-amber-600 font-semibold"
                    >
                      {section.category}
                    </td>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-900 hover:bg-zinc-900/30">
                      <td className="py-3 pr-6 text-zinc-400">
                        {row.label}
                        {row.note && (
                          <span className="block text-xs text-zinc-700 mt-0.5">{row.note}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-zinc-400">{row.private}</td>
                      <td className="py-3 px-4 text-center text-zinc-300">{row.executive}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="border border-zinc-900 rounded-lg px-6 py-5 space-y-2 text-sm text-zinc-600">
          <p>All prices are in USD. Subscriptions renew monthly via Stripe.</p>
          <p>
            Private Intelligence is available exclusively through Chairman AI Desktop (macOS).
            Cloud Intelligence requires an active subscription.
          </p>
          <p>
            Usage counts are per calendar billing period. There are no rollover allowances.
            Unused allowances do not carry forward.
          </p>
          <p>
            Executive Analysis and Board Review require in-app confirmation before each use.
          </p>
        </div>
      </main>

      <footer className="border-t border-zinc-900 py-10 px-6 mt-12">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-4 text-sm text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Chairmans Group. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
