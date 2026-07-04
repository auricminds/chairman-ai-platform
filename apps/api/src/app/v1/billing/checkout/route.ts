import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { CheckoutRequestSchema } from "@chairman/contracts";

const STRIPE_PRICE_MAP: Record<string, string | undefined> = {
  chairman_private: process.env.STRIPE_PRICE_CHAIRMAN_PRIVATE_MONTHLY,
  chairman_executive: process.env.STRIPE_PRICE_CHAIRMAN_EXECUTIVE_MONTHLY,
};

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Billing not configured." }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    const parsed = CheckoutRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const priceId = STRIPE_PRICE_MAP[parsed.data.planKey];
    if (!priceId) {
      return NextResponse.json({ error: "Plan price not configured." }, { status: 503 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancelled`,
      metadata: {
        profile_id: user.id,
        plan_key: parsed.data.planKey,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Billing error." }, { status: 500 });
  }
}
