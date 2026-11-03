import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCompanyByManageToken } from "@/lib/listing-manage";
import { formatOwnerReplyNotify, notifyOperator } from "@/lib/notify";
import {
  deleteOwnerReply,
  listCompanyApprovedReviews,
  parseOwnerReplyDelete,
  parseOwnerReplyUpsert,
  upsertOwnerReply,
} from "@/lib/review-replies";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/** Approved reviews for this company + reply draft/moderation state. */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const reviews = await listCompanyApprovedReviews(db, company.slug);
    return NextResponse.json(
      {
        slug: company.slug,
        name: company.name,
        reviews,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (err) {
    console.error("manage reviews GET failed", err);
    return NextResponse.json(
      { error: "Unable to load reviews" },
      { status: 500 },
    );
  }
}

/** Write or edit a reply. Always pending until admin approves. */
export async function PUT(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseOwnerReplyUpsert(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await upsertOwnerReply(
      db,
      company.slug,
      parsed.reviewId,
      parsed.body,
    );

    // Token for company A cannot reply to company B's reviews.
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    void notifyOperator(
      formatOwnerReplyNotify({
        reviewId: updated.id,
        companyName: company.name,
        companySlug: company.slug,
        reply: updated.ownerReply ?? parsed.body,
      }),
    );

    return NextResponse.json({
      ok: true,
      review: updated,
      message:
        "Reply submitted for review. It appears on your public profile after approval.",
    });
  } catch (err) {
    console.error("manage reviews PUT failed", err);
    return NextResponse.json(
      { error: "Unable to save reply" },
      { status: 500 },
    );
  }
}

/** Remove a reply from an owned review. */
export async function DELETE(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseOwnerReplyDelete(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await deleteOwnerReply(
      db,
      company.slug,
      parsed.reviewId,
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, review: updated });
  } catch (err) {
    console.error("manage reviews DELETE failed", err);
    return NextResponse.json(
      { error: "Unable to remove reply" },
      { status: 500 },
    );
  }
}
