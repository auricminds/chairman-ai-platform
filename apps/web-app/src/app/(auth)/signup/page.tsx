"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleGoogleSignUp = async () => {
    setOauthLoading(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/intelligence` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(false);
    }
  };

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

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => void handleGoogleSignUp()}
            disabled={oauthLoading || loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "12px 20px", borderRadius: 12, marginBottom: 20,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500,
              cursor: (oauthLoading || loading) ? "not-allowed" : "pointer",
              opacity: (oauthLoading || loading) ? 0.5 : 1,
              transition: "all 0.2s",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {oauthLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

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
