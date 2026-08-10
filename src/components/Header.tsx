"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { MenuIcon } from "./Icons";

const NAV = [
  { href: "/pros/", label: "Find a Pro", id: "pros" },
  { href: "/garage-door-repair/", label: "Services", id: "services" },
  { href: "/cities/", label: "Cities", id: "cities" },
  { href: "/#how", label: "How It Works", id: "how" },
  { href: "/for-companies/", label: "For Companies", id: "for-companies" },
] as const;

type HeaderProps = {
  active?: (typeof NAV)[number]["id"];
  onQuoteClick?: () => void;
  quoteHref?: string;
  claimHref?: string;
};

export function Header({
  active,
  onQuoteClick,
  quoteHref = "/get-a-quote/",
  claimHref = "/for-companies/#claim",
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const quoteButton = onQuoteClick ? (
    <button type="button" onClick={onQuoteClick} className="btn-primary">
      Get a Free Quote
    </button>
  ) : (
    <Link href={quoteHref} className="btn-primary">
      Get a Free Quote
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[rgba(255,255,255,0.96)] backdrop-blur-[8px]">
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Logo />
        <nav
          data-nav-links="1"
          className="hidden items-center gap-1 font-semibold lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-pill ${active === item.id ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            data-nav-claim="1"
            href={claimHref}
            className="btn-outline hidden lg:inline-flex"
          >
            Claim Your Page
          </Link>
          {quoteButton}
          <button
            data-hamburger="1"
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="hidden size-[42px] items-center justify-center rounded-[10px] border-[1.5px] border-input-border bg-white"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`nav-pill ${active === item.id ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={claimHref}
              className="nav-pill"
              onClick={() => setOpen(false)}
            >
              Claim Your Page
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function QuoteHeader() {
  return (
    <header className="border-b border-border bg-white">
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Logo />
        <Link
          href="/"
          className="text-sm font-bold text-muted transition-colors hover:text-michigan-blue"
        >
          ✕ &nbsp;Exit
        </Link>
      </div>
    </header>
  );
}
