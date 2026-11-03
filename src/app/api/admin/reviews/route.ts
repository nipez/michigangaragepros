import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import {
  isOwnerReplyStatus,
  parseOwnerReplyModeration,
  setOwnerReplyStatus,
} from "@/lib/review-replies";

export const runtime = "nodejs";

/** pending = awaiting moderation; visible = public; hidden/spam = not public. */
const ALLOWED_STATUSES = new Set(["pending", "visible", "hidden", "spam"]);

type ReviewRow = {
  id: number;
  company_slug: string;
  company_name: string | null;
  author_name: string;
  contact: string | null;
  rating: number;
  body: string;
  status: string;
  created_at: string;
  moderated_at: string | null;
  owner_reply: string | null;
  owner_reply_status: string | null;
  owner_reply_at: string | null;
  owner_reply_moderated_at: string | null;
};

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT r.id, r.company_slug, c.name AS company_name,
              r.author_name, r.contact, r.rating, r.body, r.status,
              r.created_at, r.moderated_at,
              r.owner_reply, r.owner_reply_status, r.owner_reply_at,
              r.owner_reply_moderated_at
       FROM company_reviews r
       LEFT JOIN companies c ON c.slug = r.company_slug
       ORDER BY datetime(r.created_at) DESC
       LIMIT 200`,
    )
    .all<ReviewRow>();

  return NextResponse.json({ reviews: results ?? [] });
}

export async function PATCH(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Owner-reply moderation: { id, replyStatus } (no review status change).
  const raw = body as {
    id?: unknown;
    status?: unknown;
    replyStatus?: unknown;
    owner_reply_status?: unknown;
  };
  const hasReplyModeration =
    typeof raw.replyStatus === "string" ||
    typeof raw.owner_reply_status === "string";

  if (hasReplyModeration) {
    const parsed = parseOwnerReplyModeration(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    if (!isOwnerReplyStatus(parsed.replyStatus)) {
      return NextResponse.json({ error: "Invalid replyStatus" }, { status: 400 });
    }

    const db = await getDb();
    const ok = await setOwnerReplyStatus(db, parsed.id, parsed.replyStatus);
    if (!ok) {
      return NextResponse.json(
        { error: "Review not found or has no reply" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      id: parsed.id,
      replyStatus: parsed.replyStatus,
    });
  }

  const id = Number(raw.id);
  const status =
    typeof raw.status === "string" ? raw.status.trim() : undefined;
  if (!id || !status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      {
        error:
          "id and status (pending|visible|hidden|spam) are required, or id and replyStatus for owner replies",
      },
      { status: 400 },
    );
  }

  const db = await getDb();
  const existing = await db
    .prepare(`SELECT id FROM company_reviews WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<{ id: number }>();

  if (!existing) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const setModerated =
    status === "visible" || status === "hidden" || status === "spam";

  await db
    .prepare(
      setModerated
        ? `UPDATE company_reviews
           SET status = ?, moderated_at = datetime('now')
           WHERE id = ?`
        : `UPDATE company_reviews
           SET status = ?, moderated_at = NULL
           WHERE id = ?`,
    )
    .bind(status, id)
    .run();

  return NextResponse.json({ ok: true, id, status });
}
