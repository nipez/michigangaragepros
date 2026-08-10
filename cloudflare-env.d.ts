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
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends CloudflareEnv {}
}
