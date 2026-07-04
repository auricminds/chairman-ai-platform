import Link from "next/link";

export default function BillingCancelledPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-sm mx-auto space-y-6 px-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
          <svg className="h-7 w-7 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 mb-2">Checkout cancelled</h1>
          <p className="text-sm text-zinc-400">
            Your checkout was cancelled. No charge was made. You can subscribe at any time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/billing"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded text-sm font-medium transition-colors"
          >
            Back to Billing
          </Link>
          <Link
            href="/intelligence"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Continue without subscribing
          </Link>
        </div>
      </div>
    </div>
  );
}
