import Link from "next/link";
import { MICHIGAN_COUNTY_PATHS } from "@/data/michiganCountyPaths";
import {
  REGIONS,
  getRegionSlugForCounty,
  type Region,
} from "@/data/regions";

type MichiganRegionMapProps = {
  activeSlug?: string;
  interactive?: boolean;
  className?: string;
  /** Show county names for the active region under the map. */
  showCounties?: boolean;
};

const REGION_FILL: Record<string, string> = {
  southeast: "#2F80ED",
  west: "#1769AA",
  central: "#3D8BDB",
  southwest: "#1F6FAF",
  north: "#5BA3E0",
  "upper-peninsula": "#0F4C81",
};

/**
 * Real Michigan county map (US Census TIGER / CC0) with directory regions highlighted.
 */
export function MichiganRegionMap({
  activeSlug,
  interactive = true,
  className = "",
  showCounties = true,
}: MichiganRegionMapProps) {
  const active = REGIONS.find((r) => r.slug === activeSlug);

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#C5DFF0] p-3 shadow-[0_16px_40px_rgba(4,16,28,0.25)] sm:p-4">
        <svg
          viewBox="0 0 810 810"
          role="img"
          aria-label={
            active
              ? `Map of Michigan highlighting ${active.title} counties`
              : "Map of Michigan counties by region"
          }
          className="h-auto w-full"
        >
          <rect width="810" height="810" fill="#C5DFF0" />
          <g transform="translate(5,5)" stroke="#F7FBFF" strokeWidth="1.1">
            {MICHIGAN_COUNTY_PATHS.map((county) => {
              const regionSlug = getRegionSlugForCounty(county.id);
              const isActive = !activeSlug || regionSlug === activeSlug;
              const base = regionSlug
                ? REGION_FILL[regionSlug] ?? "#8AA3B8"
                : "#8AA3B8";
              const fill = activeSlug
                ? isActive
                  ? "#2F80ED"
                  : "#9BB4C9"
                : base;
              const opacity = activeSlug ? (isActive ? 1 : 0.45) : 0.92;

              const title = `${county.id} County${
                regionSlug
                  ? ` · ${REGIONS.find((r) => r.slug === regionSlug)?.title}`
                  : ""
              }`;

              if (!interactive || !regionSlug) {
                return (
                  <path
                    key={county.id}
                    d={county.d}
                    fill={fill}
                    opacity={opacity}
                  >
                    <title>{title}</title>
                  </path>
                );
              }

              return (
                <a
                  key={county.id}
                  href={`/regions/${regionSlug}/`}
                  aria-label={title}
                >
                  <path d={county.d} fill={fill} opacity={opacity}>
                    <title>{title}</title>
                  </path>
                </a>
              );
            })}
          </g>
        </svg>

        <div className="mt-3 flex flex-wrap gap-2">
          {REGIONS.map((region) => {
            const isActive = region.slug === activeSlug;
            const chipClass = isActive
              ? "map-region-chip is-active rounded-full bg-bright-blue px-3 py-1.5 text-[12.5px] font-bold"
              : "map-region-chip rounded-full border border-[#7FA8C8] bg-white px-3 py-1.5 text-[12.5px] font-semibold transition-colors hover:border-bright-blue";
            if (!interactive) {
              return (
                <span
                  key={region.slug}
                  className={chipClass}
                  style={isActive ? undefined : { color: "#102a43" }}
                >
                  {region.name}
                </span>
              );
            }
            return (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}/`}
                className={chipClass}
              >
                {region.name}
              </Link>
            );
          })}
        </div>
      </div>

      {showCounties && active ? <CountyList region={active} /> : null}
      {showCounties && !active ? (
        <p className="mt-3 mb-0 text-[13px] leading-[1.5] text-[#D7E8F5]">
          Real Michigan county map — click a region or county to explore coverage.
        </p>
      ) : null}
    </div>
  );
}

function CountyList({ region }: { region: Region }) {
  return (
    <div className="mt-4 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-[2px]">
      <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[1px] text-[#A8D4F5]">
        {region.counties.length} counties in {region.title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {region.counties.map((county) => (
          <span
            key={county}
            className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-[#E8F1F8]"
          >
            {county}
          </span>
        ))}
      </div>
    </div>
  );
}
