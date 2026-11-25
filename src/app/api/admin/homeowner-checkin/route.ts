import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import {
  loadHomeownerCheckinStats,
  runHomeownerCheckins,
} from "@/lib/homeowner-checkin";

export const runtime = "nodejs";

/**
 * Admin homeowner check-in tools.
 *
 * GET  /api/admin/homeowner-checkin?days=30
 *   Funnel counts for the admin strip.
 *
 * POST /api/admin/homeowner-checkin
 *   JSON body: { dryRun?: boolean, limit?: number, hours?: number }
 *   - dryRun true (default): scan + report without writing / emailing
 *   - dryRun false: run the same job as the hourly cron (idempotent)
 */
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
    const stats = await loadHomeownerCheckinStats(db, windowDays);
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (err) {
    console.error("admin homeowner-checkin GET failed", err);
    return NextResponse.json(
      { error: "Unable to load check-in stats" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { dryRun?: unknown; limit?: unknown; hours?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const dryRun = body.dryRun !== false; // default true
  const limit =
    typeof body.limit === "number" && Number.isFinite(body.limit)
      ? Math.floor(body.limit)
      : undefined;
  const hours =
    typeof body.hours === "number" && Number.isFinite(body.hours)
      ? Math.floor(body.hours)
      : undefined;

  try {
    const db = await getDb();
    const runEnv = {
      DB: db,
      RESEND_API_KEY: env.RESEND_API_KEY,
      NOTIFY_FROM_EMAIL: env.NOTIFY_FROM_EMAIL,
      ADMIN_TOKEN: env.ADMIN_TOKEN,
      CHECKIN_SIGNING_SECRET: env.CHECKIN_SIGNING_SECRET,
    };

    const result = await runHomeownerCheckins(runEnv, {
      dryRun,
      limit,
      hours,
    });

    return NextResponse.json(
      {
        dryRun,
        ...result,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("admin homeowner-checkin POST failed", err);
    return NextResponse.json(
      { error: "Unable to run homeowner check-in" },
      { status: 500 },
    );
  }
}
