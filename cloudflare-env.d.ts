/* Manual Env bindings for Michigan Garage Pros.
 * For full workerd runtime types, run: npm run cf-typegen
 */
interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends CloudflareEnv {}
}
