import { z } from "zod";

export const PLAN_KEYS = ["chairman_private", "chairman_executive"] as const;
export type PlanKey = typeof PLAN_KEYS[number];

export const CHAIRMAN_MODES = [
  "auto", "private", "business", "extended", "strategic", "executive", "board"
] as const;
export type ChairmanMode = typeof CHAIRMAN_MODES[number];

export interface PlanModeAllowance {
  monthlyLimit: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export interface PlanConfig {
  key: PlanKey;
  publicName: string;
  priceMonthlyUsd: number;
  hardCostCeilingUsd: number; // NEVER expose to customers
  modes: Partial<Record<ChairmanMode, PlanModeAllowance>>;
}

export const PLANS: Record<PlanKey, PlanConfig> = {
  chairman_private: {
    key: "chairman_private",
    publicName: "Chairman Private",
    priceMonthlyUsd: 10,
    hardCostCeilingUsd: 2.50,
    modes: {
      private:   { monthlyLimit: Infinity, maxInputTokens: 0, maxOutputTokens: 0, requiresConfirmation: false },
      business:  { monthlyLimit: 300,  maxInputTokens: 8000,  maxOutputTokens: 1000, requiresConfirmation: false },
      extended:  { monthlyLimit: 10,   maxInputTokens: 20000, maxOutputTokens: 2500, requiresConfirmation: false },
      strategic: { monthlyLimit: 3,    maxInputTokens: 12000, maxOutputTokens: 1500, requiresConfirmation: false },
      executive: {
        monthlyLimit: 2, maxInputTokens: 16000, maxOutputTokens: 2000, requiresConfirmation: true,
        confirmationMessage: "This will use 1 Executive Analysis from your monthly allowance.",
      },
      board:     { monthlyLimit: 0, maxInputTokens: 0, maxOutputTokens: 0, requiresConfirmation: false },
    },
  },
  chairman_executive: {
    key: "chairman_executive",
    publicName: "Chairman Executive",
    priceMonthlyUsd: 50,
    hardCostCeilingUsd: 12.00,
    modes: {
      private:   { monthlyLimit: Infinity, maxInputTokens: 0, maxOutputTokens: 0, requiresConfirmation: false },
      business:  { monthlyLimit: 1200, maxInputTokens: 10000, maxOutputTokens: 1500, requiresConfirmation: false },
      extended:  { monthlyLimit: 75,   maxInputTokens: 24000, maxOutputTokens: 4000, requiresConfirmation: false },
      strategic: { monthlyLimit: 40,   maxInputTokens: 16000, maxOutputTokens: 2000, requiresConfirmation: false },
      executive: {
        monthlyLimit: 20, maxInputTokens: 20000, maxOutputTokens: 3000, requiresConfirmation: true,
        confirmationMessage: "This will use 1 Executive Analysis from your monthly allowance.",
      },
      board: {
        monthlyLimit: 4, maxInputTokens: 30000, maxOutputTokens: 5000, requiresConfirmation: true,
        confirmationMessage: "This will use 1 Board Review from your monthly allowance.",
      },
    },
  },
};

export const CustomerPlanSchema = z.object({
  key: z.enum(PLAN_KEYS),
  publicName: z.string(),
  priceMonthlyUsd: z.number(),
});

export const ChairmanModeSchema = z.enum(CHAIRMAN_MODES);

// ─── API Plans (external developer API access) ─────────────────────────────────

export const API_PLAN_KEYS = ["api_starter", "api_pro", "api_enterprise"] as const;
export type ApiPlanKey = typeof API_PLAN_KEYS[number];

export interface ApiPlanConfig {
  key: ApiPlanKey;
  publicName: string;
  priceMonthlyUsd: number;
  requestsPerMonth: number | null; // null = unlimited
  rateLimitRpm: number;
  hardCostCeilingUsd: number;
  description: string;
  features: string[];
}

export const API_PLANS: Record<ApiPlanKey, ApiPlanConfig> = {
  api_starter: {
    key: "api_starter",
    publicName: "API Starter",
    priceMonthlyUsd: 29,
    requestsPerMonth: 1_000,
    rateLimitRpm: 30,
    hardCostCeilingUsd: 5.00,
    description: "For small projects and testing",
    features: [
      "1,000 API requests / month",
      "Standard & Strategic modes",
      "30 requests / min",
      "Streaming responses",
      "Usage dashboard",
    ],
  },
  api_pro: {
    key: "api_pro",
    publicName: "API Pro",
    priceMonthlyUsd: 99,
    requestsPerMonth: 10_000,
    rateLimitRpm: 120,
    hardCostCeilingUsd: 20.00,
    description: "For production SaaS integrations",
    features: [
      "10,000 API requests / month",
      "All Chairman modes",
      "120 requests / min",
      "Streaming responses",
      "Priority model routing",
      "Usage dashboard",
    ],
  },
  api_enterprise: {
    key: "api_enterprise",
    publicName: "API Enterprise",
    priceMonthlyUsd: 399,
    requestsPerMonth: null,
    rateLimitRpm: 600,
    hardCostCeilingUsd: 80.00,
    description: "Unlimited access for large-scale deployments",
    features: [
      "Unlimited API requests",
      "All Chairman modes including Board",
      "600 requests / min",
      "Streaming responses",
      "Dedicated model routing",
      "Usage dashboard",
      "Custom integration support",
    ],
  },
};
