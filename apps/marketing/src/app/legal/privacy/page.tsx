import type { Metadata } from "next";
import { SiteNav } from "../../_components/SiteNav";
import { SiteFooter } from "../../_components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — Chairman AI",
};

const sections = [
  {
    title: "1. What we collect",
    content: [
      "When you create a Chairman AI account, we collect your email address and, optionally, a display name. We do not collect your name, phone number, address, or payment card details. Payment is handled directly by Stripe.",
      "When you use Cloud Intelligence, we record usage counters (how many analyses of each type you have used in the current billing period). We do not permanently store the content of your messages unless required by applicable law.",
    ],
  },
  {
    title: "2. Private Intelligence",
    content: [
      "When you use Private Intelligence on Chairman AI Desktop, no data is transmitted to our servers. The model runs locally on your device. We have no technical ability to access or log Private Intelligence conversations.",
    ],
  },
  {
    title: "3. Cloud Intelligence processing",
    content: [
      "Cloud Intelligence messages are routed through our API to an AI provider via OpenRouter. We do not display or log the name of the AI model or provider to you. Messages may be retained by the AI provider according to their policies.",
      "We recommend you review OpenRouter's data policies before sending highly sensitive information through Cloud Intelligence. For your most sensitive work, use Private Intelligence on Chairman AI Desktop.",
    ],
  },
  {
    title: "4. Billing",
    content: [
      "Billing is handled by Stripe. We receive confirmation of subscription status from Stripe via webhook. We store your Stripe customer ID and subscription status. We do not store your payment card details.",
    ],
  },
  {
    title: "5. Data sharing",
    content: [
      "We do not sell your data. We share data only with Supabase (database and authentication infrastructure), Stripe (payment processing), and OpenRouter and its downstream AI providers (Cloud Intelligence processing only).",
    ],
  },
  {
    title: "6. Your rights",
    content: [
      "You can request deletion of your account and associated data by contacting us at desk@chairmans.uk. We will process deletion requests within 30 days.",
    ],
  },
  {
    title: "7. Contact",
    content: ["Privacy questions: desk@chairmans.uk"],
    hasEmail: true,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: 120 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 120px" }}>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.06em",
                marginBottom: 12,
                fontFamily: "monospace",
              }}
            >
              Last updated: July 2026
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.05,
              }}
            >
              Privacy Policy
              <span style={{ color: "#c9a84c" }}>.</span>
            </h1>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {sections.map((section) => (
              <div key={section.title}>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.72)",
                    marginBottom: 14,
                  }}
                >
                  {section.title}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {section.content.map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.3)",
                        lineHeight: 1.75,
                      }}
                    >
                      {section.hasEmail && para.includes("desk@chairmans.uk") ? (
                        <>
                          Privacy questions:{" "}
                          <a
                            href="mailto:desk@chairmans.uk"
                            style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none" }}
                          >
                            desk@chairmans.uk
                          </a>
                        </>
                      ) : (
                        para
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
