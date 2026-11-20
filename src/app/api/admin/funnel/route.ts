import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import { loadQuoteFunnelReport } from "@/lib/quote-funnel";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const rawDays = Number(url.searchParams.get("days") || "30");
  const windowDays =
    Number.isFinite(rawDays) && rawDays > 0 && rawDays <= 365
      ? Math.floor(rawDays)
      : 30;

  try {
    const db = await getDb();
    const report = await loadQuoteFunnelReport(db, windowDays);
    return NextResponse.json(report);
  } catch (err) {
    console.error("admin funnel load failed", err);
    return NextResponse.json(
      { error: "Unable to load funnel stats" },
      { status: 500 },
    );
  }
}
