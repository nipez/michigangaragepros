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

    // One round-trip: companies.claimed wins, else latest claim_requests status.
    const row = await db
      .prepare(
        `SELECT
           (SELECT claimed FROM companies WHERE slug = ?1 LIMIT 1) AS claimed,
           (SELECT status FROM claim_requests
             WHERE company_slug = ?1
               AND status IN ('approved', 'pending', 'new')
             ORDER BY
               CASE status
                 WHEN 'approved' THEN 0
                 WHEN 'pending' THEN 1
                 ELSE 2
               END,
               created_at DESC
             LIMIT 1) AS request_status`,
      )
      .bind(slug)
      .first<{ claimed: number | null; request_status: string | null }>();

    if (row && Number(row.claimed) === 1) return "claimed";
    if (row?.request_status === "approved") return "claimed";
    if (row?.request_status === "pending" || row?.request_status === "new") {
      return "pending";
    }

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
