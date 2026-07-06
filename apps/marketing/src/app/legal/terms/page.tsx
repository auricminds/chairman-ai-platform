import type { Metadata } from "next";
import { SiteNav } from "../../_components/SiteNav";
import { SiteFooter } from "../../_components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service — Chairman AI",
};

const sections = [
  {
    title: "1. Acceptance",
    content: [
      "By creating a Chairman AI account or using Chairman AI Desktop, you agree to these Terms of Service. If you do not agree, do not use the service.",
    ],
  },
  {
    title: "2. Subscription and payment",
    content: [
      "Chairman AI Cloud Intelligence requires a paid subscription (Chairman Private at $10/month or Chairman Executive at $50/month). Subscriptions are billed monthly via Stripe. You may cancel at any time; access continues until the end of the billing period.",
      "Prices are in USD. We reserve the right to change pricing with 30 days' notice to existing subscribers.",
    ],
  },
  {
    title: "3. Permitted use",
    content: [
      "You may use Chairman AI for lawful personal and professional purposes. You may not use Chairman AI to: generate content that is unlawful, harmful, or deceptive; attempt to extract, identify, or reverse-engineer the AI models used; resell or sublicence access to the service; circumvent usage limits or access controls; or send automated requests at volumes that constitute abuse.",
    ],
  },
  {
    title: "4. AI limitations",
    content: [
      "Chairman AI provides AI-generated analysis for informational purposes only. It is not a substitute for professional legal, financial, medical, or other regulated advice. You are responsible for verifying AI-generated content before acting on it.",
    ],
  },
  {
    title: "5. Availability",
    content: [
      "We do not guarantee continuous availability. Cloud Intelligence depends on third-party infrastructure. We will communicate planned downtime where possible.",
    ],
  },
  {
    title: "6. Termination",
    content: [
      "We may suspend or terminate accounts that violate these terms without prior notice. You may delete your account at any time by contacting desk@chairmans.uk.",
    ],
    hasEmail: true,
    emailTarget: "desk@chairmans.uk",
  },
  {
    title: "7. Limitation of liability",
    content: [
      "To the maximum extent permitted by law, Chairmans Group is not liable for any indirect, incidental, or consequential damages arising from use of Chairman AI. Our total liability in any 12-month period is limited to the amount you paid us.",
    ],
  },
  {
    title: "8. Governing law",
    content: [
      "These terms are governed by the laws of England and Wales. Disputes will be resolved in the courts of England and Wales.",
    ],
  },
  {
    title: "9. Contact",
    content: ["Questions: desk@chairmans.uk"],
    hasEmail: true,
    emailTarget: "desk@chairmans.uk",
    prefix: "Questions: ",
  },
];

export default function TermsPage() {
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
              Last updated: July 2025
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
              Terms of Service
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
                  {section.content.map((para, i) => {
                    if (section.hasEmail && section.emailTarget && para.includes(section.emailTarget)) {
                      const parts = para.split(section.emailTarget);
                      return (
                        <p
                          key={i}
                          style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.3)",
                            lineHeight: 1.75,
                          }}
                        >
                          {parts[0]}
                          <a
                            href={`mailto:${section.emailTarget}`}
                            style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none" }}
                          >
                            {section.emailTarget}
                          </a>
                          {parts[1]}
                        </p>
                      );
                    }
                    return (
                      <p
                        key={i}
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.3)",
                          lineHeight: 1.75,
                        }}
                      >
                        {para}
                      </p>
                    );
                  })}
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
