import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createHash } from "crypto";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const StripeLib = (await import("stripe")).default;
  const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const payloadHash = createHash("sha256").update(body).digest("hex");
  const admin = createAdminClient();

  // Idempotency check
  const { data: existing } = await admin
    .from("billing_webhook_events")
    .select("id, status")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if ((existing as { status: string } | null)?.status === "processed") {
    return NextResponse.json({ received: true });
  }

  // Record event
  await admin.from("billing_webhook_events").upsert(
    {
      stripe_event_id: event.id,
      event_type: event.type,
      status: "pending",
      payload_hash: payloadHash,
    },
    { onConflict: "stripe_event_id" }
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.metadata?.profile_id) {
          await upsertSubscription(admin, {
            profileId: session.metadata.profile_id,
            planKey: session.metadata.plan_key ?? "",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            status: "active",
          });
          // Fetch the subscription to get billing period dates
          const stripeSub = await stripe.subscriptions.retrieve(session.subscription as string);
          await createUsageCycle(admin, {
            profileId: session.metadata.profile_id,
            planKey: session.metadata.plan_key ?? "",
            stripeSubscriptionId: session.subscription as string,
            periodStart: new Date(stripeSub.current_period_start * 1000).toISOString(),
            periodEnd: new Date(stripeSub.current_period_end * 1000).toISOString(),
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        await updateSubscriptionFromStripe(admin, sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await admin
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const stripeSub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await updateSubscriptionFromStripe(admin, stripeSub);
          // On renewal, close the previous cycle and open a new one
          if (invoice.billing_reason === "subscription_cycle") {
            const { data: sub } = await admin
              .from("subscriptions")
              .select("profile_id, plan_key")
              .eq("stripe_subscription_id", invoice.subscription)
              .maybeSingle();
            if (sub) {
              // Close previous active cycle for this subscription
              await admin
                .from("usage_cycles")
                .update({ status: "closed", updated_at: new Date().toISOString() })
                .eq("profile_id", sub.profile_id)
                .eq("status", "active");
              await createUsageCycle(admin, {
                profileId: sub.profile_id,
                planKey: sub.plan_key,
                stripeSubscriptionId: invoice.subscription as string,
                periodStart: new Date(stripeSub.current_period_start * 1000).toISOString(),
                periodEnd: new Date(stripeSub.current_period_end * 1000).toISOString(),
              });
            }
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await admin
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription);
        }
        break;
      }
    }

    await admin
      .from("billing_webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("stripe_event_id", event.id);
  } catch (err) {
    console.error("Webhook processing error:", err);
    await admin
      .from("billing_webhook_events")
      .update({ status: "failed" })
      .eq("stripe_event_id", event.id);
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(
  admin: ReturnType<typeof createAdminClient>,
  data: {
    profileId: string;
    planKey: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: string;
  }
) {
  await admin.from("subscriptions").upsert(
    {
      profile_id: data.profileId,
      stripe_customer_id: data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId,
      plan_key: data.planKey,
      status: data.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function createUsageCycle(
  admin: ReturnType<typeof createAdminClient>,
  data: {
    profileId: string;
    planKey: string;
    stripeSubscriptionId: string;
    periodStart: string;
    periodEnd: string;
  }
) {
  // Get the subscription's internal UUID to link the cycle
  const { data: sub } = await admin
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", data.stripeSubscriptionId)
    .maybeSingle();

  await admin.from("usage_cycles").insert({
    profile_id: data.profileId,
    subscription_id: sub?.id ?? null,
    plan_key: data.planKey,
    period_start: data.periodStart,
    period_end: data.periodEnd,
    status: "active",
  });
}

async function updateSubscriptionFromStripe(
  admin: ReturnType<typeof createAdminClient>,
  sub: Stripe.Subscription
) {
  await admin
    .from("subscriptions")
    .update({
      status:
        sub.status === "active"
          ? "active"
          : sub.status === "canceled"
            ? "cancelled"
            : "past_due",
      current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
}
