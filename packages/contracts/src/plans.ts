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
