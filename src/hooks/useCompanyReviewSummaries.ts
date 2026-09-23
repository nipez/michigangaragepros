"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReviewSummary } from "@/lib/review";

/**
 * Batch-load live review summaries for listing cards.
 * Returns only companies that have at least one visible review.
 */
export function useCompanyReviewSummaries(
  slugs: string[],
): Record<string, ReviewSummary> {
  const key = useMemo(
    () =>
      [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].sort().join(","),
    [slugs],
  );
  const [summaries, setSummaries] = useState<Record<string, ReviewSummary>>(
    {},
  );

  useEffect(() => {
    if (!key) return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/reviews/?slugs=${encodeURIComponent(key)}`,
          { signal: controller.signal },
        );
        const data = (await res.json().catch(() => ({}))) as {
          summaries?: Record<string, ReviewSummary>;
        };
        if (cancelled || !res.ok) return;
        setSummaries(data.summaries ?? {});
      } catch {
        if (!cancelled) setSummaries({});
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [key]);

  if (!key) return {};
  return summaries;
}
