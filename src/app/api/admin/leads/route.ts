import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  try {
    const { results } = await db
      .prepare(
        `SELECT id, service, issue, zip, name, phone, email, timing, company_slug,
                matched_company_name, status, notify_status, notified_at, created_at
         FROM leads
         ORDER BY datetime(created_at) DESC
         LIMIT 200`,
      )
      .all();
    return NextResponse.json({ leads: results ?? [] });
  } catch {
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
  const allowed = new Set(["new", "contacted", "closed"]);
  if (!id || !status || !allowed.has(status)) {
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
