import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set(["new", "pending", "approved", "rejected"]);

type ClaimRow = {
  id: number;
  company_name: string;
  city: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  company_slug: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
};

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT id, company_name, city, contact_name, email, phone, website,
              company_slug, notes, status, created_at, reviewed_at, review_notes
       FROM claim_requests
       ORDER BY datetime(created_at) DESC
       LIMIT 200`,
    )
    .all<ClaimRow>();

  return NextResponse.json({ claims: results ?? [] });
}

export async function PATCH(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: number; status?: string; review_notes?: string | null };
  try {
    body = (await request.json()) as {
      id?: number;
      status?: string;
      review_notes?: string | null;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = Number(body.id);
  const status = body.status?.trim();
  if (!id || !status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      {
        error:
          "id and status (new|pending|approved|rejected) are required",
      },
      { status: 400 },
    );
  }

  const reviewNotes =
    typeof body.review_notes === "string"
      ? body.review_notes.trim() || null
      : body.review_notes === null
        ? null
        : undefined;

  const db = await getDb();
  const existing = await db
    .prepare(
      `SELECT id, company_slug, email, status FROM claim_requests WHERE id = ? LIMIT 1`,
    )
    .bind(id)
    .first<{
      id: number;
      company_slug: string | null;
      email: string | null;
      status: string;
    }>();

  if (!existing) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  const setReviewed =
    status === "approved" || status === "rejected";
  const slug = (existing.company_slug ?? "").trim();
  const claimEmail = (existing.email ?? "").trim();

  const statements = [];

  if (reviewNotes !== undefined) {
    statements.push(
      db
        .prepare(
          setReviewed
            ? `UPDATE claim_requests
               SET status = ?, reviewed_at = datetime('now'), review_notes = ?
               WHERE id = ?`
            : `UPDATE claim_requests
               SET status = ?, reviewed_at = NULL, review_notes = ?
               WHERE id = ?`,
        )
        .bind(status, reviewNotes, id),
    );
  } else {
    statements.push(
      db
        .prepare(
          setReviewed
            ? `UPDATE claim_requests
               SET status = ?, reviewed_at = datetime('now')
               WHERE id = ?`
            : `UPDATE claim_requests
               SET status = ?, reviewed_at = NULL
               WHERE id = ?`,
        )
        .bind(status, id),
    );
  }

  // Same side effect as scripts/approve-claim.mjs: mark the company claimed
  // and stash the claim contact as companies.notify_email for lead routing.
  // Reject (and other statuses) must not flip companies.claimed.
  if (status === "approved" && slug) {
    if (claimEmail) {
      statements.push(
        db
          .prepare(
            `UPDATE companies
             SET claimed = 1, notify_email = ?
             WHERE slug = ?`,
          )
          .bind(claimEmail, slug),
      );
    } else {
      statements.push(
        db
          .prepare(`UPDATE companies SET claimed = 1 WHERE slug = ?`)
          .bind(slug),
      );
    }
  }

  await db.batch(statements);

  return NextResponse.json({
    ok: true,
    id,
    status,
    company_slug: slug || null,
    claimed_updated: status === "approved" && Boolean(slug),
  });
}
