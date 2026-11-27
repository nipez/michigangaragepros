import type { ClaimFunnelEvent } from "@/lib/claim-funnel";

/**
 * Browser-side first-party claim funnel beacon.
 * Privacy-light: event name only (no PII, no third-party).
 */
export function recordClaimFunnelEvent(event: ClaimFunnelEvent): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({ event });
  const url = "/api/stats/claim-funnel/";

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
