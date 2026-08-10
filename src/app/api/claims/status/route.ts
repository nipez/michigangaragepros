import { NextResponse } from "next/server";
import { getCompanyClaimStatus } from "@/lib/claimStatus";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const status = await getCompanyClaimStatus(slug);
  return NextResponse.json(
    { slug, status },
    {
      headers: {
        // Short cache so badges stay fresh after approvals without hammering D1.
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    },
  );
}
