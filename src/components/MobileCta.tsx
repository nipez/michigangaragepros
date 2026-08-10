"use client";

import Link from "next/link";

export function MobileCta({
  onClick,
  href = "/get-a-quote/",
}: {
  onClick?: () => void;
  href?: string;
}) {
  return (
    <div
      data-mobile-cta="1"
      className="fixed bottom-0 left-0 right-0 z-[60] hidden border-t border-border bg-[rgba(255,255,255,0.97)] px-4 py-3 shadow-[0_-8px_24px_rgba(16,42,67,0.08)]"
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="w-full rounded-xl border-none bg-bright-blue py-[15px] text-base font-extrabold text-white"
        >
          Find a Garage Door Pro
        </button>
      ) : (
        <Link
          href={href}
          className="block w-full rounded-xl bg-bright-blue py-[15px] text-center text-base font-extrabold text-white hover:text-white"
        >
          Find a Garage Door Pro
        </Link>
      )}
    </div>
  );
}
