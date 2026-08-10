type IconProps = {
  size?: number;
  className?: string;
};

function Path({ d }: { d: string }) {
  return (
    <path
      d={d}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function LogoMark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3 10.5 12 4l9 6.5V20H3v-9.5Z"
        stroke="#7CC0F4"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 12h10M7 15h10M7 18h10"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PinIcon({ size = 13, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function BoltIcon({ size = 12, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="#102A43"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KeyIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 2-3.2Z"
        stroke="#1769AA"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SERVICE_PATHS: Record<string, string[]> = {
  wrench: [
    "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 2-3.2Z",
  ],
  spring: [
    "M4 12c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3",
    "M10 12c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3",
    "M16 12c0-2 1.5-3 3-3s2 1 2 3",
  ],
  opener: ["M7 4h10v12H7z", "M10 7.5h4", "M12 11v.01", "M9 20h6", "M12 16v4"],
  install: ["M3 10.5 12 4l9 6.5V20H3v-9.5Z", "M7 13h10M7 16.5h10"],
  maintenance: [
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
    "M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7",
  ],
  emergency: ["M13 2 4 14h6l-1 8 9-12h-6l1-8Z"],
  local: [
    "M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z",
    "M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
  ],
  compare: ["M4 5h7v14H4z", "M13 5h7v8h-7z", "M13 16h7v3h-7z"],
  free: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "M9.5 12.5l1.8 1.8 3.6-4"],
  real: ["M4 20V8l4-4h8l4 4v12", "M4 20h16", "M9.5 20v-5h5v5"],
};

export function LineIcon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths = SERVICE_PATHS[name] ?? SERVICE_PATHS.wrench;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {paths.map((d) => (
        <Path key={d} d={d} />
      ))}
    </svg>
  );
}

export function Stars({
  rating = 5,
  className = "",
}: {
  rating?: number;
  className?: string;
}) {
  const display =
    rating >= 4.5 ? "★★★★★" : rating >= 3.5 ? "★★★★☆" : "★★★☆☆";
  return (
    <span
      className={`text-star tracking-[1px] ${className}`}
      aria-label={`${rating} stars`}
    >
      {display}
    </span>
  );
}
