import { NextResponse } from "next/server";
import {
  emptyCompanyTrust,
  getCompanyTrust,
  getCompanyTrustBySlugs,
  trustHasAny,
  type CompanyTrust,
} from "@/lib/company-trust";
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

function publicTrust(trust: CompanyTrust): CompanyTrust {
  // Do not expose updatedAt on public endpoints.
  return { ...trust, updatedAt: null };
}

/**
 * Public company trust credentials (self-reported).
 * - ?slug=acme → { slug, trust }
 * - ?slugs=a,b,c → { trust: { a: {...}, … } } (only companies with any credential)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  const slugs = parseSlugs(searchParams.get("slugs"));

  try {
    const db = await getDb();

    if (slugs.length > 0) {
      const bySlug = await getCompanyTrustBySlugs(db, slugs);
      const compact: Record<string, CompanyTrust> = {};
      for (const [s, t] of Object.entries(bySlug)) {
        if (trustHasAny(t)) compact[s] = publicTrust(t);
      }
      return NextResponse.json(
        { trust: compact },
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

    const trust = await getCompanyTrust(db, slug);
    return NextResponse.json(
      {
        slug,
        trust: publicTrust(trust),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    if (slugs.length > 0) {
      return NextResponse.json({ trust: {} });
    }
    return NextResponse.json({
      slug,
      trust: emptyCompanyTrust(),
    });
  }
}
