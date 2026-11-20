import type { QuoteFunnelEvent } from "@/lib/quote-funnel";
import {
  normalizeQuoteSourcePage,
  type QuoteSourcePage,
} from "@/lib/quote-links";

/**
 * Browser-side first-party quote funnel beacon.
 * Privacy-light: event + source page type only (no PII, no third-party).
 */
export function recordQuoteFunnelEvent(
  event: QuoteFunnelEvent,
  sourcePage: QuoteSourcePage | string = "other",
): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    event,
    source: normalizeQuoteSourcePage(sourcePage),
  });
  const url = "/api/stats/quote-funnel/";

  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    /* fall through */
  }

  try {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {
      /* fail open */
    });
  } catch {
    /* fail open */
  }
}
