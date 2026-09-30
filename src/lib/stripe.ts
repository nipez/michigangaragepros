import Stripe from "stripe";
import { FEATURED_PLANS, type FeaturedPlan, type FeaturedPlanId } from "@/data/growth";
import { SITE_URL } from "@/data/site";
import { getEnv, type AppEnv } from "@/lib/db";

/** Prefer fetch HTTP client on Cloudflare Workers / OpenNext. */
export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
    typescript: true,
  });
}

export async function getStripeFromEnv(
  env?: AppEnv,
): Promise<Stripe | null> {
  const resolved = env ?? (await getEnv());
  const key = resolved.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return createStripeClient(key);
}

export function getFeaturedPlan(planId: string): FeaturedPlan | null {
  return FEATURED_PLANS.find((p) => p.id === planId) ?? null;
}

export function isFeaturedPlanId(value: string): value is FeaturedPlanId {
  return FEATURED_PLANS.some((p) => p.id === value);
}

/** Public site origin for Checkout return URLs. */
export function checkoutBaseUrl(request?: Request): string {
  const fromEnv =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL?.trim()
      : undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (request) {
    try {
      const url = new URL(request.url);
      const host = request.headers.get("host") ?? url.host;
      if (
        host &&
        !host.includes("localhost") &&
        !host.endsWith(".workers.dev")
      ) {
        return `https://${host.split(":")[0]}`;
      }
    } catch {
      // fall through
    }
  }

  return SITE_URL;
}

export function featuredCheckoutSuccessUrl(baseUrl: string): string {
  return `${baseUrl}/for-companies/featured/success/?session_id={CHECKOUT_SESSION_ID}`;
}

export function featuredCheckoutCancelUrl(baseUrl: string): string {
  return `${baseUrl}/for-companies/featured/cancel/`;
}

export type FeaturedCheckoutMetadata = {
  featured_request_id: string;
  plan: FeaturedPlanId;
  company_slug: string;
  company_name: string;
  city: string;
};

export function buildCheckoutMetadata(input: {
  requestId: number | string;
  plan: FeaturedPlanId;
  companySlug: string;
  companyName: string;
  city: string;
}): FeaturedCheckoutMetadata {
  return {
    featured_request_id: String(input.requestId),
    plan: input.plan,
    company_slug: input.companySlug.slice(0, 500),
    company_name: input.companyName.slice(0, 500),
    city: input.city.slice(0, 500),
  };
}
