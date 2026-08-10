import Link from "next/link";
import { LogoMark } from "./Icons";

export function Logo({
  href = "/",
  compact = false,
  footer = false,
}: {
  href?: string;
  compact?: boolean;
  footer?: boolean;
}) {
  if (footer) {
    return (
      <Link href={href} className="flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-lg bg-[rgba(124,192,244,0.15)]">
          <LogoMark size={18} />
        </div>
        <div className="text-[15px] font-extrabold text-white sm:text-base">
          Michigan Garage Pros
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-2.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-navy">
        <LogoMark size={20} />
      </div>
      {!compact && (
        <div className="whitespace-nowrap text-lg font-extrabold tracking-[-0.2px] max-[420px]:hidden">
          <span className="text-navy">Michigan</span>{" "}
          <span className="text-michigan-blue">Garage Pros</span>
        </div>
      )}
    </Link>
  );
}
