"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();

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
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="h-10 w-10 mx-auto rounded bg-amber-600 flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-100">Check your email</h1>
        <p className="text-sm text-zinc-400">
          We sent a confirmation link to <span className="text-zinc-200">{email}</span>.
          Click the link to verify your address and sign in.
        </p>
        <p className="text-xs text-zinc-600">
          If you do not see the email, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="h-10 w-10 mx-auto rounded bg-amber-600 flex items-center justify-center">
          <span className="text-white font-bold tracking-wider">C</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-100">Create your account</h1>
        <p className="text-sm text-zinc-500">Chairman AI — Cloud Intelligence</p>
      </div>

      <form onSubmit={(e) => void handleSignUp(e)} className="space-y-4">
        {error && (
          <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-sm rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs text-zinc-500 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs text-zinc-500 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-600 transition-colors"
          />
          <p className="text-xs text-zinc-700 mt-1">Minimum 8 characters.</p>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-xs text-zinc-700 text-center">
          By creating an account you agree to our{" "}
          <a href="https://ai.chairmans.uk/legal/terms" className="underline hover:text-zinc-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="https://ai.chairmans.uk/legal/privacy" className="underline hover:text-zinc-500">
            Privacy Policy
          </a>.
        </p>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/signin" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
