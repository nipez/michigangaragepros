import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  bumpListingStat,
  isLikelyBot,
  type ListingStatMetric,
} from "@/lib/listing-stats";

export const runtime = "nodejs";

const EVENT_TO_METRIC: Record<string, ListingStatMetric> = {
  profile_view: "profile_views",
  contact_click: "contact_clicks",
};

/**
 * Public first-party counter endpoint.
 * Always returns 204 (fail open) so tracking never breaks page UX.
 */
export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent");
    if (isLikelyBot(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    let body: { slug?: string; event?: string };
    try {
      body = (await request.json()) as { slug?: string; event?: string };
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const event = typeof body.event === "string" ? body.event.trim() : "";
    const metric = EVENT_TO_METRIC[event];
    if (!slug || slug.length > 120 || !metric) {
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

    // Confirm the slug exists so we don't accumulate junk rows.
    const company = await db
      .prepare(`SELECT slug FROM companies WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first<{ slug: string }>();
    if (!company) {
      return new NextResponse(null, { status: 204 });
    }

    await bumpListingStat(db, slug, metric);
  } catch (err) {
    console.error("stats event failed", err);
  }

  return new NextResponse(null, { status: 204 });
}
