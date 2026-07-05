import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { CORE_CONSTITUTION, CONSTITUTION_VERSION_NAME } from "@/policies/chairmanConstitution";

async function requireOwner() {
  const user = await requireAuth();
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["owner", "super_admin"].includes(profile.role as string)) {
    throw new AuthError("Owner access required.", 403);
  }
  return user;
}

// GET /v1/owner/constitution — list all versions + active settings
export async function GET() {
  try {
    const user = await requireOwner();
    void user;
    const admin = createAdminClient();

    const { data: versions, error } = await admin
      .from("chairman_policy_versions")
      .select("id, version_name, status, editable_settings, created_at, published_at, archived_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      currentConstitutionVersion: CONSTITUTION_VERSION_NAME,
      hardcodedCore: CORE_CONSTITUTION,
      versions: versions ?? [],
    });
  } catch (e: unknown) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

// POST /v1/owner/constitution — create a draft version
export async function POST(req: NextRequest) {
  try {
    const user = await requireOwner();
    const admin = createAdminClient();

    const body = (await req.json()) as {
      version_name?: string;
      editable_settings?: Record<string, unknown>;
    };

    if (!body.version_name?.trim()) {
      return NextResponse.json({ error: "version_name is required." }, { status: 400 });
    }

    const { data: version, error } = await admin
      .from("chairman_policy_versions")
      .insert({
        version_name: body.version_name.trim(),
        constitution_text: CORE_CONSTITUTION, // always uses the hardcoded core
        editable_settings: body.editable_settings ?? {},
        status: "draft",
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Audit log
    await admin.from("chairman_policy_audit_logs").insert({
      policy_version_id: version.id,
      owner_id: user.id,
      action: "created_draft",
      safe_metadata: { version_name: body.version_name },
    });

    return NextResponse.json({ version }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

// PATCH /v1/owner/constitution — publish or archive a version
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireOwner();
    const admin = createAdminClient();

    const body = (await req.json()) as {
      id?: string;
      action?: "publish" | "archive" | "set_testing";
      editable_settings?: Record<string, unknown>;
    };

    if (!body.id || !body.action) {
      return NextResponse.json({ error: "id and action are required." }, { status: 400 });
    }

    const { data: version } = await admin
      .from("chairman_policy_versions")
      .select("id, status, version_name")
      .eq("id", body.id)
      .single();

    if (!version) return NextResponse.json({ error: "Version not found." }, { status: 404 });

    if (body.action === "publish") {
      // Archive any currently active version first
      await admin
        .from("chairman_policy_versions")
        .update({ status: "archived", archived_at: new Date().toISOString() })
        .eq("status", "active");

      await admin
        .from("chairman_policy_versions")
        .update({
          status: "active",
          published_at: new Date().toISOString(),
          ...(body.editable_settings ? { editable_settings: body.editable_settings } : {}),
        })
        .eq("id", body.id);

      await admin.from("chairman_policy_audit_logs").insert({
        policy_version_id: body.id,
        owner_id: user.id,
        action: "published",
        safe_metadata: { version_name: version.version_name },
      });
    } else if (body.action === "archive") {
      if (version.status === "active") {
        return NextResponse.json({ error: "Cannot archive the active version directly. Publish a new version first." }, { status: 400 });
      }
      await admin
        .from("chairman_policy_versions")
        .update({ status: "archived", archived_at: new Date().toISOString() })
        .eq("id", body.id);

      await admin.from("chairman_policy_audit_logs").insert({
        policy_version_id: body.id,
        owner_id: user.id,
        action: "archived",
        safe_metadata: { version_name: version.version_name },
      });
    } else if (body.action === "set_testing") {
      await admin
        .from("chairman_policy_versions")
        .update({
          status: "testing",
          ...(body.editable_settings ? { editable_settings: body.editable_settings } : {}),
        })
        .eq("id", body.id);

      await admin.from("chairman_policy_audit_logs").insert({
        policy_version_id: body.id,
        owner_id: user.id,
        action: "set_testing",
        safe_metadata: { version_name: version.version_name },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
