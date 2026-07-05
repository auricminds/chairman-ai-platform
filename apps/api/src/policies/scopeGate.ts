/**
 * Chairman Scope Gate
 * Classifies every user request before it reaches a premium AI engine.
 * Personal / non-business requests are redirected without spending tokens.
 */

export type ScopeCategory =
  | "business_strategy"
  | "operations"
  | "professional_writing"
  | "project_management"
  | "professional_career"
  | "document_review"
  | "workflow_design"
  | "research_request"
  | "website_product_analysis"
  | "productivity_for_work"
  | "business_decision"
  | "casual_chat"
  | "companionship"
  | "romance"
  | "sexual_content"
  | "relationship_advice"
  | "personal_therapy"
  | "personal_lifestyle"
  | "entertainment_roleplay"
  | "nonprofessional_gossip"
  | "unknown";

export interface ScopeResult {
  category: ScopeCategory;
  allowed: boolean;
  redirectMessage: string | null;
}

export const SCOPE_REDIRECT_MESSAGE =
  "Chairman AI is designed for professional and business work.\n" +
  "Tell me the business goal, project, customer, document, workflow,\n" +
  "career objective, or decision you want to improve.";

// ─────────────────────────────────────────────
// ALLOWED categories
// ─────────────────────────────────────────────

const ALLOWED_CATEGORIES = new Set<ScopeCategory>([
  "business_strategy",
  "operations",
  "professional_writing",
  "project_management",
  "professional_career",
  "document_review",
  "workflow_design",
  "research_request",
  "website_product_analysis",
  "productivity_for_work",
  "business_decision",
]);

// ─────────────────────────────────────────────
// REDIRECT categories
// ─────────────────────────────────────────────

const REDIRECT_CATEGORIES = new Set<ScopeCategory>([
  "casual_chat",
  "companionship",
  "romance",
  "sexual_content",
  "relationship_advice",
  "personal_therapy",
  "personal_lifestyle",
  "entertainment_roleplay",
  "nonprofessional_gossip",
]);

// ─────────────────────────────────────────────
// DETERMINISTIC CLASSIFIERS
// Pattern-matched before any AI call.
// ─────────────────────────────────────────────

const REDIRECT_PATTERNS: Array<{ pattern: RegExp; category: ScopeCategory }> = [
  // Companionship / romance
  { pattern: /\b(i love you|i miss you|be my (girlfriend|boyfriend|partner|companion))\b/i, category: "romance" },
  { pattern: /\b(date me|flirt|sexy|seduce|romantic relationship with (you|ai))\b/i, category: "romance" },
  { pattern: /\b(you are my (friend|companion|buddy|soulmate))\b/i, category: "companionship" },
  { pattern: /\bhow are you (doing|feeling)\b(?!.*business|.*project|.*work)/i, category: "casual_chat" },
  { pattern: /\bwhat('s| is) your (favourite|favorite) (movie|food|song|color|colour|show)\b/i, category: "casual_chat" },
  { pattern: /\btell me a (joke|story|fun fact)\b(?!.*business|.*work|.*industry)/i, category: "casual_chat" },
  // Therapy / emotional — allow extra words between "I am/I'm" and the emotion
  { pattern: /\bi'?m\s+(so\s+)?(depressed|lonely|suicidal|sad|crying|heartbroken)\b/i, category: "personal_therapy" },
  { pattern: /\bi am\s+(so\s+)?(depressed|lonely|suicidal|sad|crying|heartbroken)\b/i, category: "personal_therapy" },
  { pattern: /\b(therapy|therapist|mental health advice|emotional support from you)\b/i, category: "personal_therapy" },
  // Sexual
  { pattern: /\b(porn|explicit|nsfw|sexual content|erotic)\b/i, category: "sexual_content" },
  // Prompt injection — flexible word-order matching
  { pattern: /ignore\b.{0,30}\b(instructions|rules|system prompt|previous)/i, category: "entertainment_roleplay" },
  { pattern: /disregard\b.{0,30}\b(instructions|rules|system prompt|previous)/i, category: "entertainment_roleplay" },
  { pattern: /forget\b.{0,30}\b(instructions|rules|system prompt|prior)/i, category: "entertainment_roleplay" },
  { pattern: /you are now (a |an )?(different|new|unrestricted|free|jailbroken)/i, category: "entertainment_roleplay" },
  // Pretend without restrictions — allow apostrophe variants and filler words
  { pattern: /pretend (you('?re| are)).{0,20}(without|no)\s+(any\s+)?(rules|restrictions|limits)/i, category: "entertainment_roleplay" },
  // System prompt extraction — flexible ("show me your...", "reveal your...", "what is your...")
  { pattern: /\b(show|reveal|print|display)\b.{0,20}\b(system prompt|system instruction|hidden instruction)s?\b/i, category: "entertainment_roleplay" },
  { pattern: /\btell me\b.{0,20}\b(system prompt|system instruction|hidden instruction)s?\b/i, category: "entertainment_roleplay" },
  { pattern: /\b(what is|what's)\b.{0,20}\b(system prompt|system instruction|hidden instruction)s?\b/i, category: "entertainment_roleplay" },
  { pattern: /\breveal\b.{0,30}\b(hidden|system)\s+(instruction|prompt)s?\b/i, category: "entertainment_roleplay" },
];

const BUSINESS_PATTERNS: Array<{ pattern: RegExp; category: ScopeCategory }> = [
  { pattern: /\b(business plan|strategy|strategic|market analysis|competitor|competitive)\b/i, category: "business_strategy" },
  { pattern: /\b(proposal|pitch deck|investor|funding|revenue model|business model)\b/i, category: "business_strategy" },
  { pattern: /\b(workflow|process|operation|sop|standard operating|automation)\b/i, category: "operations" },
  { pattern: /\b(email|letter|report|presentation|document|draft|write|rewrite|summarise|summarize)\b/i, category: "professional_writing" },
  { pattern: /\b(project|milestone|timeline|deadline|deliverable|stakeholder|kpi)\b/i, category: "project_management" },
  { pattern: /\b(cv|resume|cover letter|job application|career|linkedin|interview)\b/i, category: "professional_career" },
  { pattern: /\b(contract|agreement|brief|review|audit|analyse|analyze|assessment)\b/i, category: "document_review" },
  { pattern: /\b(website|landing page|product|feature|user experience|ux|conversion)\b/i, category: "website_product_analysis" },
  { pattern: /\b(research|market research|industry|trend|forecast|report)\b/i, category: "research_request" },
  { pattern: /\b(decision|option|risk|trade-off|tradeoff|recommendation|advise)\b/i, category: "business_decision" },
  { pattern: /\b(task|to-do|schedule|priority|productivity|efficiency|output)\b/i, category: "productivity_for_work" },
];

// ─────────────────────────────────────────────
// MAIN CLASSIFIER
// ─────────────────────────────────────────────

export function classifyScope(message: string): ScopeResult {
  const text = message.trim();

  // 1. Prompt injection / system extraction — always redirect
  for (const { pattern, category } of REDIRECT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        category,
        allowed: false,
        redirectMessage: SCOPE_REDIRECT_MESSAGE,
      };
    }
  }

  // 2. Clear business signal — allow immediately
  for (const { pattern, category } of BUSINESS_PATTERNS) {
    if (pattern.test(text)) {
      return { category, allowed: true, redirectMessage: null };
    }
  }

  // 3. Short greetings or very short messages — allow (let Constitution handle scope)
  // This avoids blocking "Hi, I need help with my business proposal"
  if (text.split(" ").length <= 6) {
    return { category: "unknown", allowed: true, redirectMessage: null };
  }

  // 4. Default: allow — the Constitution system prompt handles redirection at AI level
  // We only hard-block when we're certain the request is out of scope.
  return { category: "unknown", allowed: true, redirectMessage: null };
}

export function isScopeAllowed(category: ScopeCategory): boolean {
  return ALLOWED_CATEGORIES.has(category);
}

export function isScopeRedirect(category: ScopeCategory): boolean {
  return REDIRECT_CATEGORIES.has(category);
}
