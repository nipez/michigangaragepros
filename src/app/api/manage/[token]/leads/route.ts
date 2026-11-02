import { NextResponse } from "next/server";
import {
  listCompanyLeads,
  parseCompanyLeadStatusPatch,
  summarizeCompanyLeads,
  updateCompanyLeadStatus,
} from "@/lib/company-leads";
import { getDb } from "@/lib/db";
import { getCompanyByManageToken } from "@/lib/listing-manage";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const leads = await listCompanyLeads(db, company.slug);
    return NextResponse.json(
      {
        slug: company.slug,
        name: company.name,
        leads,
        totals: summarizeCompanyLeads(leads),
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (err) {
    console.error("manage leads GET failed", err);
    return NextResponse.json(
      { error: "Unable to load leads" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseCompanyLeadStatusPatch(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await updateCompanyLeadStatus(
      db,
      company.slug,
      parsed.routingId,
      parsed.status,
    );

    // Token for company A cannot update company B's routing rows.
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      lead: updated,
    });
  } catch (err) {
    console.error("manage leads PATCH failed", err);
    return NextResponse.json(
      { error: "Unable to update lead status" },
      { status: 500 },
    );
  }
}
