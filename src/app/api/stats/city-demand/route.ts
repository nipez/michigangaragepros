import { NextResponse } from "next/server";
import { getTopCityDemand } from "@/lib/city-demand";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Public city-level demand aggregates for the for-companies page.
 * No homeowner PII — counts only, thresholded in getTopCityDemand.
 */
export async function GET() {
  try {
    const db = await getDb();
    const report = await getTopCityDemand(db, { limit: 8 });
    return NextResponse.json(report, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
      },
    });
  } catch (err) {
    console.error("city demand load failed", err);
    return NextResponse.json(
      {
        windowDays: 30,
        windowStart: "",
        windowEnd: "",
        cities: [],
      },
      { status: 200 },
    );
  }
}
