import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  emptyListingDemand,
  formatClaimDemandCopy,
  getListingDemand,
} from "@/lib/listing-demand";

export const runtime = "nodejs";

/**
 * Public, cacheable 30-day demand snapshot for unclaimed-listing claim CTAs.
 * Counts only — no PII. Softened copy helpers run client-side too; we return
 * both raw totals and preformatted owner copy so the profile page stays light.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const demand = await getListingDemand(db, slug);
    const copy = formatClaimDemandCopy(demand);

    return NextResponse.json(
      {
        slug,
        windowStart: demand.windowStart,
        windowEnd: demand.windowEnd,
        profileViews: demand.profileViews,
        contactClicks: demand.contactClicks,
        quoteRequests: demand.quoteRequests,
        copy: {
          body: copy.body,
          hasSignal: copy.hasSignal,
        },
      },
      {
        headers: {
          // CDN-friendly: demand is aggregate and slightly stale is fine.
          "Cache-Control":
            "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch (err) {
    console.error("listing demand failed", slug, err);
    const fallback = emptyListingDemand(slug);
    const copy = formatClaimDemandCopy(fallback);
    return NextResponse.json(
      {
        slug,
        windowStart: fallback.windowStart,
        windowEnd: fallback.windowEnd,
        profileViews: 0,
        contactClicks: 0,
        quoteRequests: 0,
        copy: { body: copy.body, hasSignal: false },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60",
        },
      },
    );
  }
}
