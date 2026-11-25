/**
 * Cloudflare Workers entrypoint (see wrangler.jsonc `main`).
 *
 * OpenNext's generated `.open-next/worker.js` only exports `fetch`. Cron
 * triggers need a `scheduled` handler alongside it, so this wrapper re-uses
 * the generated fetch handler and runs scheduled jobs (weekly digest +
 * unanswered lead fallback + homeowner check-in).
 *
 * @see https://opennext.js.org/cloudflare/howtos/custom-worker
 */

// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import {
  HOMEOWNER_CHECKIN_CRON,
  runHomeownerCheckins,
} from "./src/lib/homeowner-checkin";
import {
  UNANSWERED_LEAD_FALLBACK_CRON,
  runUnansweredLeadFallback,
} from "./src/lib/lead-fallback";
import {
  WEEKLY_DIGEST_CRON,
  runWeeklyDigests,
} from "./src/lib/weekly-digest";

export default {
  fetch: handler.fetch,

  async scheduled(
    controller: ScheduledController,
    env: CloudflareEnv,
    ctx: ExecutionContext,
  ): Promise<void> {
    const cron = controller.cron;

    // Never let scheduled work crash the invocation or affect fetch.
    ctx.waitUntil(
      (async () => {
        try {
          if (!env.DB) {
            console.warn("scheduled cron: DB binding missing; skipping", cron);
            return;
          }

          if (cron === WEEKLY_DIGEST_CRON) {
            await runWeeklyDigests(env);
            return;
          }

          // Hourly trigger shared by unanswered-fallback + homeowner check-in.
          if (
            cron === UNANSWERED_LEAD_FALLBACK_CRON ||
            cron === HOMEOWNER_CHECKIN_CRON
          ) {
            await runUnansweredLeadFallback(env);
            await runHomeownerCheckins(env);
            return;
          }

          // Unknown cron expression — run neither job blindly.
          console.warn("scheduled cron: unrecognized expression", cron);
        } catch (err) {
          console.error("scheduled cron unexpected error", cron, err);
        }
      })(),
    );
  },
} satisfies ExportedHandler<CloudflareEnv>;
