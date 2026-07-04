"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { fetchMe } from "@/lib/api/client";

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMe()
      .then((data: Profile) => {
        setProfile(data);
        setDisplayName(data.display_name ?? "");
      })
      .catch(() => setError("Failed to load profile."));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: displayName || null })
        .eq("id", profile.id);

      if (updateError) throw updateError;
      setProfile((prev) => prev ? { ...prev, display_name: displayName || null } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    alert("Password reset email sent.");
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Account Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your profile and account security.</p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Profile */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-200">Profile</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Email address</label>
            <p className="text-sm text-zinc-300 bg-zinc-800/50 rounded px-3 py-2 border border-zinc-700/50">
              {profile?.email ?? "—"}
            </p>
          </div>
          <div>
            <label htmlFor="display-name" className="block text-xs text-zinc-500 mb-1.5">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span className="text-xs text-emerald-400">Saved.</span>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-200">Security</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-zinc-400 mb-4">
            Request a password reset link sent to your email address.
          </p>
          <button
            onClick={() => void handlePasswordReset()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded text-sm font-medium transition-colors"
          >
            Send password reset
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-5 space-y-2">
        <p className="text-xs text-zinc-600">
          Account ID: <span className="font-mono text-zinc-700">{profile?.id ?? "—"}</span>
        </p>
        <p className="text-xs text-zinc-600">
          Member since:{" "}
          {profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })
            : "—"}
        </p>
      </div>
    </div>
  );
}
