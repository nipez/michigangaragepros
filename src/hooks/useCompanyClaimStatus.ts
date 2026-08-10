"use client";

import { use, useMemo } from "react";
import type { ClaimStatus } from "@/lib/claimStatus";

const statusCache = new Map<string, Promise<ClaimStatus>>();

function fetchClaimStatus(slug: string): Promise<ClaimStatus> {
  const cached = statusCache.get(slug);
  if (cached) return cached;

  const promise = fetch(`/api/claims/status?slug=${encodeURIComponent(slug)}`)
    .then(async (res) => {
      const data = (await res.json().catch(() => ({}))) as {
        status?: ClaimStatus;
      };
      if (
        data.status === "claimed" ||
        data.status === "pending" ||
        data.status === "unclaimed"
      ) {
        return data.status;
      }
      return "unclaimed" as const;
    })
    .catch(() => "unclaimed" as const);

  statusCache.set(slug, promise);
  return promise;
}

/**
 * Load claim status from the lightweight D1-backed API so company HTML
 * can stay statically generated (avoids Worker 1102 on profile SSR).
 */
export function useCompanyClaimStatus(companySlug: string): ClaimStatus {
  const slug = companySlug.trim();
  const promise = useMemo(
    () => (slug ? fetchClaimStatus(slug) : Promise.resolve("unclaimed" as const)),
    [slug],
  );
  return use(promise);
}
