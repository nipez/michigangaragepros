import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getDb, getEnv } from "@/lib/db";
import { activateFeaturedFromCheckout } from "@/lib/featured-activate";
import { formatFeaturedNotify, notifyOperator } from "@/lib/notify";
import { createStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook for Featured subscriptions.
 * Primary event: checkout.session.completed → mark paid/won + set companies.featured.
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
    }
    // Future: customer.subscription.deleted → clear featured. Out of scope for v1.

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
        "",
        "Review: /admin/featured/ or npm run db:featured",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }
}

// D1Database is global via workers types; import type alias for clarity in signature.
type D1Database = Awaited<ReturnType<typeof getDb>>;
