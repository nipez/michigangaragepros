import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import { getListingPerformance } from "@/lib/listing-stats";

export const runtime = "nodejs";

/**
 * Admin listing performance for a company slug.
 * GET /api/admin/listing-stats?slug=<company-slug>
 */
export async function GET(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await db
      .prepare(
        `SELECT slug, name, featured, claimed FROM companies WHERE slug = ? LIMIT 1`,
      )
      .bind(slug)
      .first<{
        slug: string;
        name: string;
        featured: number;
        claimed: number;
      }>();

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const performance = await getListingPerformance(db, company.slug);

    return NextResponse.json({
      slug: company.slug,
      name: company.name,
      featured: Boolean(company.featured),
      claimed: Boolean(company.claimed),
      performance,
    });
  } catch (err) {
    console.error("admin listing-stats GET failed", err);
    return NextResponse.json(
      { error: "Unable to load performance" },
      { status: 500 },
    );
  }
}
