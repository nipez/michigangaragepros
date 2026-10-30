import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCompanyByManageToken } from "@/lib/listing-manage";
import { getListingPerformance } from "@/lib/listing-stats";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const featuredRow = await db
      .prepare(`SELECT featured FROM companies WHERE slug = ? LIMIT 1`)
      .bind(company.slug)
      .first<{ featured: number }>();

    const performance = await getListingPerformance(db, company.slug);

    return NextResponse.json(
      {
        slug: company.slug,
        name: company.name,
        featured: Boolean(featuredRow?.featured),
        performance,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (err) {
    console.error("manage stats GET failed", err);
    return NextResponse.json(
      { error: "Unable to load performance" },
      { status: 500 },
    );
  }
}
