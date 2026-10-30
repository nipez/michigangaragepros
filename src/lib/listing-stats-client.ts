/**
 * Browser-side first-party listing event beacon.
 * Uses sendBeacon when available; falls back to keepalive fetch.
 * Never throws; never awaits on the critical path for callers that fire-and-forget.
 */

export type ClientListingEvent = "profile_view" | "contact_click";

export function recordListingEvent(
  companySlug: string,
  event: ClientListingEvent,
): void {
  const slug = companySlug.trim();
  if (!slug || typeof window === "undefined") return;

  const body = JSON.stringify({ slug, event });
  const url = "/api/stats/event/";

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
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
