"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();

  // Supabase puts the recovery token in the URL hash — we need the session
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    // Listen so the session is picked up from the email link hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now active with recovery token — page is ready
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/intelligence"), 2000);
    }
  };

  if (done) {
    return (
      <div className="auth-card-wrap">
        <div className="auth-outer-shell">
          <div className="auth-inner-core">
            <div className="auth-success-wrap">
              <div className="auth-success-icon">✓</div>
              <h1 className="auth-heading" style={{ textAlign: "center" }}>Password updated</h1>
              <p className="auth-subheading" style={{ textAlign: "center", marginBottom: 0 }}>
                Signing you in…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card-wrap">
      <div className="auth-outer-shell">
        <div className="auth-inner-core">
          <div className="auth-eyebrow">Account</div>
          <h1 className="auth-heading">Set new password</h1>
          <p className="auth-subheading">Choose a strong password for your account.</p>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="new-password">New password</label>
              <input
                id="new-password"
                className="auth-input"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                className="auth-input"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
              />
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading || !password || !confirm}
            >
              {loading ? "Updating…" : "Update password"}
              {!loading && <span className="auth-btn-arrow">→</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
