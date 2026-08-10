import { getDb } from "@/lib/db";

export type ClaimStatus = "unclaimed" | "pending" | "claimed";

/**
 * Resolve claim state for a directory listing from D1.
 * Falls back to unclaimed when DB is unavailable (local/static builds).
 */
export async function getCompanyClaimStatus(
  companySlug: string,
): Promise<ClaimStatus> {
  const slug = companySlug.trim();
  if (!slug) return "unclaimed";

  try {
    const db = await getDb();

    const company = await db
      .prepare(`SELECT claimed FROM companies WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first<{ claimed: number | null }>();
    if (company && Number(company.claimed) === 1) return "claimed";

    const approved = await db
      .prepare(
        `SELECT id FROM claim_requests
         WHERE company_slug = ? AND status = 'approved'
         LIMIT 1`,
      )
      .bind(slug)
      .first();
    if (approved) return "claimed";

    const pending = await db
      .prepare(
        `SELECT id FROM claim_requests
         WHERE company_slug = ? AND status IN ('new', 'pending')
         LIMIT 1`,
      )
      .bind(slug)
      .first();
    if (pending) return "pending";

    return "unclaimed";
  } catch (err) {
    console.error("getCompanyClaimStatus failed", err);
    return "unclaimed";
  }
}

export async function assertClaimAllowed(companySlug: string): Promise<string | null> {
  const status = await getCompanyClaimStatus(companySlug);
  if (status === "claimed") {
    return "This company page is already claimed. Contact us if you need access.";
  }
  if (status === "pending") {
    return "A claim for this page is already in review. We'll follow up with the contact on file.";
  }
  return null;
}
