import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getLiveListingFields } from "@/lib/listing-manage";

export const runtime = "nodejs";

/**
 * Public live listing fields for a company profile.
 * Returns fields only when an admin-approved edit has been applied
 * (companies.listing_updated_at is set); otherwise { fields: null }.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const fields = await getLiveListingFields(db, slug);
    return NextResponse.json(
      { slug, fields },
      {
        headers: {
          "Cache-Control": "private, max-age=30, must-revalidate",
        },
      },
    );
  } catch {
    return NextResponse.json({ slug, fields: null });
  }
}
