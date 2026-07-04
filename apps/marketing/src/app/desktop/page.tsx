import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chairman AI Desktop — Private Intelligence on your device",
  description:
    "Chairman AI Desktop runs Private Intelligence entirely on your device. No cloud, no server, no data transmitted.",
};

export default function DesktopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-sm bg-amber-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-wider">C</span>
            </div>
            <span className="text-sm font-semibold text-[#f5f0e8] tracking-wide">Chairman AI</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-400">
            <Link href="/pricing" className="hover:text-[#f5f0e8] transition-colors">Pricing</Link>
            <a
              href="https://app.ai.chairmans.uk/signup"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-24 space-y-16">
        {/* Hero */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            macOS Desktop Application
          </div>
          <h1 className="text-4xl font-semibold text-[#f5f0e8] tracking-tight leading-tight">
            Private Intelligence.
            <br />
            <span className="text-zinc-500">Your device. No exceptions.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
            Chairman AI Desktop runs Private Intelligence entirely on your machine.
            No network call is made. No API is hit. No data leaves your device.
            This is the architecture — not a setting.
          </p>
        </div>

        {/* What it does */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#f5f0e8]">What Chairman AI Desktop includes</h2>
          <ul className="space-y-3">
            {[
              "Private Intelligence — runs locally on device, zero network calls",
              "Cloud Intelligence — connect to all cloud modes with your subscription",
              "Voice input — dictate your questions natively",
              "Fully private conversation history — stored only on your device",
              "macOS native — no Electron shell pretending to be native",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-zinc-400 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1.5"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Status — honest, no fake download */}
        <div className="border border-zinc-800 rounded-lg p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></span>
            <span className="text-xs text-amber-600 uppercase tracking-widest font-semibold">
              In preparation
            </span>
          </div>
          <h2 className="text-xl font-semibold text-[#f5f0e8]">
            Chairman AI Desktop is being prepared.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            We are not publishing a download until the application meets our standards for
            private intelligence quality, stability, and security. We will not release a
            beta that compromises the private-by-design guarantee.
          </p>
          <p className="text-zinc-600 text-sm">
            If you are interested in early access or have specific requirements,
            contact us directly. No waitlist form — just a real conversation.
          </p>
          <a
            href="mailto:desk@chairmans.uk"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#f5f0e8] transition-colors border border-zinc-700 hover:border-zinc-600 rounded px-4 py-2"
          >
            desk@chairmans.uk
          </a>
        </div>

        {/* Cloud alternative */}
        <div className="border-t border-zinc-900 pt-12 space-y-4">
          <h2 className="text-xl font-semibold text-[#f5f0e8]">
            Cloud Intelligence is available now.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            While Desktop is in preparation, Chairman AI&apos;s full Cloud Intelligence suite is
            available through the web application. Business Intelligence, Extended Review,
            Strategic Review, Executive Analysis, and Board Review — all cloud-based, all
            accessible today.
          </p>
          <a
            href="https://app.ai.chairmans.uk/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
          >
            Access Cloud Intelligence
          </a>
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
