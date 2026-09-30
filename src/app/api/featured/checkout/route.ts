import { NextResponse } from "next/server";
import { getDb, getEnv } from "@/lib/db";
import {
  validateFeaturedInterest,
  type FeaturedInterest,
} from "@/lib/featured";
import {
  buildCheckoutMetadata,
  checkoutBaseUrl,
  featuredCheckoutCancelUrl,
  featuredCheckoutSuccessUrl,
  getFeaturedPlan,
  getStripeFromEnv,
  isFeaturedPlanId,
} from "@/lib/stripe";
import { notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Create a Stripe Checkout Session (subscription) for a Featured plan.
 * Inserts featured_requests with status=checkout_pending, then redirects buyer to Stripe.
 */
export async function POST(request: Request) {
  let body: Partial<FeaturedInterest>;
  try {
    body = (await request.json()) as Partial<FeaturedInterest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const interest: FeaturedInterest = {
    companyName: body.companyName?.trim() ?? "",
    city: body.city?.trim() ?? "",
    plan: body.plan?.trim() ?? "",
    contactName: body.contactName?.trim() ?? "",
    email: body.email?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    companySlug: body.companySlug?.trim() ?? "",
    notes: body.notes?.trim() ?? "",
  };

  const error = validateFeaturedInterest(interest);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  if (!isFeaturedPlanId(interest.plan)) {
    return NextResponse.json({ error: "Unknown Featured plan" }, { status: 400 });
  }

  const plan = getFeaturedPlan(interest.plan);
  if (!plan) {
    return NextResponse.json({ error: "Unknown Featured plan" }, { status: 400 });
  }

  const env = await getEnv();
  const stripe = await getStripeFromEnv(env);
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Online checkout is not configured yet. Use “Talk to us” and we’ll follow up.",
      },
      { status: 503 },
    );
  }

  try {
    const db = await getDb();
    const insert = await db
      .prepare(
        `INSERT INTO featured_requests (
           company_name, city, plan, contact_name, email, phone, company_slug, notes, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'checkout_pending')`,
      )
      .bind(
        interest.companyName,
        interest.city,
        interest.plan,
        interest.contactName,
        interest.email,
        interest.phone,
        interest.companySlug || null,
        interest.notes || null,
      )
      .run();

    const requestId = Number(insert.meta.last_row_id);
    if (!requestId) {
      throw new Error("Missing featured_requests id after insert");
    }

    const baseUrl = checkoutBaseUrl(request);
    const metadata = buildCheckoutMetadata({
      requestId,
      plan: interest.plan,
      companySlug: interest.companySlug,
      companyName: interest.companyName,
      city: interest.city,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: interest.email,
      client_reference_id: String(requestId),
      integration_identifier: `mgp-featured-${interest.plan}-checkout`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: plan.priceMonthly * 100,
            recurring: { interval: "month" },
            product_data: {
              name: `Michigan Garage Pros — ${plan.name}`,
              description: plan.blurb,
              metadata: {
                plan: plan.id,
              },
            },
          },
        },
      ],
      success_url: featuredCheckoutSuccessUrl(baseUrl),
      cancel_url: featuredCheckoutCancelUrl(baseUrl),
      metadata,
      subscription_data: {
        metadata,
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout URL" },
        { status: 502 },
      );
    }

    await db
      .prepare(
        `UPDATE featured_requests SET stripe_session_id = ? WHERE id = ?`,
      )
      .bind(session.id, requestId)
      .run();

    await notifyOperator({
      kind: "featured",
      subject: `Featured checkout started: ${interest.companyName} (${interest.plan})`,
      text: [
        "Featured Checkout Session created",
        "",
        `ID: ${requestId}`,
        `Company: ${interest.companyName}`,
        `City / market: ${interest.city}`,
        `Plan: ${plan.name} ($${plan.priceMonthly}/mo)`,
        `Contact: ${interest.contactName}`,
        `Email: ${interest.email}`,
        `Phone: ${interest.phone}`,
        interest.companySlug ? `Listing slug: ${interest.companySlug}` : null,
        `Stripe session: ${session.id}`,
        "",
        "Waiting for checkout.session.completed webhook to activate Featured.",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({
      ok: true,
      id: requestId,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("featured checkout create failed", err);
    return NextResponse.json(
      { error: "Unable to start checkout right now" },
      { status: 500 },
    );
  }
}
