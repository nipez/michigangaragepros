"use client";

import { useEffect, useState } from "react";
import type { ClaimStatus } from "@/lib/claimStatus";

export type ClaimStatusView = ClaimStatus | "loading";

/**
 * Load claim status from the lightweight D1-backed API so company HTML
 * can stay statically generated (avoids Worker 1102 on profile SSR).
 *
 * Starts as "loading" on the client; SSR/prerender keeps the loading UI
 * without issuing network requests during the build.
 */
export function useCompanyClaimStatus(companySlug: string): ClaimStatusView {
  const slug = companySlug.trim();
  const [status, setStatus] = useState<ClaimStatusView>(
    slug ? "loading" : "unclaimed",
  );

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      // OpenNext occasionally returns transient 405/404 under concurrency;
      // retry a couple times before falling back to unclaimed.
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(
            `/api/claims/?slug=${encodeURIComponent(slug)}`,
            { signal: controller.signal },
          );
          const data = (await res.json().catch(() => ({}))) as {
            status?: ClaimStatus;
          };
          if (cancelled) return;
          if (
            data.status === "claimed" ||
            data.status === "pending" ||
            data.status === "unclaimed"
          ) {
            setStatus(data.status);
            return;
          }
          if (res.ok) {
            setStatus("unclaimed");
            return;
          }
        } catch {
          if (cancelled) return;
        }
        await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
      }
      if (!cancelled) setStatus("unclaimed");
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug]);

  if (!slug) return "unclaimed";
  return status;
}
