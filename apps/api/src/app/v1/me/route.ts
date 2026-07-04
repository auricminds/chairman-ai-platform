import { NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await requireAuth();
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, email, display_name, role, created_at")
      .eq("id", user.id)
      .single();
    return NextResponse.json(profile);
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
