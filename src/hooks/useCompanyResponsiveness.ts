"use client";

import { useEffect, useState } from "react";

export type ResponsivenessBadgeView = {
  label: string;
  withinHours: number;
} | null;

type State = "loading" | "ready";

/**
 * Load public responsiveness badge from the lightweight D1-backed API so
 * company HTML can stay statically generated.
 */
export function useCompanyResponsiveness(companySlug: string): {
  status: State;
  badge: ResponsivenessBadgeView;
} {
  const slug = companySlug.trim();
  const [status, setStatus] = useState<State>(slug ? "loading" : "ready");
  const [badge, setBadge] = useState<ResponsivenessBadgeView>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(
            `/api/companies/responsiveness/?slug=${encodeURIComponent(slug)}`,
            { signal: controller.signal },
          );
          const data = (await res.json().catch(() => ({}))) as {
            badge?: { label?: string; withinHours?: number } | null;
          };
          if (cancelled) return;
          const label = data.badge?.label?.trim();
          const withinHours = Number(data.badge?.withinHours);
          if (label && Number.isFinite(withinHours) && withinHours > 0) {
            setBadge({ label, withinHours });
          } else {
            setBadge(null);
          }
          setStatus("ready");
          return;
        } catch {
          if (cancelled) return;
        }
        await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
      }
      if (!cancelled) {
        setBadge(null);
        setStatus("ready");
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug]);

  if (!slug) return { status: "ready", badge: null };
  return { status, badge };
}
