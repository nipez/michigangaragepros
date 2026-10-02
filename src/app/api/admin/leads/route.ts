import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set(["new", "contacted", "closed"]);

type LeadRow = {
  id: number;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone: string | null;
  email: string | null;
  timing: string;
  company_slug: string | null;
  status: string;
  created_at: string;
  routed_at: string | null;
  routed_to: string | null;
};

type RoutingRow = {
  id: number;
  lead_id: number;
  company_slug: string;
  email: string;
  reason: string;
  emailed: number;
  created_at: string;
};

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT id, service, issue, zip, name, phone, email, timing, company_slug,
              status, created_at, routed_at, routed_to
       FROM leads
       ORDER BY datetime(created_at) DESC
       LIMIT 200`,
    )
    .all<LeadRow>();

  const leads = results ?? [];
  const leadIds = leads.map((l) => l.id);
  let routingsByLead = new Map<number, RoutingRow[]>();

  if (leadIds.length > 0) {
    // D1 has no great IN-list binder for dynamic sizes; fetch recent routings and group.
    const { results: routingRows } = await db
      .prepare(
        `SELECT id, lead_id, company_slug, email, reason, emailed, created_at
         FROM lead_routings
         ORDER BY datetime(created_at) DESC
         LIMIT 500`,
      )
      .all<RoutingRow>();

    const idSet = new Set(leadIds);
    routingsByLead = new Map();
    for (const row of routingRows ?? []) {
      if (!idSet.has(row.lead_id)) continue;
      const list = routingsByLead.get(row.lead_id) ?? [];
      list.push(row);
      routingsByLead.set(row.lead_id, list);
    }
  }

  return NextResponse.json({
    leads: leads.map((lead) => ({
      ...lead,
      routings: routingsByLead.get(lead.id) ?? [],
    })),
  });
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
