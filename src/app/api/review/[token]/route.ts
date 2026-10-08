import { NextResponse } from "next/server";
import { getCompanyBySlug } from "@/data/companies";
import { getDb } from "@/lib/db";
import { formatReviewNotify, notifyOperator } from "@/lib/notify";
import {
  getCompanyByReviewToken,
  isValidReviewTokenFormat,
} from "@/lib/review-request";
import { validateReview, type ReviewSubmit } from "@/lib/review";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_PER_IP = 5;
const RATE_LIMIT_PER_IP_PER_COMPANY = 1;

type RouteContext = { params: Promise<{ token: string }> };

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function clientIp(request: Request): string {
  const forwarded =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  return forwarded || "unknown";
}

/**
 * Submit a review via a shareable review-request token.
 * Company is locked from the token — clients cannot retarget another listing.
 */
export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidReviewTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: Partial<ReviewSubmit>;
  try {
    body = (await request.json()) as Partial<ReviewSubmit>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots that fill the hidden field get a silent success.
  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByReviewToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Ignore any client-supplied companySlug — token binds the company.
    const review: ReviewSubmit = {
      companySlug: company.slug,
      authorName: body.authorName?.trim() ?? "",
      contact: body.contact?.trim() ?? "",
      rating:
        typeof body.rating === "number" ? body.rating : Number(body.rating),
      body: body.body?.trim() ?? "",
      website: "",
    };

    const error = validateReview(review);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (!Number.isInteger(review.rating)) {
      return NextResponse.json(
        { error: "Rating must be 1 to 5 stars" },
        { status: 400 },
      );
    }

    // Prefer seed for notify display name; fall back to D1 name.
    const seed = getCompanyBySlug(company.slug);
    const companyName = seed?.name ?? company.name;

    const ip = clientIp(request);
    const ipHash = await hashIp(ip);
    const windowStart = `-${RATE_LIMIT_WINDOW_HOURS} hours`;

    const [ipCount, companyCount] = await Promise.all([
      db
        .prepare(
          `SELECT COUNT(*) AS n FROM company_reviews
           WHERE ip_hash = ?
             AND created_at >= datetime('now', ?)`,
        )
        .bind(ipHash, windowStart)
        .first<{ n: number }>(),
      db
        .prepare(
          `SELECT COUNT(*) AS n FROM company_reviews
           WHERE ip_hash = ?
             AND company_slug = ?
             AND created_at >= datetime('now', ?)`,
        )
        .bind(ipHash, company.slug, windowStart)
        .first<{ n: number }>(),
    ]);

    if (Number(ipCount?.n ?? 0) >= RATE_LIMIT_PER_IP) {
      return NextResponse.json(
        { error: "Too many reviews from this network. Try again tomorrow." },
        { status: 429 },
      );
    }
    if (Number(companyCount?.n ?? 0) >= RATE_LIMIT_PER_IP_PER_COMPANY) {
      return NextResponse.json(
        {
          error:
            "You already reviewed this company recently. Thanks for sharing.",
        },
        { status: 429 },
      );
    }

    const result = await db
      .prepare(
        `INSERT INTO company_reviews (
           company_slug, author_name, contact, rating, body, status, ip_hash
         ) VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      )
      .bind(
        company.slug,
        review.authorName,
        review.contact || null,
        review.rating,
        review.body,
        ipHash,
      )
      .run();

    const id = result.meta.last_row_id;
    void notifyOperator(
      formatReviewNotify({
        id: id ?? "?",
        companyName,
        companySlug: company.slug,
        authorName: review.authorName,
        rating: review.rating,
        body: review.body,
      }),
    );

    return NextResponse.json({
      ok: true,
      id,
      status: "pending",
    });
  } catch (err) {
    console.error("review-request submit failed", err);
    return NextResponse.json(
      { error: "Unable to save review right now" },
      { status: 500 },
    );
  }
}
