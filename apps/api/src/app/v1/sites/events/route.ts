import { NextRequest, NextResponse } from "next/server";
import { SiteEventSchema } from "@/contracts";
import { verifySiteKey } from "@/lib/site-auth";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const keyCheck = await verifySiteKey(req, "events:write");
  if (!keyCheck.valid) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  // Remove siteKey from body before parsing (it comes via header)
  const parsed = SiteEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid event.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { eventType, severity, safeMetadata, occurredAt } = parsed.data;

  const admin = createAdminClient();
  const { error } = await admin.from("site_events").insert({
    site_client_id: keyCheck.siteClientId,
    event_type: eventType,
    severity,
    safe_metadata: safeMetadata ?? null,
    occurred_at: occurredAt,
  });

  if (error) {
    console.error("Site event insert error:", error.message);
    return NextResponse.json({ error: "Event recording failed." }, { status: 500 });
  }

  return NextResponse.json({ accepted: true });
}
