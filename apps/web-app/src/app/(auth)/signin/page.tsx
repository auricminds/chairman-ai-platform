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

  return (
    <div className="auth-card-wrap">
      <div className="auth-outer-shell">
        <div className="auth-inner-core">
          <div className="auth-eyebrow">Welcome back</div>
          <h1 className="auth-heading">Sign in</h1>
          <p className="auth-subheading">Your private AI workspace is waiting.</p>

          {error && (
            <div className="auth-alert auth-alert-error">{error}</div>
          )}

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
              <label className="auth-label" htmlFor="password">Password</label>
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
