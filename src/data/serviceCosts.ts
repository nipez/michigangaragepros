/**
 * Shared typical cost ranges for Michigan garage-door work.
 * Figures are planning estimates — never presented as quotes or sourced claims.
 * Optional per-region multipliers adjust display bands slightly by market type.
 */
import type { Service } from "./services";
import { getRegionByName, type Region } from "./regions";
import type { City } from "./cities";

export type CostLine = {
  /** Short job label shown on the page. */
  label: string;
  low: number;
  high: number;
  /** Optional clarification (parts vs labor, pair vs single, etc.). */
  note?: string;
};

export type ServiceCostGuide = {
  serviceSlug: string;
  /** Shown above the table. */
  disclaimer: string;
  lines: CostLine[];
};

/** Base statewide planning ranges (USD). */
export const SERVICE_COST_GUIDES: ServiceCostGuide[] = [
  {
    serviceSlug: "garage-door-repair",
    disclaimer:
      "Typical Michigan planning ranges for common residential repairs — not a quote. Parts, door size, and urgency change the total.",
    lines: [
      {
        label: "Service call / diagnosis",
        low: 75,
        high: 150,
        note: "Often applied toward the repair",
      },
      {
        label: "Rollers, hinges, or sensors",
        low: 125,
        high: 350,
      },
      {
        label: "Cable or track repair",
        low: 175,
        high: 450,
      },
      {
        label: "Panel repair (limited)",
        low: 200,
        high: 600,
        note: "Severe damage may need a full door",
      },
    ],
  },
  {
    serviceSlug: "broken-springs",
    disclaimer:
      "Typical Michigan planning ranges for residential spring work — not a quote. Door weight, spring type, and same-day timing matter.",
    lines: [
      {
        label: "Torsion spring pair (standard door)",
        low: 250,
        high: 450,
        note: "Matched pair is usual",
      },
      {
        label: "Heavy / insulated door springs",
        low: 350,
        high: 650,
      },
      {
        label: "Extension springs (both sides)",
        low: 200,
        high: 400,
      },
      {
        label: "After-hours emergency spring visit",
        low: 350,
        high: 750,
        note: "Includes urgency premium",
      },
    ],
  },
  {
    serviceSlug: "garage-door-openers",
    disclaimer:
      "Typical Michigan planning ranges for opener repair or replacement — not a quote. Brand, drive type, and battery backup change pricing.",
    lines: [
      {
        label: "Opener diagnosis / minor repair",
        low: 100,
        high: 250,
      },
      {
        label: "Logic board or gear repair",
        low: 175,
        high: 400,
      },
      {
        label: "New chain- or belt-drive opener (installed)",
        low: 350,
        high: 700,
      },
      {
        label: "Wall-mount / premium opener with backup",
        low: 600,
        high: 1100,
      },
    ],
  },
  {
    serviceSlug: "garage-door-installation",
    disclaimer:
      "Typical Michigan planning ranges for residential door replacement — not a quote. Insulation, windows, removal, and opener bundling vary widely.",
    lines: [
      {
        label: "Single-car insulated door (installed)",
        low: 1200,
        high: 2500,
      },
      {
        label: "Double-car insulated door (installed)",
        low: 1800,
        high: 4000,
      },
      {
        label: "Premium / carriage-style door",
        low: 3000,
        high: 7000,
      },
      {
        label: "Door + opener package",
        low: 2200,
        high: 5500,
        note: "Depends on opener model",
      },
    ],
  },
  {
    serviceSlug: "maintenance",
    disclaimer:
      "Typical Michigan planning ranges for tune-ups and safety checks — not a quote. Multi-door properties and commercial doors cost more.",
    lines: [
      {
        label: "Standard residential tune-up",
        low: 80,
        high: 175,
      },
      {
        label: "Tune-up with minor parts",
        low: 150,
        high: 300,
      },
      {
        label: "Two-door property visit",
        low: 140,
        high: 280,
      },
    ],
  },
  {
    serviceSlug: "emergency-service",
    disclaimer:
      "Typical Michigan planning ranges for urgent / after-hours visits — not a quote. Night, weekend, and stuck-open security calls run higher.",
    lines: [
      {
        label: "Same-day emergency service call",
        low: 150,
        high: 300,
        note: "Before parts",
      },
      {
        label: "After-hours / overnight response",
        low: 250,
        high: 500,
      },
      {
        label: "Emergency spring or off-track repair",
        low: 350,
        high: 800,
        note: "Parts + urgency",
      },
    ],
  },
];

/** Soft regional multipliers vs statewide baseline. */
const REGION_COST_ADJ: Record<
  string,
  { multiplier: number; label: string }
> = {
  Southeast: { multiplier: 1.05, label: "Metro Detroit / Southeast" },
  West: { multiplier: 1.0, label: "West Michigan" },
  Central: { multiplier: 0.98, label: "Central Michigan" },
  Southwest: { multiplier: 0.98, label: "Southwest Michigan" },
  North: { multiplier: 1.08, label: "Northern Michigan (travel)" },
  "Upper Peninsula": {
    multiplier: 1.12,
    label: "Upper Peninsula (travel)",
  },
};

function roundToNice(n: number): number {
  if (n >= 1000) return Math.round(n / 50) * 50;
  if (n >= 200) return Math.round(n / 25) * 25;
  return Math.round(n / 5) * 5;
}

export function getServiceCostGuide(
  serviceSlug: string,
): ServiceCostGuide | undefined {
  return SERVICE_COST_GUIDES.find((g) => g.serviceSlug === serviceSlug);
}

export function getRegionCostAdjustment(regionName: string | undefined) {
  if (!regionName) return { multiplier: 1, label: "Michigan statewide" };
  return (
    REGION_COST_ADJ[regionName] ?? {
      multiplier: 1,
      label: "Michigan statewide",
    }
  );
}

export type LocalizedCostTable = {
  disclaimer: string;
  regionLabel: string;
  lines: CostLine[];
};

/** Cost lines adjusted for a city/region — still labeled as estimates. */
export function getLocalizedCostTable(
  service: Service | { slug: string },
  city?: Pick<City, "region" | "name">,
): LocalizedCostTable | null {
  const guide = getServiceCostGuide(service.slug);
  if (!guide) return null;
  const adj = getRegionCostAdjustment(city?.region);
  const lines = guide.lines.map((line) => ({
    ...line,
    low: roundToNice(line.low * adj.multiplier),
    high: roundToNice(line.high * adj.multiplier),
  }));
  const place = city?.name ? `${city.name}-area` : adj.label;
  return {
    disclaimer: `${guide.disclaimer} Figures below are adjusted slightly for ${place} market context.`,
    regionLabel: adj.label,
    lines,
  };
}

export function formatCostRange(low: number, high: number): string {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  return `${fmt(low)}–${fmt(high)}`;
}

/** Region helper for copy that mentions counties without inventing facts. */
export function getRegionForCity(city: City): Region | undefined {
  return city.region ? getRegionByName(city.region) : undefined;
}
