"use client";

import { useEffect, useMemo, useState } from "react";
import type { CompanyTrust } from "@/lib/company-trust";

/**
 * Batch-load self-reported trust credentials for listing cards.
 * Returns only companies that have at least one credential set.
 */
export function useCompanyTrust(
  slugs: string[],
): Record<string, CompanyTrust> {
  const key = useMemo(
    () =>
      [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].sort().join(","),
    [slugs],
  );
  const [trust, setTrust] = useState<Record<string, CompanyTrust>>({});

  useEffect(() => {
    if (!key) return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/companies/trust/?slugs=${encodeURIComponent(key)}`,
          { signal: controller.signal },
        );
        const data = (await res.json().catch(() => ({}))) as {
          trust?: Record<string, CompanyTrust>;
        };
        if (cancelled || !res.ok) return;
        setTrust(data.trust ?? {});
      } catch {
        if (!cancelled) setTrust({});
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [key]);

  if (!key) return {};
  return trust;
}
