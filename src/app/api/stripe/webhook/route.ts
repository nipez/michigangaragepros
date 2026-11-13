import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getDb, getEnv } from "@/lib/db";
import { activateFeaturedFromCheckout } from "@/lib/featured-activate";
import { applySubscriptionStatusChange } from "@/lib/featured-billing";
import { formatFeaturedNotify, notifyOperator } from "@/lib/notify";
import { createStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook for Featured subscriptions.
 * Events:
 * - checkout.session.completed → mark paid/won + set companies.featured + Stripe ids
 * - customer.subscription.updated → sync status; feature / un-feature / payment issue
 * - customer.subscription.deleted → clear Featured placement
 *
 * past_due keeps Featured during Stripe dunning; unpaid/canceled clear it.
 * Operator emails fire once per genuine prior→new transition (not renewals).
 */
export async function POST(request: Request) {
  const env = await getEnv();
  const secretKey = env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!secretKey || !webhookSecret) {
    console.error("Stripe webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = createStripeClient(secretKey);

  let event: Stripe.Event;
  try {
    // Async verify works on Workers (SubtleCrypto) and Node.
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = await getDb();

  // Idempotency: skip if we already handled this event id.
  const existing = await db
    .prepare(`SELECT event_id FROM stripe_webhook_events WHERE event_id = ? LIMIT 1`)
    .bind(event.id)
    .first<{ event_id: string }>();

  if (existing?.event_id) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(
        db,
        event.data.object as Stripe.Checkout.Session,
      );
    } else if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await handleSubscriptionChange(
        db,
        event.data.object as Stripe.Subscription,
        event.type === "customer.subscription.deleted" ? "canceled" : null,
        event.created,
      );
    }

    await db
      .prepare(
        `INSERT INTO stripe_webhook_events (event_id, type) VALUES (?, ?)`,
      )
      .bind(event.id, event.type)
      .run();
  } catch (err) {
    console.error("Stripe webhook handler failed", event.type, event.id, err);
    // 500 so Stripe retries
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  db: D1Database,
  session: Stripe.Checkout.Session,
) {
  if (session.mode !== "subscription") {
    console.log("Ignoring non-subscription checkout session", session.id);
    return;
  }

  // Only activate paid/complete sessions (async payment methods may be unpaid).
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    console.log(
      "Checkout session not paid yet; waiting",
      session.id,
      session.payment_status,
    );
    return;
  }

  const requestIdRaw =
    session.metadata?.featured_request_id ||
    session.client_reference_id ||
    "";
  const requestId = Number(requestIdRaw);
  if (!requestId) {
    console.error("Checkout completed without featured_request_id", session.id);
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  const result = await activateFeaturedFromCheckout(db, {
    requestId,
    stripeSessionId: session.id,
    stripeSubscriptionId: subscriptionId,
    stripeCustomerId: customerId,
    stripeSubscriptionStatus: "active",
  });

  if (!result) {
    console.error("featured_requests row not found for checkout", requestId);
    return;
  }

  const row = await db
    .prepare(
      `SELECT company_name, city, plan, contact_name, email, phone, company_slug, notes
       FROM featured_requests WHERE id = ? LIMIT 1`,
    )
    .bind(requestId)
    .first<{
      company_name: string;
      city: string;
      plan: string;
      contact_name: string;
      email: string;
      phone: string;
      company_slug: string | null;
      notes: string | null;
    }>();

  if (row) {
    await notifyOperator({
      ...formatFeaturedNotify({
        id: requestId,
        companyName: row.company_name,
        city: row.city,
        plan: row.plan,
        contactName: row.contact_name,
        email: row.email,
        phone: row.phone,
        companySlug: row.company_slug ?? undefined,
        notes: row.notes ?? undefined,
      }),
      subject: `Featured PAID (${result.status}): ${row.company_name} (${row.plan})`,
      text: [
        "Featured Checkout payment received",
        "",
        `Request ID: ${requestId}`,
        `Status: ${result.status}`,
        `Featured activated: ${result.featuredUpdated ? "yes" : "no"}`,
        result.companySlug
          ? `Company slug: ${result.companySlug}`
          : "No company_slug — link a listing in /admin/featured/ then mark won if needed",
        `Stripe session: ${session.id}`,
        subscriptionId ? `Subscription: ${subscriptionId}` : null,
        customerId ? `Customer: ${customerId}` : null,
        "",
        "Review: /admin/featured/ or npm run db:featured",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }
}

async function handleSubscriptionChange(
  db: D1Database,
  subscription: Stripe.Subscription,
  forceStatus: string | null,
  eventCreated: number,
) {
  const subscriptionId = subscription.id;
  if (!subscriptionId) {
    console.error("Subscription event missing id");
    return;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  const status = forceStatus || subscription.status || "canceled";
  const companySlugHint =
    subscription.metadata?.company_slug?.trim() || null;

  const result = await applySubscriptionStatusChange(db, {
    stripeSubscriptionId: subscriptionId,
    status,
    stripeCustomerId: customerId,
    companySlugHint,
    eventAt: eventCreated,
  });

  console.log(
    "Stripe subscription sync",
    subscriptionId,
    status,
    result.companySlug,
    result.transition,
    result.operatorNotify,
    result.featuredUpdated,
    result.skippedStale ? "stale-skipped" : null,
  );

  if (result.skippedStale || !result.companySlug || !result.operatorNotify) {
    return;
  }

  if (result.operatorNotify === "deactivated") {
    await notifyOperator({
      kind: "featured",
      subject: `Featured ended: ${result.companySlug} (${status})`,
      text: [
        "Featured subscription canceled or lapsed",
        "",
        `Company slug: ${result.companySlug}`,
        `Subscription: ${subscriptionId}`,
        customerId ? `Customer: ${customerId}` : null,
        `Prior status: ${result.priorStatus ?? "(none)"}`,
        `Status: ${status}`,
        "companies.featured cleared (no other won request).",
        "",
        "Review: /admin/featured/",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return;
  }

  if (result.operatorNotify === "reactivated") {
    await notifyOperator({
      kind: "featured",
      subject: `Featured reactivated: ${result.companySlug} (${status})`,
      text: [
        "Featured subscription active again",
        "",
        `Company slug: ${result.companySlug}`,
        `Subscription: ${subscriptionId}`,
        customerId ? `Customer: ${customerId}` : null,
        `Prior status: ${result.priorStatus ?? "(none)"}`,
        `Status: ${status}`,
        "companies.featured set to 1.",
        "",
        "Review: /admin/featured/",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return;
  }

  if (result.operatorNotify === "payment_issue") {
    await notifyOperator({
      kind: "featured",
      subject: `Featured payment issue: ${result.companySlug} (${status})`,
      text: [
        "Featured subscription payment failed (Stripe dunning)",
        "",
        `Company slug: ${result.companySlug}`,
        `Subscription: ${subscriptionId}`,
        customerId ? `Customer: ${customerId}` : null,
        `Prior status: ${result.priorStatus ?? "(none)"}`,
        `Status: ${status}`,
        "Featured placement kept during grace period (past_due).",
        "Owner can update the card via Manage billing on their manage page.",
        "",
        "Review: /admin/featured/",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }
}

// D1Database is global via workers types; import type alias for clarity in signature.
type D1Database = Awaited<ReturnType<typeof getDb>>;
