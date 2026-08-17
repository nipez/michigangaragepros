type GrowthEvent =
  | "quote_started"
  | "quote_submitted"
  | "claim_submitted"
  | "featured_interest"
  | "pros_search"
  | "city_browse";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Lightweight growth scoreboard hook.
 * Forwards to dataLayer / gtag when present; always logs in development.
 */
export function trackGrowth(
  event: GrowthEvent,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  const payload = { event, ...props, ts: Date.now() };

  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", event, props);
    }
  } catch {
    // ignore analytics failures
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[growth]", payload);
  }
}
