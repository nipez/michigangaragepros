"use client";

import { useEffect, useState } from "react";
import type { Company } from "@/data/companies";
import {
  mergeListingFields,
  type ListingFields,
} from "@/lib/listing-manage";

/**
 * Merge admin-approved D1 listing overrides onto the static company seed.
 * Keeps the profile page statically generated; live fields hydrate client-side
 * (same pattern as claim status / reviews).
 */
export function useCompanyLiveListing(company: Company): Company {
  const [override, setOverride] = useState<ListingFields | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/companies/listing?slug=${encodeURIComponent(company.slug)}`,
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          fields: ListingFields | null;
        };
        if (cancelled || !data.fields) return;
        setOverride(data.fields);
      } catch {
        // Keep static seed on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [company.slug]);

  return override ? mergeListingFields(company, override) : company;
}
