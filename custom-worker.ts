/**
 * Cloudflare Workers entrypoint (see wrangler.jsonc `main`).
 *
 * OpenNext's generated `.open-next/worker.js` only exports `fetch`. Cron
 * triggers need a `scheduled` handler alongside it, so this wrapper re-uses
 * the generated fetch handler and runs the weekly digest job.
 *
 * @see https://opennext.js.org/cloudflare/howtos/custom-worker
 */

// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { runWeeklyDigests } from "./src/lib/weekly-digest";

export default {
  fetch: handler.fetch,

  async scheduled(
    _controller: ScheduledController,
    env: CloudflareEnv,
    ctx: ExecutionContext,
  ): Promise<void> {
    // Never let digest work crash the scheduled invocation or affect fetch.
    ctx.waitUntil(
      (async () => {
        try {
          if (!env.DB) {
            console.warn("weekly-digest cron: DB binding missing; skipping");
            return;
          }
          await runWeeklyDigests(env);
        } catch (err) {
          console.error("weekly-digest cron unexpected error", err);
        }
      })(),
    );
  },
} satisfies ExportedHandler<CloudflareEnv>;
