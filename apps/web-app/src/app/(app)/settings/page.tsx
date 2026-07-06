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
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ff = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif' };

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
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)",
    marginBottom: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    outline: "none",
    boxSizing: "border-box",
    ...ff,
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 28px 60px", ...ff }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontWeight: 500, marginBottom: 10 }}>
          Account
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em", color: "rgba(255,255,255,0.92)", lineHeight: 1.1 }}>
          Settings<span style={{ color: "#c9a84c" }}>.</span>
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
          Manage your profile and account security.
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          fontSize: 13, color: "rgba(239,68,68,0.8)", lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* Profile card */}
      <div style={cardStyle}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>Profile</p>
        </div>
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email address</label>
            <div style={{
              ...inputStyle,
              color: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.015)",
              cursor: "default",
              userSelect: "all",
            }}>
              {profile?.email ?? "—"}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label htmlFor="display-name" style={labelStyle}>Display name</label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              style={{
                padding: "10px 20px", borderRadius: 10,
                border: "1px solid rgba(201,168,76,0.35)",
                background: "linear-gradient(135deg, rgba(201,168,76,0.85) 0%, rgba(201,168,76,0.65) 100%)",
                color: "#0a0a0a", fontSize: 13, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.5 : 1, transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(201,168,76,0.12)",
                ...ff,
              }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && (
              <span style={{ fontSize: 12, color: "rgba(74,222,128,0.75)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(74,222,128,0.8)", display: "inline-block" }} />
                Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security card */}
      <div style={cardStyle}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>Security</p>
        </div>
        <div style={{ padding: "24px" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20, lineHeight: 1.6 }}>
            Send a password reset link to your email address.
          </p>
          {resetSent ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, color: "rgba(74,222,128,0.8)",
              padding: "10px 16px", borderRadius: 10,
              background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(74,222,128,0.8)", display: "inline-block" }} />
              Reset link sent — check your email
            </div>
          ) : (
            <button
              onClick={() => void handlePasswordReset()}
              style={{
                padding: "10px 20px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s", ...ff,
              }}
            >
              Send password reset →
            </button>
          )}
        </div>
      </div>

      {/* Account info */}
      <div style={{
        background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 12, padding: "16px 24px",
      }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 6, fontFamily: "monospace", letterSpacing: "0.02em" }}>
          Account ID: {profile?.id ?? "—"}
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", letterSpacing: "0.02em" }}>
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
