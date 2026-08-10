import Link from "next/link";
import { REGIONS, type Region } from "@/data/regions";

type MichiganRegionMapProps = {
  activeSlug?: string;
  /** When true, regions link to their pages. */
  interactive?: boolean;
  className?: string;
};

/**
 * Stylized Michigan map with approximate region shapes for visual orientation.
 * Not a survey map — meant to show where each directory region sits in the state.
 */
export function MichiganRegionMap({
  activeSlug,
  interactive = true,
  className = "",
}: MichiganRegionMapProps) {
  const active = REGIONS.find((r) => r.slug === activeSlug);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 360 420"
        role="img"
        aria-label={
          active
            ? `Map of Michigan highlighting ${active.title}`
            : "Map of Michigan regions"
        }
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="miWater" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D7EAF8" />
            <stop offset="100%" stopColor="#B9D7F0" />
          </linearGradient>
        </defs>
        <rect width="360" height="420" rx="24" fill="url(#miWater)" />

        {/* Upper Peninsula */}
        <RegionPath
          region={REGIONS.find((r) => r.mapKey === "upper-peninsula")!}
          d="M48 78 L92 52 L168 48 L236 62 L268 88 L248 118 L190 128 L128 122 L78 108 Z"
          activeSlug={activeSlug}
          interactive={interactive}
        />

        {/* Northern Lower Peninsula */}
        <RegionPath
          region={REGIONS.find((r) => r.mapKey === "north")!}
          d="M118 148 L188 138 L236 152 L248 198 L210 218 L150 220 L118 198 Z"
          activeSlug={activeSlug}
          interactive={interactive}
        />

        {/* West Michigan */}
        <RegionPath
          region={REGIONS.find((r) => r.mapKey === "west")!}
          d="M96 224 L148 222 L168 268 L160 318 L112 332 L88 292 L90 248 Z"
          activeSlug={activeSlug}
          interactive={interactive}
        />

        {/* Central Michigan */}
        <RegionPath
          region={REGIONS.find((r) => r.mapKey === "central")!}
          d="M152 224 L208 220 L228 268 L218 318 L170 322 L152 278 Z"
          activeSlug={activeSlug}
          interactive={interactive}
        />

        {/* Southwest Michigan */}
        <RegionPath
          region={REGIONS.find((r) => r.mapKey === "southwest")!}
          d="M112 336 L168 326 L186 362 L160 392 L118 388 L98 358 Z"
          activeSlug={activeSlug}
          interactive={interactive}
        />

        {/* Southeast Michigan */}
        <RegionPath
          region={REGIONS.find((r) => r.mapKey === "southeast")!}
          d="M174 326 L230 318 L268 348 L262 392 L210 398 L178 368 Z"
          activeSlug={activeSlug}
          interactive={interactive}
        />

        <text
          x="180"
          y="28"
          textAnchor="middle"
          fill="#164A75"
          fontSize="13"
          fontWeight="700"
        >
          Michigan regions
        </text>
      </svg>

      <div className="mt-4 flex flex-wrap gap-2">
        {REGIONS.map((region) => {
          const isActive = region.slug === activeSlug;
          const classNameChip = isActive
            ? "rounded-full bg-bright-blue px-3 py-1.5 text-[12.5px] font-bold text-white"
            : "rounded-full border border-border bg-white px-3 py-1.5 text-[12.5px] font-semibold text-navy transition-colors hover:border-bright-blue hover:text-michigan-blue";
          if (!interactive) {
            return (
              <span key={region.slug} className={classNameChip}>
                {region.name}
              </span>
            );
          }
          return (
            <Link
              key={region.slug}
              href={`/regions/${region.slug}/`}
              className={classNameChip}
            >
              {region.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RegionPath({
  region,
  d,
  activeSlug,
  interactive,
}: {
  region: Region;
  d: string;
  activeSlug?: string;
  interactive: boolean;
}) {
  const isActive = !activeSlug || region.slug === activeSlug;
  const fill = isActive ? "#2F80ED" : "#8AA3B8";
  const opacity = activeSlug ? (isActive ? 1 : 0.35) : 0.85;

  const path = (
    <path
      d={d}
      fill={fill}
      opacity={opacity}
      stroke="#FFFFFF"
      strokeWidth="3"
      className={interactive ? "transition-opacity hover:opacity-100" : undefined}
    >
      <title>{region.title}</title>
    </path>
  );

  if (!interactive) return path;
  return (
    <a href={`/regions/${region.slug}/`} aria-label={region.title}>
      {path}
    </a>
  );
}
