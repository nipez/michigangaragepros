import Link from "next/link";

type CtaBandProps = {
  title: string;
  subtitle: string;
  primaryLabel?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CtaBand({
  title,
  subtitle,
  primaryLabel = "Get a Free Quote →",
  primaryHref = "/get-a-quote/",
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <div className="cta-gradient px-[clamp(32px,4.5vw,56px)] py-[clamp(32px,4.5vw,56px)] text-center">
      <h2 className="mb-3 text-[clamp(26px,3vw,38px)] font-extrabold tracking-[-0.8px]">
        {title}
      </h2>
      <p className="mx-auto mb-[26px] max-w-[50ch] text-[16.5px] leading-[1.6] text-hero-muted">
        {subtitle}
      </p>
      <div className="flex flex-wrap justify-center gap-3.5">
        {onPrimaryClick ? (
          <button
            type="button"
            onClick={onPrimaryClick}
            className="rounded-xl border-none bg-bright-blue px-7 py-[15px] text-base font-extrabold text-white transition-colors hover:bg-cta-hover"
          >
            {primaryLabel}
          </button>
        ) : (
          <Link
            href={primaryHref}
            className="on-dark-solid inline-block rounded-xl bg-bright-blue px-7 py-[15px] text-base font-extrabold text-white transition-colors hover:bg-cta-hover"
          >
            {primaryLabel}
          </Link>
        )}
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-7 py-[15px] text-base font-bold text-white transition-colors hover:bg-white/8"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
