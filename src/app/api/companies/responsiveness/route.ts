import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getCompanyResponsiveness,
  publicResponsivenessBadge,
} from "@/lib/responsiveness";

export const runtime = "nodejs";

/**
 * Public responsiveness badge for a company profile.
 * Returns { badge: null } when unclaimed / low sample / no signal —
 * never negative copy. Lightweight so profile HTML stays static.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const claimed = await db
      .prepare(`SELECT claimed FROM companies WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first<{ claimed: number }>();

    if (!claimed || !claimed.claimed) {
      return NextResponse.json(
        { slug, badge: null },
        {
          headers: {
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        },
      );
    }

    const metrics = await getCompanyResponsiveness(db, slug);
    const badge = publicResponsivenessBadge(metrics);
    return NextResponse.json(
      {
        slug,
        badge: badge
          ? {
              label: badge.label,
              withinHours: badge.withinHours,
            }
          : null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    console.error("companies responsiveness GET failed", err);
    return NextResponse.json({ slug, badge: null });
  }
}
