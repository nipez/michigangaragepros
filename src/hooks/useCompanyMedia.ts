"use client";

import { useEffect, useMemo, useState } from "react";

export type CompanyMediaUrls = {
  logoUrl: string | null;
  photoUrl: string | null;
};

/**
 * Batch-load company logo/photo URLs for listing cards.
 * Returns only companies that have at least one image.
 */
export function useCompanyMedia(
  slugs: string[],
): Record<string, CompanyMediaUrls> {
  const key = useMemo(
    () =>
      [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].sort().join(","),
    [slugs],
  );
  const [media, setMedia] = useState<Record<string, CompanyMediaUrls>>({});

  useEffect(() => {
    if (!key) return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/companies/media/?slugs=${encodeURIComponent(key)}`,
          { signal: controller.signal },
        );
        const data = (await res.json().catch(() => ({}))) as {
          media?: Record<string, CompanyMediaUrls>;
        };
        if (cancelled || !res.ok) return;
        setMedia(data.media ?? {});
      } catch {
        if (!cancelled) setMedia({});
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [key]);

  if (!key) return {};
  return media;
}
