"use client";

import { useEffect, useState } from "react";
import type { Company } from "@/data/companies";
import type { CompanyTrust } from "@/lib/company-trust";
import {
  mergeListingFields,
  type ListingFields,
} from "@/lib/listing-manage";

type LiveMedia = {
  logoUrl: string | null;
  photoUrl: string | null;
};

/**
 * Merge admin-approved D1 listing overrides + live logo/photo + trust
 * credentials onto the static company seed. Keeps the profile page
 * statically generated; live fields hydrate client-side.
 */
export function useCompanyLiveListing(company: Company): Company {
  const [override, setOverride] = useState<ListingFields | null>(null);
  const [media, setMedia] = useState<LiveMedia | null>(null);
  const [trust, setTrust] = useState<CompanyTrust | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [listingRes, mediaRes, trustRes] = await Promise.all([
          fetch(
            `/api/companies/listing?slug=${encodeURIComponent(company.slug)}`,
          ),
          fetch(
            `/api/companies/media/?slug=${encodeURIComponent(company.slug)}`,
          ),
          fetch(
            `/api/companies/trust/?slug=${encodeURIComponent(company.slug)}`,
          ),
        ]);

        if (!cancelled && listingRes.ok) {
          const data = (await listingRes.json()) as {
            fields: ListingFields | null;
          };
          if (data.fields) setOverride(data.fields);
        }

        if (!cancelled && mediaRes.ok) {
          const data = (await mediaRes.json()) as LiveMedia;
          setMedia({
            logoUrl: data.logoUrl ?? null,
            photoUrl: data.photoUrl ?? null,
          });
        }

        if (!cancelled && trustRes.ok) {
          const data = (await trustRes.json()) as { trust?: CompanyTrust };
          if (data.trust) setTrust(data.trust);
        }
      } catch {
        // Keep static seed on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [company.slug]);

  let merged = override ? mergeListingFields(company, override) : company;
  if (media) {
    merged = {
      ...merged,
      logoUrl: media.logoUrl || undefined,
      photoUrl: media.photoUrl || undefined,
    };
  }
  if (trust) {
    merged = { ...merged, trust };
  }
  return merged;
}
