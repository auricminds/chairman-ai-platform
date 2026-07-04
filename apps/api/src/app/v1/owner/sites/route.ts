import { NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

async function requireOwner(userId: string) {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (!profile || !["owner", "super_admin"].includes(profile.role as string)) {
    throw new AuthError("Owner access required.", 403);
  }
}

export async function GET() {
  try {
    const user = await requireAuth();
    await requireOwner(user.id);

    const admin = createAdminClient();
    const { data: sites, error } = await admin
      .from("site_clients")
      .select("id, site_key, display_name, status, allowed_scopes, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch sites." }, { status: 500 });
    }

    return NextResponse.json(sites);
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    await requireOwner(user.id);

    const body = await req.json().catch(() => null) as {
      id?: string;
      status?: string;
      display_name?: string;
    } | null;

    if (!body?.id) {
      return NextResponse.json({ error: "Site ID required." }, { status: 400 });
    }

    const allowedUpdates: Record<string, unknown> = {};
    if (body.status && ["active", "inactive", "suspended"].includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (body.display_name) {
      allowedUpdates.display_name = body.display_name;
    }
    allowedUpdates.updated_at = new Date().toISOString();

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("site_clients")
      .update(allowedUpdates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Update failed." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
