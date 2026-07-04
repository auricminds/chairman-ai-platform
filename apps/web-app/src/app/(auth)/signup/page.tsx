"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/intelligence`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="auth-card-wrap">
        <div className="auth-outer-shell">
          <div className="auth-inner-core">
            <div className="auth-success-wrap">
              <div className="auth-success-icon">✓</div>
              <h1 className="auth-heading" style={{ textAlign: "center" }}>Check your email</h1>
              <p className="auth-subheading" style={{ textAlign: "center", marginBottom: 0 }}>
                We sent a confirmation link to{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{email}</span>.
                Click the link to verify and access your workspace.
              </p>
              <p className="auth-hint" style={{ textAlign: "center", marginTop: 16 }}>
                If you don&apos;t see it, check your spam folder.
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
          <div className="auth-eyebrow">New account</div>
          <h1 className="auth-heading">Create account</h1>
          <p className="auth-subheading">Your private AI workspace, secured and ready.</p>

          {error && (
            <div className="auth-alert auth-alert-error">{error}</div>
          )}

          <form onSubmit={(e) => void handleSignUp(e)}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="auth-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="auth-input"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
              <p className="auth-hint">At least 8 characters.</p>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading || !email || !password}
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <span className="auth-btn-arrow">→</span>}
            </button>
          </form>

          <p className="auth-terms">
            By creating an account you agree to our{" "}
            <a href="https://ai.chairmans.uk/legal/terms">Terms of Service</a>{" "}
            and{" "}
            <a href="https://ai.chairmans.uk/legal/privacy">Privacy Policy</a>.
          </p>

          <p className="auth-link-row">
            Already have an account?{" "}
            <Link href="/signin" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
