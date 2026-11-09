import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  companyTrustFromRow,
  formatTrustSummary,
  trustHasAny,
} from "@/lib/company-trust";
import { getDb, getEnv } from "@/lib/db";
import { retainLeadsForClaimedCompany } from "@/lib/lead-retention";
import {
  formatClaimDemandCopy,
  getListingDemandForSlugs,
  type ListingDemand,
} from "@/lib/listing-demand";
import { ensureManageToken, manageUrl } from "@/lib/listing-manage";
import {
  formatClaimApprovedNotify,
  notifyCompany,
} from "@/lib/notify";
import {
  ensureReviewToken,
  reviewRequestUrl,
} from "@/lib/review-request";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set(["new", "pending", "approved", "rejected"]);

type ClaimRow = {
  id: number;
  company_name: string;
  city: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  company_slug: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  manage_token: string | null;
  review_token: string | null;
  trust_licensed: number | null;
  trust_license_number: string | null;
  trust_insured: number | null;
  trust_bonded: number | null;
  trust_family_owned: number | null;
  trust_years_in_business: number | null;
  trust_updated_at: string | null;
};

type DemandPayload = {
  profileViews: number;
  contactClicks: number;
  quoteRequests: number;
  summary: string | null;
  hasSignal: boolean;
};

function demandPayload(demand: ListingDemand): DemandPayload {
  const copy = formatClaimDemandCopy(demand);
  return {
    profileViews: demand.profileViews,
    contactClicks: demand.contactClicks,
    quoteRequests: demand.quoteRequests,
    summary: copy.adminSummary,
    hasSignal: copy.hasSignal,
  };
}

export async function GET() {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  let rows: ClaimRow[] = [];
  try {
    const { results } = await db
      .prepare(
        `SELECT cr.id, cr.company_name, cr.city, cr.contact_name, cr.email, cr.phone,
                cr.website, cr.company_slug, cr.notes, cr.status, cr.created_at,
                cr.reviewed_at, cr.review_notes, c.manage_token AS manage_token,
                c.review_token AS review_token,
                c.trust_licensed AS trust_licensed,
                c.trust_license_number AS trust_license_number,
                c.trust_insured AS trust_insured,
                c.trust_bonded AS trust_bonded,
                c.trust_family_owned AS trust_family_owned,
                c.trust_years_in_business AS trust_years_in_business,
                c.trust_updated_at AS trust_updated_at
         FROM claim_requests cr
         LEFT JOIN companies c ON c.slug = cr.company_slug
         ORDER BY datetime(cr.created_at) DESC
         LIMIT 200`,
      )
      .all<ClaimRow>();
    rows = results ?? [];
  } catch (err) {
    // Fallback if migration 0021 is not applied yet.
    console.error("admin claims trust columns missing; falling back", err);
    const { results } = await db
      .prepare(
        `SELECT cr.id, cr.company_name, cr.city, cr.contact_name, cr.email, cr.phone,
                cr.website, cr.company_slug, cr.notes, cr.status, cr.created_at,
                cr.reviewed_at, cr.review_notes, c.manage_token AS manage_token,
                c.review_token AS review_token
         FROM claim_requests cr
         LEFT JOIN companies c ON c.slug = cr.company_slug
         ORDER BY datetime(cr.created_at) DESC
         LIMIT 200`,
      )
      .all<ClaimRow>();
    rows = results ?? [];
  }

  const demandBySlug = await getListingDemandForSlugs(
    db,
    rows
      .map((r) => r.company_slug)
      .filter((s): s is string => Boolean(s && s.trim())),
  );

  const claims = rows.map((row) => {
    const slug = (row.company_slug ?? "").trim();
    const demand = slug ? demandBySlug.get(slug) : undefined;
    const trust = companyTrustFromRow(row);
    const trustSummary = trustHasAny(trust) ? formatTrustSummary(trust) : null;
    return {
      ...row,
      manage_url: row.manage_token ? manageUrl(row.manage_token) : null,
      review_url: row.review_token ? reviewRequestUrl(row.review_token) : null,
      demand: demand ? demandPayload(demand) : null,
      trust_summary: trustSummary,
      trust_updated_at: trust.updatedAt,
    };
  });

  return NextResponse.json({ claims });
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
          "id and status (new|pending|approved|rejected) are required",
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
      `SELECT id, company_slug, email, status, company_name FROM claim_requests WHERE id = ? LIMIT 1`,
    )
    .bind(id)
    .first<{
      id: number;
      company_slug: string | null;
      email: string | null;
      status: string;
      company_name: string;
    }>();

  if (!existing) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  const setReviewed =
    status === "approved" || status === "rejected";
  const slug = (existing.company_slug ?? "").trim();
  const claimEmail = (existing.email ?? "").trim();

  const statements = [];

  if (reviewNotes !== undefined) {
    statements.push(
      db
        .prepare(
          setReviewed
            ? `UPDATE claim_requests
               SET status = ?, reviewed_at = datetime('now'), review_notes = ?
               WHERE id = ?`
            : `UPDATE claim_requests
               SET status = ?, reviewed_at = NULL, review_notes = ?
               WHERE id = ?`,
        )
        .bind(status, reviewNotes, id),
    );
  } else {
    statements.push(
      db
        .prepare(
          setReviewed
            ? `UPDATE claim_requests
               SET status = ?, reviewed_at = datetime('now')
               WHERE id = ?`
            : `UPDATE claim_requests
               SET status = ?, reviewed_at = NULL
               WHERE id = ?`,
        )
        .bind(status, id),
    );
  }

  // Same side effect as scripts/approve-claim.mjs: mark the company claimed
  // and stash the claim contact as companies.notify_email for lead routing.
  // Reject (and other statuses) must not flip companies.claimed.
  if (status === "approved" && slug) {
    if (claimEmail) {
      statements.push(
        db
          .prepare(
            `UPDATE companies
             SET claimed = 1, notify_email = ?
             WHERE slug = ?`,
          )
          .bind(claimEmail, slug),
      );
    } else {
      statements.push(
        db
          .prepare(`UPDATE companies SET claimed = 1 WHERE slug = ?`)
          .bind(slug),
      );
    }
  }

  await db.batch(statements);

  // Issue (or reuse) unguessable manage + review-request links.
  let manageToken: string | null = null;
  let reviewToken: string | null = null;
  let leadsRetained = 0;
  if (status === "approved" && slug) {
    manageToken = await ensureManageToken(db, slug);
    reviewToken = await ensureReviewToken(db, slug);

    // Surface historical leads that targeted this listing into the company
    // inbox. Admin inbox + prior area routings are unchanged; no re-email.
    try {
      const retained = await retainLeadsForClaimedCompany(db, slug, {
        email: claimEmail || null,
      });
      leadsRetained = retained.retained;
    } catch (err) {
      console.error("lead retention on claim approve failed", slug, err);
    }
  }

  // Best-effort: email claim contact the manage link. Delivery is optional —
  // feature works when Resend/from-address is not configured yet.
  let emailedManageLink = false;
  if (status === "approved" && claimEmail && manageToken) {
    emailedManageLink = await notifyCompany(
      claimEmail,
      formatClaimApprovedNotify({
        companyName: existing.company_name,
        manageUrl: manageUrl(manageToken),
      }),
    );
  }

  return NextResponse.json({
    ok: true,
    id,
    status,
    company_slug: slug || null,
    claimed_updated: status === "approved" && Boolean(slug),
    manage_token: manageToken,
    manage_url: manageToken ? manageUrl(manageToken) : null,
    review_token: reviewToken,
    review_url: reviewToken ? reviewRequestUrl(reviewToken) : null,
    emailed_manage_link: emailedManageLink,
    leads_retained: leadsRetained,
  });
}
