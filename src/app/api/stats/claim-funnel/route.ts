import { NextResponse } from "next/server";
import { bumpClaimFunnel, isClaimFunnelEvent } from "@/lib/claim-funnel";
import { getDb } from "@/lib/db";
import { isLikelyBot } from "@/lib/listing-stats";

export const runtime = "nodejs";

/**
 * Public first-party claim funnel counter.
 * Always returns 204 (fail open). No PII accepted.
 */
export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent");
    if (isLikelyBot(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    let body: { event?: string };
    try {
      body = (await request.json()) as { event?: string };
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const event = typeof body.event === "string" ? body.event.trim() : "";
    if (!isClaimFunnelEvent(event)) {
      return new NextResponse(null, { status: 204 });
    }

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
    await bumpClaimFunnel(db, event);
  } catch (err) {
    console.error("claim funnel event failed", err);
  }

  return new NextResponse(null, { status: 204 });
}
