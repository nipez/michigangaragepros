import { NextResponse } from "next/server";
import {
  parseLeadReviewRequestBody,
  sendLeadReviewRequest,
} from "@/lib/lead-review-request";
import { getDb } from "@/lib/db";
import { getCompanyByManageToken } from "@/lib/listing-manage";
import {
  formatLeadReviewRequestNotify,
  notifyCompany,
} from "@/lib/notify";
import { ensureReviewToken } from "@/lib/review-request";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Owner-triggered review-request email for a won lead.
 * POST { routingId } — manage-token scoped; never automatic.
 */
export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseLeadReviewRequestBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const reviewToken = await ensureReviewToken(db, company.slug);
    if (!reviewToken) {
      return NextResponse.json(
        { error: "Unable to issue a review link for this listing" },
        { status: 400 },
      );
    }

    // Peek homeowner name for the email greeting only (not shared elsewhere).
    const nameRow = await db
      .prepare(
        `SELECT l.name AS name
         FROM lead_routings lr
         INNER JOIN leads l ON l.id = lr.lead_id
         WHERE lr.id = ? AND lr.company_slug = ?
         LIMIT 1`,
      )
      .bind(parsed.routingId, company.slug)
      .first<{ name: string }>();

    const homeownerName = nameRow?.name ?? "";

    const result = await sendLeadReviewRequest({
      db,
      companySlug: company.slug,
      routingId: parsed.routingId,
      reviewToken,
      sendEmail: async (to, reviewUrl) =>
        notifyCompany(
          to,
          formatLeadReviewRequestNotify({
            homeownerName,
            companyName: company.name,
            reviewUrl,
          }),
        ),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({
      ok: true,
      alreadySent: result.alreadySent,
      emailed: result.emailed,
      message: result.message,
      reviewUrl: result.reviewUrl,
      lead: result.lead,
    });
  } catch (err) {
    console.error("manage lead review-request POST failed", err);
    return NextResponse.json(
      { error: "Unable to send review request" },
      { status: 500 },
    );
  }
}
