import { NextResponse } from "next/server";
import { getDb, getEnv } from "@/lib/db";
import {
  clientIpFromRequest,
  formatSubscriptionStatus,
  getCompanyBillingInfo,
  hashBillingPortalIp,
  isBillingPortalRateLimited,
  manageBillingReturnUrl,
  recordBillingPortalAttempt,
  syncCompanyStripeBilling,
} from "@/lib/featured-billing";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
} from "@/lib/listing-manage";
import {
  checkoutBaseUrl,
  getStripeFromEnv,
} from "@/lib/stripe";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Featured billing for claimed companies (manage-token auth).
 *
 * GET  — plan + subscription status + whether portal is available
 * POST — create a Stripe Customer Portal session; returns { url }
 *
 * Rate-limited per company + IP (migration 0024). Returns 503 when Stripe
 * secrets are missing (same pattern as Featured Checkout).
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const env = await getEnv();
    const stripeConfigured = Boolean(env.STRIPE_SECRET_KEY?.trim());
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const featuredRow = await db
      .prepare(`SELECT featured FROM companies WHERE slug = ? LIMIT 1`)
      .bind(company.slug)
      .first<{ featured: number }>();

    let billing;
    try {
      billing = await getCompanyBillingInfo(db, company.slug);
    } catch (err) {
      // Migration 0024 may not be applied yet — never crash the manage page.
      console.error("manage billing GET load failed", err);
      billing = {
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: null,
        planId: null,
        planName: null,
        planPriceMonthly: null,
        canManageBilling: false,
      };
    }

    return NextResponse.json(
      {
        slug: company.slug,
        featured: Boolean(featuredRow?.featured),
        stripeConfigured,
        planId: billing.planId,
        planName: billing.planName,
        planPriceMonthly: billing.planPriceMonthly,
        subscriptionStatus: billing.stripeSubscriptionStatus,
        subscriptionStatusLabel: formatSubscriptionStatus(
          billing.stripeSubscriptionStatus,
        ),
        canManageBilling:
          stripeConfigured && billing.canManageBilling,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("manage billing GET failed", err);
    return NextResponse.json(
      { error: "Unable to load billing" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const env = await getEnv();
    const stripe = await getStripeFromEnv(env);
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            "Billing self-serve is not configured yet. Email us and we’ll help.",
        },
        { status: 503 },
      );
    }

    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let billing;
    try {
      billing = await getCompanyBillingInfo(db, company.slug);
    } catch (err) {
      console.error("manage billing POST load failed", err);
      return NextResponse.json(
        {
          error:
            "Billing self-serve is not available yet. Ask the operator to run migration 0024.",
        },
        { status: 503 },
      );
    }

    if (!billing.stripeCustomerId) {
      return NextResponse.json(
        {
          error:
            "No Stripe customer is linked to this listing yet. Complete Featured checkout first, or ask us to help.",
        },
        { status: 400 },
      );
    }

    const ip = clientIpFromRequest(request);
    const ipHash = await hashBillingPortalIp(ip);

    let rateLimited = false;
    try {
      rateLimited = await isBillingPortalRateLimited(
        db,
        company.slug,
        ipHash,
      );
    } catch (err) {
      console.error("manage billing rate-limit check failed", err);
      return NextResponse.json(
        {
          error:
            "Billing self-serve is not available yet. Ask the operator to run migration 0024.",
        },
        { status: 503 },
      );
    }

    if (rateLimited) {
      try {
        await recordBillingPortalAttempt(db, {
          companySlug: company.slug,
          ipHash,
          created: false,
        });
      } catch (err) {
        console.error("manage billing rate-limit record failed", err);
      }
      return NextResponse.json(
        {
          error:
            "Too many billing portal requests. Try again in about an hour.",
        },
        { status: 429 },
      );
    }

    const baseUrl = checkoutBaseUrl(request);
    const returnUrl = manageBillingReturnUrl(baseUrl, token);

    const session = await stripe.billingPortal.sessions.create({
      customer: billing.stripeCustomerId,
      return_url: returnUrl,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a billing portal URL" },
        { status: 502 },
      );
    }

    // Best-effort: mirror customer id onto the company row for next time.
    try {
      await syncCompanyStripeBilling(db, {
        companySlug: company.slug,
        stripeCustomerId: billing.stripeCustomerId,
        stripeSubscriptionId: billing.stripeSubscriptionId,
        stripeSubscriptionStatus: billing.stripeSubscriptionStatus,
        featured: null,
      });
    } catch (err) {
      console.error("manage billing company mirror failed", err);
    }

    try {
      await recordBillingPortalAttempt(db, {
        companySlug: company.slug,
        ipHash,
        created: true,
      });
    } catch (err) {
      console.error("manage billing attempt record failed", err);
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (err) {
    console.error("manage billing POST failed", err);
    return NextResponse.json(
      { error: "Unable to open billing portal right now" },
      { status: 500 },
    );
  }
}
