/**
 * Chairman Response Schemas
 * Typed structures used between the API and AI engine.
 * The user interface receives clean human language — not raw JSON.
 */

export type ResponseType =
  | "business_response"
  | "strategic_review"
  | "predictive_insight"
  | "scope_redirect";

export type ConfidenceLevel = "low" | "medium" | "high";

export type InsightType =
  | "early_signal"
  | "potential_risk"
  | "pattern_detected"
  | "missing_information"
  | "recommended_action";

// ─────────────────────────────────────────────
// Predictive Insight
// ─────────────────────────────────────────────

export interface PredictiveInsight {
  insight_type: InsightType;
  summary: string;
  evidence_summary: string;
  confidence: ConfidenceLevel;
  why_it_matters: string;
  recommended_action: string;
  requires_human_review: true;
}

// ─────────────────────────────────────────────
// Response schemas
// ─────────────────────────────────────────────

export interface BusinessResponse {
  response_type: "business_response";
  answer: string;
  recommended_next_action: string;
  needs_verification: boolean;
  verification_note: string | null;
}

export interface StrategicReview {
  response_type: "strategic_review";
  summary: string;
  confirmed_information: string[];
  assumptions: string[];
  risks: string[];
  options: string[];
  recommended_next_action: string;
  needs_verification: true;
  verification_note: string;
}

export interface PredictiveInsightResponse {
  response_type: "predictive_insight";
  insights: PredictiveInsight[];
  recommended_next_action: string;
}

export interface ScopeRedirectResponse {
  response_type: "scope_redirect";
  message: string;
}

export type ChairmanResponse =
  | BusinessResponse
  | StrategicReview
  | PredictiveInsightResponse
  | ScopeRedirectResponse;

// ─────────────────────────────────────────────
// Predictive insight validation
// No evidence = no insight.
// ─────────────────────────────────────────────

export function validatePredictiveInsight(insight: PredictiveInsight): string[] {
  const errors: string[] = [];

  if (!insight.evidence_summary || insight.evidence_summary.trim().length < 10) {
    errors.push("Evidence summary is required and must describe actual evidence.");
  }

  if (!insight.summary || insight.summary.trim().length < 5) {
    errors.push("Insight summary is required.");
  }

  if (!insight.recommended_action || insight.recommended_action.trim().length < 5) {
    errors.push("Recommended action is required for every predictive insight.");
  }

  if (!insight.why_it_matters || insight.why_it_matters.trim().length < 5) {
    errors.push("Why it matters is required.");
  }

  // Enforce conservative confidence
  if (insight.confidence === "high" && insight.evidence_summary.length < 50) {
    errors.push("High confidence requires substantial evidence summary.");
  }

  // Check for magical prediction language
  const bannedPhrases = [
    "will definitely",
    "guaranteed",
    "certain success",
    "i know the future",
    "will rise",
    "will fall",
    "no doubt",
  ];
  const summaryLower = insight.summary.toLowerCase();
  for (const phrase of bannedPhrases) {
    if (summaryLower.includes(phrase)) {
      errors.push(`Banned certainty phrase in summary: "${phrase}"`);
    }
  }

  return errors;
}
