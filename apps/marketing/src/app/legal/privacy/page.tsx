import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Chairman AI",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-semibold text-[#f5f0e8]">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-400 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">1. What we collect</h2>
            <p>
              When you create a Chairman AI account, we collect your email address and,
              optionally, a display name. We do not collect your name, phone number, address,
              or payment card details — payment is handled directly by Stripe.
            </p>
            <p>
              When you use Cloud Intelligence, we record usage counters (how many analyses
              of each type you have used in the current billing period). We do not permanently
              store the content of your messages unless required by applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">2. Private Intelligence</h2>
            <p>
              When you use Private Intelligence on Chairman AI Desktop, no data is transmitted
              to our servers. The model runs locally on your device. We have no technical
              ability to access or log Private Intelligence conversations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">3. Cloud Intelligence processing</h2>
            <p>
              Cloud Intelligence messages are routed through our API to an AI provider via
              OpenRouter. We do not display or log the name of the AI model or provider to you.
              Messages may be retained by the AI provider according to their policies.
            </p>
            <p>
              We recommend you review OpenRouter&apos;s data policies before sending highly
              sensitive information through Cloud Intelligence. For your most sensitive work,
              use Private Intelligence on Chairman AI Desktop.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">4. Billing</h2>
            <p>
              Billing is handled by Stripe. We receive confirmation of subscription status
              from Stripe via webhook. We store your Stripe customer ID and subscription
              status. We do not store your payment card details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">5. Data sharing</h2>
            <p>
              We do not sell your data. We share data only with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supabase (database and authentication infrastructure)</li>
              <li>Stripe (payment processing)</li>
              <li>OpenRouter and its downstream AI providers (Cloud Intelligence processing only)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">6. Your rights</h2>
            <p>
              You can request deletion of your account and associated data by contacting us
              at desk@chairmans.uk. We will process deletion requests within 30 days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200">7. Contact</h2>
            <p>
              Privacy questions: <a href="mailto:desk@chairmans.uk" className="text-amber-500 hover:text-amber-400">desk@chairmans.uk</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
