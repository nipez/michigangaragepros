import { NextResponse } from "next/server";
import { getCompanyBySlug } from "@/data/companies";
import { getDb } from "@/lib/db";
import {
  validateReview,
  type PublicReview,
  type ReviewSubmit,
  type ReviewSummary,
} from "@/lib/review";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_PER_IP = 5;
const RATE_LIMIT_PER_IP_PER_COMPANY = 1;
const LIST_LIMIT = 20;
const SUMMARY_SLUG_LIMIT = 80;

type ReviewRow = {
  id: number;
  author_name: string;
  rating: number;
  body: string;
  created_at: string;
};

type SummaryRow = {
  company_slug: string;
  avg_rating: number;
  review_count: number;
};

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

function toPublic(row: ReviewRow): PublicReview {
  return {
    id: row.id,
    authorName: row.author_name,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
  };
}

function parseSlugs(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ].slice(0, SUMMARY_SLUG_LIMIT);
}

/** List visible reviews + summary for one company, or batch summaries. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  const slugs = parseSlugs(searchParams.get("slugs"));

  try {
    const db = await getDb();

    if (slugs.length > 0) {
      const placeholders = slugs.map(() => "?").join(",");
      const rows = await db
        .prepare(
          `SELECT company_slug,
                  AVG(rating) AS avg_rating,
                  COUNT(*) AS review_count
           FROM company_reviews
           WHERE status = 'visible' AND company_slug IN (${placeholders})
           GROUP BY company_slug`,
        )
        .bind(...slugs)
        .all<SummaryRow>();

      const summaries: Record<string, ReviewSummary> = {};
      for (const row of rows.results ?? []) {
        summaries[row.company_slug] = {
          average: Math.round(Number(row.avg_rating) * 10) / 10,
          count: Number(row.review_count),
        };
      }
      return NextResponse.json(
        { summaries },
        {
          headers: {
            "Cache-Control": "private, max-age=0, must-revalidate",
          },
        },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug or slugs" },
        { status: 400 },
      );
    }

    const [summaryRow, listRows] = await Promise.all([
      db
        .prepare(
          `SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count
           FROM company_reviews
           WHERE company_slug = ? AND status = 'visible'`,
        )
        .bind(slug)
        .first<{ avg_rating: number | null; review_count: number }>(),
      db
        .prepare(
          `SELECT id, author_name, rating, body, created_at
           FROM company_reviews
           WHERE company_slug = ? AND status = 'visible'
           ORDER BY created_at DESC
           LIMIT ?`,
        )
        .bind(slug, LIST_LIMIT)
        .all<ReviewRow>(),
    ]);

    const count = Number(summaryRow?.review_count ?? 0);
    const summary: ReviewSummary = {
      average:
        count > 0
          ? Math.round(Number(summaryRow?.avg_rating ?? 0) * 10) / 10
          : 0,
      count,
    };

    return NextResponse.json(
      {
        slug,
        summary,
        reviews: (listRows.results ?? []).map(toPublic),
      },
      {
        headers: {
          "Cache-Control": "private, max-age=0, must-revalidate",
        },
      },
    );
  } catch (err) {
    console.error("reviews fetch failed", err);
    return NextResponse.json(
      { error: "Unable to load reviews right now" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: Partial<ReviewSubmit>;
  try {
    body = (await request.json()) as Partial<ReviewSubmit>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const review: ReviewSubmit = {
    companySlug: body.companySlug?.trim() ?? "",
    authorName: body.authorName?.trim() ?? "",
    contact: body.contact?.trim() ?? "",
    rating: typeof body.rating === "number" ? body.rating : Number(body.rating),
    body: body.body?.trim() ?? "",
    website: body.website?.trim() ?? "",
  };

  // Honeypot: bots that fill the hidden field get a silent success.
  if (review.website) {
    return NextResponse.json({ ok: true });
  }

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

  if (!getCompanyBySlug(review.companySlug)) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const ip = clientIp(request);
  const ipHash = await hashIp(ip);

  try {
    const db = await getDb();
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
        .bind(ipHash, review.companySlug, windowStart)
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
         ) VALUES (?, ?, ?, ?, ?, 'visible', ?)`,
      )
      .bind(
        review.companySlug,
        review.authorName,
        review.contact || null,
        review.rating,
        review.body,
        ipHash,
      )
      .run();

    return NextResponse.json({
      ok: true,
      id: result.meta.last_row_id,
      status: "visible",
    });
  } catch (err) {
    console.error("review insert failed", err);
    return NextResponse.json(
      { error: "Unable to save review right now" },
      { status: 500 },
    );
  }
}
