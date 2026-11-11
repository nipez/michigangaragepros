import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import { utcDay } from "@/lib/listing-stats";
import {
  buildCompanyDigest,
  digestWindowFor,
  formatWeeklyDigestNotify,
  listDigestRecipients,
  runWeeklyDigests,
} from "@/lib/weekly-digest";

export const runtime = "nodejs";

function asOfDayParam(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : utcDay();
}

/**
 * Admin weekly digest tools.
 *
 * GET  /api/admin/weekly-digest?slug=<slug>
 *   Preview the digest email for one company (no send, no send-row write).
 *
 * POST /api/admin/weekly-digest
 *   JSON body: { dryRun?: boolean, slug?: string, asOfDay?: string }
 *   - dryRun true (default): build digests without emailing or recording sends
 *   - dryRun false + slug: attempt a real send for that company (idempotent)
 *   - dryRun false without slug: refused (too dangerous for accidental use)
 */
export async function GET(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const asOfDay = asOfDayParam(url.searchParams.get("asOfDay"));

  try {
    const db = await getDb();
    const recipients = await listDigestRecipients(db, slug);
    const company = recipients[0];
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const window = digestWindowFor(asOfDay);
    const digest = await buildCompanyDigest(db, company, window);
    const email = formatWeeklyDigestNotify(digest);

    return NextResponse.json(
      {
        slug: company.slug,
        name: company.name,
        featured: company.featured,
        notifyEmail: company.notifyEmail || null,
        weeklyDigestOptOut: company.weeklyDigestOptOut,
        window,
        hasActivity: digest.hasActivity,
        stats: digest.stats,
        email,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("admin weekly-digest GET failed", err);
    return NextResponse.json(
      { error: "Unable to preview digest" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { dryRun?: unknown; slug?: unknown; asOfDay?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const dryRun = body.dryRun !== false; // default true
  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim()
      : undefined;
  const asOfDay = asOfDayParam(
    typeof body.asOfDay === "string" ? body.asOfDay : null,
  );

  if (!dryRun && !slug) {
    return NextResponse.json(
      {
        error:
          "Live sends require a slug. Use dryRun: true to preview all eligible companies, or pass slug with dryRun: false for one company.",
      },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const runEnv = {
      DB: db,
      RESEND_API_KEY: env.RESEND_API_KEY,
      NOTIFY_FROM_EMAIL: env.NOTIFY_FROM_EMAIL,
    };

    const result = await runWeeklyDigests(runEnv, {
      dryRun,
      slug,
      asOfDay,
      forcePreview: Boolean(slug),
    });

    return NextResponse.json(
      {
        dryRun,
        ...result,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("admin weekly-digest POST failed", err);
    return NextResponse.json(
      { error: "Unable to run digest" },
      { status: 500 },
    );
  }
}
