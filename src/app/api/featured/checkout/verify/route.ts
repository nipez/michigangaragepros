import { NextResponse } from "next/server";
import { getDb, getEnv } from "@/lib/db";
import {
  activateFeaturedFromCheckout,
  findFeaturedRequestBySession,
} from "@/lib/featured-activate";
import { getStripeFromEnv } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Verified success path: confirm Checkout Session with Stripe and ensure
 * featured_requests / companies.featured are updated even if the webhook is delayed.
 * Idempotent with the webhook handler.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim() ?? "";
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const env = await getEnv();
  const stripe = await getStripeFromEnv(env);
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.mode !== "subscription") {
      return NextResponse.json({ error: "Unexpected session mode" }, { status: 400 });
    }

    const requestId = Number(
      session.metadata?.featured_request_id ||
        session.client_reference_id ||
        "",
    );

    const db = await getDb();

    // Prefer metadata id; fall back to session lookup.
    let resolvedId = requestId;
    if (!resolvedId) {
      const bySession = await findFeaturedRequestBySession(db, sessionId);
      resolvedId = bySession?.id ?? 0;
    }

    if (!resolvedId) {
      return NextResponse.json(
        { error: "No Featured request for this session" },
        { status: 404 },
      );
    }

    if (
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required"
    ) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null;

      const result = await activateFeaturedFromCheckout(db, {
        requestId: resolvedId,
        stripeSessionId: session.id,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
      });

      return NextResponse.json({
        ok: true,
        id: resolvedId,
        payment_status: session.payment_status,
        status: result?.status ?? null,
        featured_updated: result?.featuredUpdated ?? false,
        company_slug: result?.companySlug ?? null,
      });
    }

    return NextResponse.json({
      ok: true,
      id: resolvedId,
      payment_status: session.payment_status,
      status: "checkout_pending",
      featured_updated: false,
    });
  } catch (err) {
    console.error("featured checkout verify failed", err);
    return NextResponse.json(
      { error: "Unable to verify checkout session" },
      { status: 500 },
    );
  }
}
