/* Manual Env bindings for Michigan Garage Pros.
 * For full workerd runtime types, run: npm run cf-typegen
 */
interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  /** Resend API key — set via `wrangler secret put RESEND_API_KEY` */
  RESEND_API_KEY?: string;
  /** Operator inbox for claim/lead alerts */
  NOTIFY_EMAIL?: string;
  /** Optional Slack/Discord/generic webhook */
  NOTIFY_WEBHOOK_URL?: string;
  /** Verified Resend from-address */
  NOTIFY_FROM_EMAIL?: string;
  /** Token for /admin/leads/, /admin/claims/, /admin/featured/, /admin/reviews/, /admin/listing-edits/ — set via `wrangler secret put ADMIN_TOKEN` */
  ADMIN_TOKEN?: string;
  /** Stripe secret key (sk_test_… / sk_live_… or rk_…) — `wrangler secret put STRIPE_SECRET_KEY` */
  STRIPE_SECRET_KEY?: string;
  /** Stripe webhook signing secret (whsec_…) — `wrangler secret put STRIPE_WEBHOOK_SECRET` */
  STRIPE_WEBHOOK_SECRET?: string;
  /**
   * Optional publishable key if a client Stripe.js path is added later.
   * Checkout Sessions redirect does not require it today.
   * Set via wrangler vars or `wrangler secret put NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   */
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends CloudflareEnv {}
}
