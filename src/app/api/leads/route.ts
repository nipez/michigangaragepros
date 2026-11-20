import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isStepValid, type Lead } from "@/lib/lead";
import {
  filterNewRecipients,
  listExistingRoutingSlugs,
  persistLeadRouting,
  resolveLeadRecipients,
} from "@/lib/lead-routing";
import {
  formatCompanyLeadNotify,
  formatLeadNotify,
  notifyCompany,
  notifyOperator,
} from "@/lib/notify";
import { normalizeQuoteSourcePage } from "@/lib/quote-links";
import { bumpQuoteFunnel } from "@/lib/quote-funnel";

export const runtime = "nodejs";

type LeadBody = Lead & { companySlug?: string; sourcePage?: string };

function validateLead(lead: LeadBody): string | null {
  if (!isStepValid(1, lead)) return "Service is required";
  if (!isStepValid(2, lead)) return "Issue is required";
  if (!isStepValid(3, lead)) return "Valid ZIP is required";
  if (!isStepValid(4, lead)) return "Name and phone or email are required";
  if (!isStepValid(5, lead)) return "Urgency is required";
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

  const service = body.service.trim();
  const issue = body.issue.trim();
  const zip = body.zip.trim();
  const name = body.name.trim();
  const phone = body.phone.trim() || null;
  const email = body.email.trim() || null;
  const timing = body.timing.trim();
  const companySlug = body.companySlug?.trim() || null;
  const sourcePage = normalizeQuoteSourcePage(body.sourcePage);

  try {
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO leads (service, issue, zip, name, phone, email, timing, company_slug, source_page)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        service,
        issue,
        zip,
        name,
        phone,
        email,
        timing,
        companySlug,
        sourcePage,
      )
      .run();

    const id = result.meta.last_row_id;

    // Server-side submit counter (complements client beacon; bot-tolerant client may miss).
    try {
      await bumpQuoteFunnel(db, "submit", sourcePage);
    } catch (funnelErr) {
      console.error("quote funnel submit bump failed", funnelErr);
    }

    // Operator notify stays on every lead (additive company notify below).
    await notifyOperator(
      formatLeadNotify({
        id: id ?? "unknown",
        service,
        issue,
        zip,
        name,
        phone,
        email,
        timing,
        companySlug,
        sourcePage,
      }),
    );

    let routedCount = 0;

    // Best-effort company routing — never fail the lead save.
    if (id != null) {
      try {
        const recipients = await resolveLeadRecipients(db, {
          zip,
          companySlug,
          service,
        });
        // Idempotent: one email + inbox row per lead per company, even on retries.
        const already = await listExistingRoutingSlugs(db, Number(id));
        const fresh = filterNewRecipients(recipients, already);
        const routed: Array<(typeof recipients)[number] & { emailed: boolean }> =
          [];
        for (const recipient of fresh) {
          const emailed = await notifyCompany(
            recipient.email,
            formatCompanyLeadNotify({
              id,
              companyName: recipient.companyName,
              service,
              issue,
              zip,
              name,
              phone,
              email,
              timing,
              reason: recipient.reason,
              sourcePage,
            }),
          );
          routed.push({ ...recipient, emailed });
        }
        await persistLeadRouting(db, Number(id), routed);
        // Homeowner done screen: how many claimed pros were matched.
        routedCount = recipients.length;
      } catch (routeErr) {
        console.error("lead routing failed", routeErr);
      }
    }

    return NextResponse.json({
      ok: true,
      id,
      routedCount,
    });
  } catch (err) {
    console.error("lead insert failed", err);
    return NextResponse.json(
      { error: "Unable to save lead right now" },
      { status: 500 },
    );
  }
}
