import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Chairman AI",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <header className="border-b border-white/5 px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-sm bg-amber-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-wider">C</span>
          </div>
          <span className="text-sm font-semibold text-[#f5f0e8]">Chairman AI</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <div>
          <p className="text-xs text-zinc-600 mb-2">Last updated: July 2025</p>
          <h1 className="text-3xl font-semibold text-[#f5f0e8]">Terms of Service</h1>
        </div>

        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">1. Acceptance</h2>
            <p>
              By creating a Chairman AI account or using Chairman AI Desktop, you agree to
              these Terms of Service. If you do not agree, do not use the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">2. Subscription and payment</h2>
            <p>
              Chairman AI Cloud Intelligence requires a paid subscription (Chairman Private at
              $10/month or Chairman Executive at $50/month). Subscriptions are billed monthly
              via Stripe. You may cancel at any time; access continues until the end of the
              billing period.
            </p>
            <p>
              Prices are in USD. We reserve the right to change pricing with 30 days&apos; notice
              to existing subscribers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">3. Permitted use</h2>
            <p>
              You may use Chairman AI for lawful personal and professional purposes.
              You may not use Chairman AI to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate content that is unlawful, harmful, or deceptive</li>
              <li>Attempt to extract, identify, or reverse-engineer the AI models used</li>
              <li>Resell or sublicence access to the service</li>
              <li>Circumvent usage limits or access controls</li>
              <li>Send automated requests at volumes that constitute abuse</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">4. AI limitations</h2>
            <p>
              Chairman AI provides AI-generated analysis for informational purposes only.
              It is not a substitute for professional legal, financial, medical, or other
              regulated advice. You are responsible for verifying AI-generated content before
              acting on it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">5. Availability</h2>
            <p>
              We do not guarantee continuous availability. Cloud Intelligence depends on
              third-party infrastructure. We will communicate planned downtime where possible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">6. Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these terms without prior notice.
              You may delete your account at any time by contacting desk@chairmans.uk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">7. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Chairmans Group is not liable for
              any indirect, incidental, or consequential damages arising from use of Chairman AI.
              Our total liability in any 12-month period is limited to the amount you paid us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">8. Governing law</h2>
            <p>
              These terms are governed by the laws of England and Wales.
              Disputes will be resolved in the courts of England and Wales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">9. Contact</h2>
            <p>
              Questions: <a href="mailto:desk@chairmans.uk" className="text-amber-500 hover:text-amber-400">desk@chairmans.uk</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
