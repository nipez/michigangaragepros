import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isLikelyBot } from "@/lib/listing-stats";
import {
  bumpQuoteFunnel,
  isQuoteFunnelEvent,
} from "@/lib/quote-funnel";
import { normalizeQuoteSourcePage } from "@/lib/quote-links";

export const runtime = "nodejs";

/**
 * Public first-party quote funnel counter.
 * Always returns 204 (fail open). No PII accepted.
 */
export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent");
    if (isLikelyBot(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    let body: { event?: string; source?: string };
    try {
      body = (await request.json()) as { event?: string; source?: string };
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const event = typeof body.event === "string" ? body.event.trim() : "";
    if (!isQuoteFunnelEvent(event)) {
      return new NextResponse(null, { status: 204 });
    }

    const source = normalizeQuoteSourcePage(
      typeof body.source === "string" ? body.source : "other",
    );

    // Soft origin check: prefer same-site referers; allow missing (sendBeacon).
    const referer = request.headers.get("referer") ?? "";
    if (referer) {
      try {
        const host = new URL(referer).hostname.toLowerCase();
        const ok =
          host === "michigangaragepros.com" ||
          host.endsWith(".michigangaragepros.com") ||
          host === "localhost" ||
          host.endsWith(".workers.dev") ||
          host.endsWith(".pages.dev");
        if (!ok) {
          return new NextResponse(null, { status: 204 });
        }
      } catch {
        return new NextResponse(null, { status: 204 });
      }
    }

    const db = await getDb();
    await bumpQuoteFunnel(db, event, source);
  } catch (err) {
    console.error("quote funnel event failed", err);
  }

  return new NextResponse(null, { status: 204 });
}
