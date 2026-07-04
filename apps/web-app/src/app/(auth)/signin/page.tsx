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
    <div className="w-full max-w-sm space-y-8">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="h-10 w-10 mx-auto rounded bg-amber-600 flex items-center justify-center">
          <span className="text-white font-bold tracking-wider">C</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-100">Sign in to Chairman AI</h1>
        <p className="text-sm text-zinc-500">Cloud Intelligence at app.ai.chairmans.uk</p>
      </div>

      <form onSubmit={(e) => void handleSignIn(e)} className="space-y-4">
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
            autoComplete="current-password"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        No account?{" "}
        <Link href="/signup" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
