import Link from "next/link";

const APP_URL = "https://app.ai.chairmans.uk";

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-sm bg-amber-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-wider">C</span>
          </div>
          <span className="text-sm font-semibold text-[#f5f0e8] tracking-wide">Chairman AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/pricing" className="hover:text-[#f5f0e8] transition-colors">Pricing</Link>
          <Link href="/desktop" className="hover:text-[#f5f0e8] transition-colors">Desktop</Link>
          <a href={`${APP_URL}/signin`} className="hover:text-[#f5f0e8] transition-colors">Sign in</a>
          <a
            href={`${APP_URL}/signup`}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
          >
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
          Private Intelligence Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold text-[#f5f0e8] leading-tight tracking-tight">
          The intelligence layer
          <br />
          <span className="text-zinc-500">your decisions deserve.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Chairman AI gives you board-level analysis, strategic reviews, and private intelligence
          that stays entirely on your device — or in the cloud when you choose.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`${APP_URL}/signup`}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
          >
            Start with Cloud Intelligence
          </a>
          <Link
            href="/desktop"
            className="px-6 py-3 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-[#f5f0e8] rounded text-sm font-medium transition-colors"
          >
            Chairman AI Desktop
          </Link>
        </div>
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
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-amber-600 mb-3">Intelligence layers</p>
          <h2 className="text-3xl font-semibold text-[#f5f0e8] tracking-tight">
            One platform. Six levels of depth.
          </h2>
          <p className="text-zinc-500 mt-3 max-w-lg">
            From quick business answers to full board-level synthesis. Each mode is purpose-built,
            not a generic prompt adjustment.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {layers.map((layer, i) => (
            <div
              key={i}
              className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#f5f0e8]">{layer.mode}</span>
                {layer.badge && (
                  <span className="text-[10px] text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                    {layer.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-600/80 mb-2">{layer.label}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{layer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-600 mb-3">Privacy by architecture</p>
            <h3 className="text-2xl font-semibold text-[#f5f0e8] tracking-tight mb-4">
              Private Intelligence that never touches a server.
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              When you use Private Intelligence on Chairman AI Desktop, your message never leaves
              your device. There is no API call, no log, no cloud processing. The model runs
              entirely on your machine. This is not a privacy setting — it is the architecture.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
            <div className="text-xs text-zinc-600 font-mono">private_intelligence.log</div>
            <div className="space-y-2">
              {["Network calls: 0", "Cloud requests: 0", "Data transmitted: 0 bytes", "Inference: local"].map((line) => (
                <div key={line} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span className="text-zinc-400 font-mono">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
            <p className="text-xs text-zinc-600">Cost controls (internal — not shown to customers)</p>
            <div className="h-px bg-zinc-800 my-2" />
            <div className="space-y-1.5">
              {[
                { label: "Business Intelligence", pct: 45 },
                { label: "Extended Review", pct: 30 },
                { label: "Strategic Review", pct: 20 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full">
                    <div
                      className="h-full rounded-full bg-amber-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-widest text-amber-600 mb-3">Cost integrity</p>
            <h3 className="text-2xl font-semibold text-[#f5f0e8] tracking-tight mb-4">
              Hard cost ceilings. No surprise bills.
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              Every plan has an internal cost ceiling that cannot be overridden. We never show
              you token counts or AI costs. You see usage counters — not invoices. If capacity
              is reached, the response is clear and the billing is transparent.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-600 mb-3">Site intelligence</p>
            <h3 className="text-2xl font-semibold text-[#f5f0e8] tracking-tight mb-4">
              Intelligence connected to your other platforms.
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              Chairman AI connects to Quicky CV and El Arab Club to provide guidance, profile
              analysis, and platform health reporting. All integrations use scoped API keys —
              no shared credentials, no cross-contamination of user data.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-2">
            {[
              { name: "Quicky CV", scope: "guidance:quicky, events:write" },
              { name: "El Arab Club", scope: "guidance:elarab, events:write" },
              { name: "Chairmans Holding", scope: "internal" },
            ].map(({ name, scope }) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <span className="text-sm text-zinc-300">{name}</span>
                <span className="text-[10px] text-zinc-600 font-mono">{scope}</span>
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
    <section className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-amber-600 mb-3">Pricing</p>
        <h2 className="text-3xl font-semibold text-[#f5f0e8] tracking-tight">
          Two plans. No hidden tiers.
        </h2>
      </div>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Chairman Private */}
        <div className="border border-zinc-800 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#f5f0e8]">Chairman Private</h3>
            <p className="text-3xl font-semibold text-[#f5f0e8] mt-2">
              $10 <span className="text-base font-normal text-zinc-500">/ month</span>
            </p>
          </div>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            {[
              "Private Intelligence on Desktop (unlimited)",
              "300 Business Intelligence per month",
              "10 Extended Reviews per month",
              "3 Strategic Reviews per month",
              "2 Executive Analyses per month",
              "Board Review: not included",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1.5"></span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={`${APP_URL}/signup`}
            className="block w-full text-center py-2.5 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-[#f5f0e8] rounded text-sm font-medium transition-colors"
          >
            Get started
          </a>
        </div>

        {/* Chairman Executive */}
        <div className="border border-amber-800/50 rounded-lg p-6 space-y-6 bg-amber-950/10">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-[#f5f0e8]">Chairman Executive</h3>
              <span className="text-[10px] text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded">
                Full access
              </span>
            </div>
            <p className="text-3xl font-semibold text-[#f5f0e8] mt-2">
              $50 <span className="text-base font-normal text-zinc-500">/ month</span>
            </p>
          </div>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            {[
              "Private Intelligence on Desktop (unlimited)",
              "1,200 Business Intelligence per month",
              "75 Extended Reviews per month",
              "40 Strategic Reviews per month",
              "20 Executive Analyses per month",
              "4 Board Reviews per month",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"></span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={`${APP_URL}/signup`}
            className="block w-full text-center py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
          >
            Get Executive access
          </a>
        </div>
      </div>
      <div className="text-center mt-8">
        <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
          See full feature comparison
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm bg-amber-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">C</span>
          </div>
          <span className="text-sm text-zinc-500">Chairman AI</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-zinc-600">
          <Link href="/pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
          <Link href="/desktop" className="hover:text-zinc-400 transition-colors">Desktop</Link>
          <Link href="/legal/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/legal/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
          <a href={`${APP_URL}/signin`} className="hover:text-zinc-400 transition-colors">Sign in</a>
        </nav>
        <p className="text-xs text-zinc-700">
          &copy; {new Date().getFullYear()} Chairmans Group. All rights reserved.
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
