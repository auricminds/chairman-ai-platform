import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

// ─── DELETE /v1/developer/keys/:keyId — revoke a key ─────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const user = await requireAuth();
    const { keyId } = await params;

    const admin = createAdminClient();

    // Verify ownership before revoking
    const { data: existing } = await admin
      .from("api_keys")
      .select("id, profile_id, status")
      .eq("id", keyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Key not found." }, { status: 404 });
    }
    if (existing.profile_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (existing.status === "revoked") {
      return NextResponse.json({ error: "Key is already revoked." }, { status: 409 });
    }

    const { error } = await admin
      .from("api_keys")
      .update({ status: "revoked" })
      .eq("id", keyId);

    if (error) throw error;

    return NextResponse.json({ success: true, id: keyId, status: "revoked" });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("DELETE /v1/developer/keys/:keyId:", e);
    return NextResponse.json({ error: "Failed to revoke key." }, { status: 500 });
  }
}
