import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import {
  applyListingFields,
  parseListingFieldsJson,
} from "@/lib/listing-manage";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set(["pending", "approved", "rejected"]);

type EditRow = {
  id: number;
  company_slug: string;
  company_name: string | null;
  proposed_json: string;
  current_json: string;
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
      `SELECT e.id, e.company_slug, c.name AS company_name,
              e.proposed_json, e.current_json, e.status,
              e.created_at, e.reviewed_at, e.review_notes
       FROM listing_edit_requests e
       LEFT JOIN companies c ON c.slug = e.company_slug
       ORDER BY datetime(e.created_at) DESC
       LIMIT 200`,
    )
    .all<EditRow>();

  const edits = (results ?? []).map((row) => ({
    id: row.id,
    company_slug: row.company_slug,
    company_name: row.company_name,
    proposed: parseListingFieldsJson(row.proposed_json),
    current: parseListingFieldsJson(row.current_json),
    status: row.status,
    created_at: row.created_at,
    reviewed_at: row.reviewed_at,
    review_notes: row.review_notes,
  }));

  return NextResponse.json({ edits });
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
          "id and status (pending|approved|rejected) are required",
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
      `SELECT id, company_slug, proposed_json, status
       FROM listing_edit_requests WHERE id = ? LIMIT 1`,
    )
    .bind(id)
    .first<{
      id: number;
      company_slug: string;
      proposed_json: string;
      status: string;
    }>();

  if (!existing) {
    return NextResponse.json({ error: "Edit request not found" }, { status: 404 });
  }

  const setReviewed = status === "approved" || status === "rejected";

  if (status === "approved") {
    const proposed = parseListingFieldsJson(existing.proposed_json);
    const applied = await applyListingFields(
      db,
      existing.company_slug,
      proposed,
    );
    if (!applied) {
      return NextResponse.json(
        { error: "Company listing not found — cannot apply edits" },
        { status: 404 },
      );
    }
  }

  if (reviewNotes !== undefined) {
    await db
      .prepare(
        setReviewed
          ? `UPDATE listing_edit_requests
             SET status = ?, reviewed_at = datetime('now'), review_notes = ?
             WHERE id = ?`
          : `UPDATE listing_edit_requests
             SET status = ?, reviewed_at = NULL, review_notes = ?
             WHERE id = ?`,
      )
      .bind(status, reviewNotes, id)
      .run();
  } else {
    await db
      .prepare(
        setReviewed
          ? `UPDATE listing_edit_requests
             SET status = ?, reviewed_at = datetime('now')
             WHERE id = ?`
          : `UPDATE listing_edit_requests
             SET status = ?, reviewed_at = NULL
             WHERE id = ?`,
      )
      .bind(status, id)
      .run();
  }

  return NextResponse.json({
    ok: true,
    id,
    status,
    company_slug: existing.company_slug,
    applied: status === "approved",
  });
}
