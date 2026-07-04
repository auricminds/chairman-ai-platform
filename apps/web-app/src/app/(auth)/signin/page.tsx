"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
    } else {
      router.push("/intelligence");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
  };

  if (resetSent) {
    return (
      <div className="auth-card-wrap">
        <div className="auth-outer-shell">
          <div className="auth-inner-core">
            <div className="auth-success-wrap">
              <div className="auth-success-icon">✓</div>
              <h1 className="auth-heading" style={{ textAlign: "center" }}>Check your email</h1>
              <p className="auth-subheading" style={{ textAlign: "center", marginBottom: 0 }}>
                We sent a password reset link to{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{email}</span>.
              </p>
              <p className="auth-hint" style={{ textAlign: "center", marginTop: 16 }}>
                Check your spam folder if you don&apos;t see it.
              </p>
            </div>
            <p className="auth-link-row">
              <button
                style={{ background: "none", border: "none", cursor: "pointer" }}
                className="auth-link"
                onClick={() => { setResetSent(false); setResetMode(false); }}
              >
                Back to sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (resetMode) {
    return (
      <div className="auth-card-wrap">
        <div className="auth-outer-shell">
          <div className="auth-inner-core">
            <div className="auth-eyebrow">Reset password</div>
            <h1 className="auth-heading">Forgot password?</h1>
            <p className="auth-subheading">Enter your email and we&apos;ll send a reset link.</p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}

            <form onSubmit={(e) => void handleReset(e)}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-email">Email</label>
                <input
                  id="reset-email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading || !email}
              >
                {loading ? "Sending…" : "Send reset link"}
                {!loading && <span className="auth-btn-arrow">→</span>}
              </button>
            </form>

            <p className="auth-link-row">
              <button
                style={{ background: "none", border: "none", cursor: "pointer" }}
                className="auth-link"
                onClick={() => { setResetMode(false); setError(null); }}
              >
                Back to sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card-wrap">
      <div className="auth-outer-shell">
        <div className="auth-inner-core">
          <div className="auth-eyebrow">Welcome back</div>
          <h1 className="auth-heading">Sign in</h1>
          <p className="auth-subheading">Your private AI workspace is waiting.</p>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={(e) => void handleSignIn(e)}>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <label className="auth-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "rgba(201,168,76,0.6)", letterSpacing: "0.02em" }}
                  onClick={() => { setResetMode(true); setError(null); }}
                >
                  Forgot?
                </button>
              </div>
              <input
                id="password"
                className="auth-input"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading || !email || !password}
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <span className="auth-btn-arrow">→</span>}
            </button>
          </form>

          <p className="auth-link-row">
            No account yet?{" "}
            <Link href="/signup" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
