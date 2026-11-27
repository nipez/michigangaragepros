import { NextResponse } from "next/server";
import { searchCompaniesForClaim } from "@/lib/company-claim-search";

export const runtime = "nodejs";

/**
 * Public company name/city search for the for-companies claim finder.
 * Returns slim hits only (no phone/email/about).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const city = (url.searchParams.get("city") ?? "").trim();

  if (!q && !city) {
    return NextResponse.json(
      { results: [] as ReturnType<typeof searchCompaniesForClaim> },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  }

  if (q.length > 80 || city.length > 80) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const results = searchCompaniesForClaim(q, city);
  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
