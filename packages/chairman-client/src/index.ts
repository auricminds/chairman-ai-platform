/**
 * Chairman AI Site Connector Client
 * For use on SERVER SIDE ONLY in Quicky CV and El Arab Club backends.
 * Never import this in browser code.
 */

export class ChairmanClient {
  private readonly baseUrl: string;
  private readonly siteKey: string;

  constructor(config: { baseUrl: string; siteKey: string }) {
    if (!config.siteKey) throw new Error("ChairmanClient: siteKey is required");
    if (!config.baseUrl) throw new Error("ChairmanClient: baseUrl is required");
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.siteKey = config.siteKey;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Chairman-Site-Key": this.siteKey,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" })) as { error?: string };
      throw new Error(`Chairman API ${res.status}: ${err.error ?? "Request failed"}`);
    }
    return res.json() as Promise<T>;
  }

  async quickyCreateScript(input: {
    role: string;
    industry: string;
    years_experience: number;
    skills: string[];
    language: "en" | "ar";
    tone: "professional" | "confident" | "warm";
    approved_user_facts: string[];
  }) {
    return this.post<{
      script: string;
      estimated_duration_seconds: number;
      missing_facts: string[];
      safety_notes: string[];
    }>("/v1/guidance/quicky/script", input);
  }

  async quickyImproveScript(input: {
    current_script: string;
    requested_change: string;
    approved_user_facts: string[];
    language: "en" | "ar";
  }) {
    return this.post<{
      revised_script: string;
      change_summary: string;
      safety_notes: string[];
    }>("/v1/guidance/quicky/improve-script", input);
  }

  async elArabProfileCheck(input: {
    role: "jobseeker" | "employer";
    completed_fields: string[];
    profile_status: string;
  }) {
    return this.post<{
      completion_percentage: number;
      missing_required_fields: string[];
      next_best_actions: string[];
      field_guidance: Record<string, string>;
    }>("/v1/guidance/elarab/profile-check", input);
  }

  async elArabProfileWrite(input: {
    role: "jobseeker" | "employer";
    approved_facts: string[];
    language: "en" | "ar";
    requested_style: string;
  }) {
    return this.post<{
      suggested_profile_text: string;
      review_warning: string;
    }>("/v1/guidance/elarab/profile-write", input);
  }

  async elArabListingCheck(input: {
    listing_data: Record<string, unknown>;
  }) {
    return this.post<{
      readiness_score: number;
      missing_fields: string[];
      clarity_suggestions: string[];
      warnings: string[];
    }>("/v1/guidance/elarab/listing-check", input);
  }

  async submitSiteEvent(input: {
    eventType: string;
    severity: "info" | "warning" | "error";
    safeMetadata?: Record<string, string | number | boolean>;
    occurredAt?: string;
  }) {
    return this.post<{ accepted: true }>("/v1/sites/events", {
      ...input,
      occurredAt: input.occurredAt ?? new Date().toISOString(),
    });
  }
}
