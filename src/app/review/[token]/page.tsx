import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  ReviewLinkInvalid,
  ReviewRequestClient,
} from "@/components/ReviewRequestClient";
import { getDb } from "@/lib/db";
import {
  bumpListingStatSafe,
  isLikelyBot,
} from "@/lib/listing-stats";
import {
  getCompanyByReviewToken,
  isValidReviewTokenFormat,
} from "@/lib/review-request";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  return buildPageMetadata({
    title: "Leave a review",
    description: "Share your experience with a Michigan Garage Pros company.",
    path: `/review/${token}/`,
    noIndex: true,
  });
}

async function loadReviewPage(
  token: string,
): Promise<{ token: string; companyName: string; companySlug: string } | null> {
  if (!isValidReviewTokenFormat(token)) return null;
  const db = await getDb();
  const company = await getCompanyByReviewToken(db, token);
  if (!company) return null;
  return {
    token,
    companyName: company.name,
    companySlug: company.slug,
  };
}

export default async function ReviewRequestPage({ params }: PageProps) {
  const { token } = await params;

  let loaded: Awaited<ReturnType<typeof loadReviewPage>> = null;
  try {
    loaded = await loadReviewPage(token);
  } catch {
    loaded = null;
  }

  if (!loaded) {
    return <ReviewLinkInvalid />;
  }

  // Best-effort visit count — never delay or break the review form.
  try {
    const hdrs = await headers();
    const ua = hdrs.get("user-agent");
    if (!isLikelyBot(ua)) {
      const db = await getDb();
      bumpListingStatSafe(db, loaded.companySlug, "review_link_visits");
    }
  } catch {
    /* fail open */
  }

  return (
    <ReviewRequestClient
      token={loaded.token}
      companyName={loaded.companyName}
      companySlug={loaded.companySlug}
    />
  );
}
