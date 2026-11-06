import { NextResponse } from "next/server";
import {
  getCompanyMedia,
  getCompanyMediaBySlugs,
} from "@/lib/company-media";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

function parseSlugs(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100);
}

/**
 * Public company media.
 * - ?slug=acme → { slug, logoUrl, photoUrl }
 * - ?slugs=a,b,c → { media: { a: { logoUrl, photoUrl }, … } } (only companies with media)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  const slugs = parseSlugs(searchParams.get("slugs"));

  try {
    const db = await getDb();

    if (slugs.length > 0) {
      const media = await getCompanyMediaBySlugs(db, slugs);
      const compact: Record<
        string,
        { logoUrl: string | null; photoUrl: string | null }
      > = {};
      for (const [s, m] of Object.entries(media)) {
        compact[s] = { logoUrl: m.logoUrl, photoUrl: m.photoUrl };
      }
      return NextResponse.json(
        { media: compact },
        {
          headers: {
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug or slugs" },
        { status: 400 },
      );
    }

    const media = await getCompanyMedia(db, slug);
    return NextResponse.json(
      {
        slug,
        logoUrl: media.logoUrl,
        photoUrl: media.photoUrl,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    if (slugs.length > 0) {
      return NextResponse.json({ media: {} });
    }
    return NextResponse.json({
      slug,
      logoUrl: null,
      photoUrl: null,
    });
  }
}
