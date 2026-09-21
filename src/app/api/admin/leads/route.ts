import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set(["new", "contacted", "closed"]);

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT id, service, issue, zip, name, phone, email, timing, company_slug,
              status, created_at
       FROM leads
       ORDER BY datetime(created_at) DESC
       LIMIT 200`,
    )
    .all();

  return NextResponse.json({ leads: results ?? [] });
}

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
      { error: "id and status (new|contacted|closed) are required" },
      { status: 400 },
    );
  }

  const db = await getDb();
  await db
    .prepare(`UPDATE leads SET status = ? WHERE id = ?`)
    .bind(status, id)
    .run();

  return NextResponse.json({ ok: true });
}
