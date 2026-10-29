import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
} from "@/lib/listing-manage";
import {
  ensureReviewToken,
  regenerateReviewToken,
  reviewRequestUrl,
} from "@/lib/review-request";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Claimed company (via manage link) can copy / regenerate their
 * shareable review-request URL. Body: { action?: "ensure" | "regenerate" }
 * Default action is ensure (issue if missing, reuse if present).
 */
export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { action?: string } = {};
  try {
    const raw = await request.json().catch(() => ({}));
    body = (raw ?? {}) as { action?: string };
  } catch {
    body = {};
  }

  const action = (body.action?.trim() || "ensure") as string;
  if (action !== "ensure" && action !== "regenerate") {
    return NextResponse.json(
      { error: "action must be ensure or regenerate" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const reviewToken =
      action === "regenerate"
        ? await regenerateReviewToken(db, company.slug)
        : await ensureReviewToken(db, company.slug);

    if (!reviewToken) {
      return NextResponse.json(
        { error: "Unable to issue review link" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      slug: company.slug,
      review_token: reviewToken,
      review_url: reviewRequestUrl(reviewToken),
    });
  } catch (err) {
    console.error("manage review-token failed", err);
    return NextResponse.json(
      { error: "Unable to update review link" },
      { status: 500 },
    );
  }
}
