"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function BillingSuccessPage() {
  useEffect(() => {
    // The actual subscription record is created via Stripe webhook
    // No action needed here — just wait and redirect
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-sm mx-auto space-y-6 px-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-900/30 border border-emerald-800 flex items-center justify-center">
          <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 mb-2">Subscription activated</h1>
          <p className="text-sm text-zinc-400">
            Your ChameleonEye AI subscription is now active. It may take a moment for your access to reflect.
          </p>
        </div>
        <Link
          href="/intelligence"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
        >
          Go to Intelligence
        </Link>
      </div>
    </div>
  );
}
