"use client";

import { useEffect, useState } from "react";
import type { ListingPerformance } from "@/lib/listing-stats";
import { ListingPerformancePanel } from "./ListingPerformancePanel";

type Props = {
  companySlug: string;
  companyName: string;
  companyCity?: string;
};

type Payload = {
  featured: boolean;
  performance: ListingPerformance;
  name?: string;
};

export function AdminListingStats({
  companySlug,
  companyName,
  companyCity = "",
}: Props) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/admin/listing-stats?slug=${encodeURIComponent(companySlug)}`,
        );
        if (res.status === 401) {
          if (!cancelled) setError("Admin session expired");
          return;
        }
        if (!res.ok) throw new Error("Unable to load stats");
        const json = (await res.json()) as Payload;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [companySlug]);

  if (loading) {
    return (
      <div className="mt-3 text-[12.5px] text-muted">Loading performance…</div>
    );
  }
  if (error || !data) {
    return (
      <div className="mt-3 text-[12.5px] text-muted">
        {error || "No performance data"}
      </div>
    );
  }

  return (
    <div className="mt-3">
      <ListingPerformancePanel
        variant="admin"
        performance={data.performance}
        featured={data.featured}
        companyName={data.name || companyName}
        companySlug={companySlug}
        companyCity={companyCity}
        showUpsell
      />
    </div>
  );
}
