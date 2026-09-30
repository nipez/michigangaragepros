import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";

export const runtime = "nodejs";

/** Pipeline statuses for Featured interest + Stripe Checkout. */
const ALLOWED_STATUSES = new Set([
  "new",
  "contacted",
  "checkout_pending",
  "paid",
  "won",
  "closed",
]);

type FeaturedRow = {
  id: number;
  company_name: string;
  city: string;
  plan: string;
  contact_name: string;
  email: string;
  phone: string;
  company_slug: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  stripe_session_id: string | null;
  paid_at: string | null;
  company_featured: number | null;
  company_exists: number | null;
};

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT fr.id, fr.company_name, fr.city, fr.plan, fr.contact_name, fr.email,
              fr.phone, fr.company_slug, fr.notes, fr.status, fr.created_at,
              fr.stripe_session_id, fr.paid_at,
              c.featured AS company_featured,
              CASE WHEN c.slug IS NULL THEN 0 ELSE 1 END AS company_exists
       FROM featured_requests fr
       LEFT JOIN companies c ON c.slug = fr.company_slug
       ORDER BY datetime(fr.created_at) DESC
       LIMIT 200`,
    )
    .all<FeaturedRow>();

  return NextResponse.json({ requests: results ?? [] });
}

/**
 * Activation rule:
 * - status → `won` + resolvable company_slug → set companies.featured = 1
 * - leaving `won` (to new|contacted|closed) → set featured = 0 for that slug
 *   only if no other featured_request is still `won` for the same slug
 *   (this request was the sole remaining activator; do not blindly zero all featured)
 */
export async function PATCH(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: number; status?: string };
  try {
    body = (await request.json()) as { id?: number; status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = Number(body.id);
  const status = body.status?.trim();
  if (!id || !status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      {
        error: "id and status (new|contacted|checkout_pending|paid|won|closed) are required",
      },
      { status: 400 },
    );
  }

  const db = await getDb();
  const existing = await db
    .prepare(
      `SELECT id, company_slug, status FROM featured_requests WHERE id = ? LIMIT 1`,
    )
    .bind(id)
    .first<{ id: number; company_slug: string | null; status: string }>();

  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const slug = (existing.company_slug ?? "").trim();
  const wasWon = existing.status === "won";
  const becomingWon = status === "won";

  let companyExists = false;
  if (slug) {
    const company = await db
      .prepare(`SELECT slug FROM companies WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first<{ slug: string }>();
    companyExists = Boolean(company?.slug);
  }

  if (becomingWon) {
    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Cannot activate Featured: this request has no company_slug. Link a listing slug before marking won.",
        },
        { status: 400 },
      );
    }
    if (!companyExists) {
      return NextResponse.json(
        {
          error: `Cannot activate Featured: no company found for slug "${slug}".`,
        },
        { status: 400 },
      );
    }
  }

  const statements = [
    db
      .prepare(`UPDATE featured_requests SET status = ? WHERE id = ?`)
      .bind(status, id),
  ];

  let featuredUpdated: "activated" | "deactivated" | null = null;

  if (becomingWon && slug) {
    statements.push(
      db
        .prepare(`UPDATE companies SET featured = 1 WHERE slug = ?`)
        .bind(slug),
    );
    featuredUpdated = "activated";
  } else if (wasWon && !becomingWon && slug && companyExists) {
    // Clear placement only if this request was the sole remaining activator.
    const otherWon = await db
      .prepare(
        `SELECT id FROM featured_requests
         WHERE company_slug = ? AND status = 'won' AND id != ?
         LIMIT 1`,
      )
      .bind(slug, id)
      .first<{ id: number }>();

    if (!otherWon) {
      statements.push(
        db
          .prepare(`UPDATE companies SET featured = 0 WHERE slug = ?`)
          .bind(slug),
      );
      featuredUpdated = "deactivated";
    }
  }

  await db.batch(statements);

  return NextResponse.json({
    ok: true,
    id,
    status,
    company_slug: slug || null,
    featured_updated: featuredUpdated,
  });
}
