import { NextResponse } from "next/server";
import { getCompanyBySlug } from "@/data/companies";
import { getDb, getEnv } from "@/lib/db";
import { isStepValid, type Lead } from "@/lib/lead";
import { sendLeadNotificationEmail } from "@/lib/notify";

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

  const companySlug = body.companySlug?.trim() || null;
  const company = companySlug ? getCompanyBySlug(companySlug) : undefined;

  try {
    const env = await getEnv();
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
        companySlug,
      )
      .run();

    const leadId = result.meta.last_row_id;

    const notify = await sendLeadNotificationEmail({
      apiKey: env.RESEND_API_KEY,
      to: env.LEAD_NOTIFY_TO,
      from: env.LEAD_NOTIFY_FROM,
      lead: {
        id: leadId ?? "unknown",
        service: body.service.trim(),
        issue: body.issue.trim(),
        zip: body.zip.trim(),
        name: body.name.trim(),
        phone: body.phone.trim() || null,
        email: body.email.trim() || null,
        timing: body.timing.trim(),
        companySlug,
        companyName: company?.name ?? null,
        companyPhone: company?.phone ?? null,
        companyAddress: company?.address ?? null,
      },
    });

    try {
      await db
        .prepare(
          `UPDATE leads
           SET notified_at = datetime('now'),
               notify_status = ?,
               notify_error = ?,
               matched_company_name = ?
           WHERE id = ?`,
        )
        .bind(
          notify.status,
          notify.status === "failed"
            ? notify.error
            : notify.status === "skipped"
              ? notify.reason
              : null,
          company?.name ?? null,
          leadId,
        )
        .run();
    } catch (updateErr) {
      // Notification columns may not be migrated yet — lead is still saved.
      console.error("lead notify status update failed", updateErr);
    }

    if (notify.status === "failed") {
      console.error("lead notify failed", notify.error);
    } else if (notify.status === "skipped") {
      console.warn("lead notify skipped", notify.reason);
    }

    return NextResponse.json({
      ok: true,
      id: leadId,
      notified: notify.status === "sent",
    });
  } catch (err) {
    console.error("lead insert failed", err);
    return NextResponse.json(
      { error: "Unable to save lead right now" },
      { status: 500 },
    );
  }
}
