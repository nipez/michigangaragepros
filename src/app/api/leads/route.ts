import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isStepValid, type Lead } from "@/lib/lead";
import { formatLeadNotify, notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";

type LeadBody = Lead & { companySlug?: string };

function validateLead(lead: LeadBody): string | null {
  if (!isStepValid(1, lead)) return "Service is required";
  if (!isStepValid(2, lead)) return "Issue is required";
  if (!isStepValid(3, lead)) return "Valid ZIP is required";
  if (!isStepValid(4, lead)) return "Name and phone or email are required";
  if (!isStepValid(5, lead)) return "Timing is required";
  return null;
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const error = validateLead(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO leads (service, issue, zip, name, phone, email, timing, company_slug)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        body.service.trim(),
        body.issue.trim(),
        body.zip.trim(),
        body.name.trim(),
        body.phone.trim() || null,
        body.email.trim() || null,
        body.timing.trim(),
        body.companySlug?.trim() || null,
      )
      .run();

    const id = result.meta.last_row_id;
    await notifyOperator(
      formatLeadNotify({
        id: id ?? "unknown",
        service: body.service.trim(),
        issue: body.issue.trim(),
        zip: body.zip.trim(),
        name: body.name.trim(),
        phone: body.phone.trim() || null,
        email: body.email.trim() || null,
        timing: body.timing.trim(),
        companySlug: body.companySlug?.trim() || null,
      }),
    );

    return NextResponse.json({
      ok: true,
      id,
    });
  } catch (err) {
    console.error("lead insert failed", err);
    return NextResponse.json(
      { error: "Unable to save lead right now" },
      { status: 500 },
    );
  }
}
