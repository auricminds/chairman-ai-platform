import { z } from "zod";
import { ChairmanModeSchema } from "./plans";

// Chat endpoint
export const ChatRequestSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(50000),
  chairmanMode: ChairmanModeSchema,
  selectedCloudText: z.string().max(8000).optional(),
  cloudConsent: z.boolean(),
  idempotencyKey: z.string().min(1).max(128),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Entitlement response (safe for customers)
export const ModeAllowanceResponseSchema = z.object({
  mode: ChairmanModeSchema,
  monthlyLimit: z.number().nullable(),
  used: z.number(),
  remaining: z.number().nullable(),
  lockedReason: z.string().nullable(),
});

export const EntitlementResponseSchema = z.object({
  planKey: z.string().nullable(),
  planPublicName: z.string().nullable(),
  status: z.enum(["active", "cancelled", "past_due", "none"]),
  currentPeriodEnd: z.string().nullable(),
  modes: z.array(ModeAllowanceResponseSchema),
});
export type EntitlementResponse = z.infer<typeof EntitlementResponseSchema>;

// Usage response (safe for customers - no costs)
export const UsageResponseSchema = z.object({
  periodStart: z.string(),
  periodEnd: z.string(),
  counters: z.array(z.object({
    mode: ChairmanModeSchema,
    used: z.number(),
    limit: z.number().nullable(),
  })),
});
export type UsageResponse = z.infer<typeof UsageResponseSchema>;

// Billing checkout
export const CheckoutRequestSchema = z.object({
  planKey: z.enum(["chairman_private", "chairman_executive"]),
});
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

// Guidance - Quicky CV
export const QuickyScriptRequestSchema = z.object({
  role: z.string().min(1).max(200),
  industry: z.string().min(1).max(200),
  years_experience: z.number().min(0).max(60),
  skills: z.array(z.string().max(100)).max(20),
  language: z.enum(["en", "ar"]),
  tone: z.enum(["professional", "confident", "warm"]),
  approved_user_facts: z.array(z.string().max(500)).max(30),
});
export type QuickyScriptRequest = z.infer<typeof QuickyScriptRequestSchema>;

export const QuickyScriptResponseSchema = z.object({
  script: z.string(),
  estimated_duration_seconds: z.number(),
  missing_facts: z.array(z.string()),
  safety_notes: z.array(z.string()),
});
export type QuickyScriptResponse = z.infer<typeof QuickyScriptResponseSchema>;

// Guidance - El Arab Club profile check
export const ElArabProfileCheckRequestSchema = z.object({
  role: z.enum(["jobseeker", "employer"]),
  completed_fields: z.array(z.string()),
  profile_status: z.string(),
});
export type ElArabProfileCheckRequest = z.infer<typeof ElArabProfileCheckRequestSchema>;

export const ElArabProfileCheckResponseSchema = z.object({
  completion_percentage: z.number().min(0).max(100),
  missing_required_fields: z.array(z.string()),
  next_best_actions: z.array(z.string()),
  field_guidance: z.record(z.string()),
});
export type ElArabProfileCheckResponse = z.infer<typeof ElArabProfileCheckResponseSchema>;

// Site events
export const SiteEventSchema = z.object({
  siteKey: z.string().min(1).max(64),
  eventType: z.enum([
    "route_error", "failed_form", "failed_login", "abandoned_registration",
    "missing_profile_field", "broken_link", "failed_payment_redirect",
    "permission_denied", "deployment_notice", "listing_quality_warning",
  ]),
  severity: z.enum(["info", "warning", "error"]),
  safeMetadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  occurredAt: z.string().datetime(),
});
export type SiteEvent = z.infer<typeof SiteEventSchema>;

// Profile
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().nullable(),
  role: z.enum(["user", "owner", "super_admin"]),
  created_at: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;
