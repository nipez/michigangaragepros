/* Manual Env bindings for Michigan Garage Pros.
 * For full workerd runtime types, run: npm run cf-typegen
 */
interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  /** Resend API key for lead/claim email delivery */
  RESEND_API_KEY?: string;
  /** Inbox that receives new lead/claim alerts */
  LEAD_NOTIFY_TO?: string;
  /** Optional verified from address, e.g. "Michigan Garage Pros <leads@michigangaragepros.com>" */
  LEAD_NOTIFY_FROM?: string;
  /** Shared secret for /admin/leads access */
  ADMIN_TOKEN?: string;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends CloudflareEnv {}
}
