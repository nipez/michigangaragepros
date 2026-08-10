import Link from "next/link";
import { Logo } from "./Logo";
import { CITIES } from "@/data/cities";
import { SERVICES } from "@/data/services";

const FOOTER_CITIES = [
  "Detroit",
  "Grand Rapids",
  "Lansing",
  "Ann Arbor",
  "Traverse City",
  "Kalamazoo",
  "Flint",
  "Holland",
];

const FOOTER_LINK =
  "footer-nav-link text-[14px] font-medium transition-colors";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="container-site pb-8 pt-16">
        <div
          data-foot-grid="1"
          className="mb-12 grid gap-9"
          style={{ gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr" }}
        >
          <div>
            <div className="mb-3.5">
              <Logo footer />
            </div>
            <p className="m-0 max-w-[30ch] text-sm leading-[1.6] text-[#8AA3B8]">
              Helping Michigan homeowners find local garage-door professionals.
            </p>
          </div>
          <div>
            <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1px] text-footer-accent">
              Find a Pro
            </div>
            <div className="grid gap-[9px] text-sm">
              {SERVICES.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} className={FOOTER_LINK}>
                  {s.name === "Broken Springs"
                    ? "Broken Spring Repair"
                    : s.name === "Garage Door Openers"
                      ? "Garage Door Opener Repair"
                      : s.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1px] text-footer-accent">
              Popular Cities
            </div>
            <div className="grid gap-[9px] text-sm">
              {FOOTER_CITIES.map((name) => {
                const city = CITIES.find((c) => c.name === name);
                return (
                  <Link
                    key={name}
                    href={`/cities/${city?.slug ?? name.toLowerCase().replace(/\s+/g, "-")}/`}
                    className={FOOTER_LINK}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1px] text-footer-accent">
              For Companies
            </div>
            <div className="grid gap-[9px] text-sm">
              <Link href="/companies/" className={FOOTER_LINK}>
                Browse Companies
              </Link>
              <Link href="/for-companies/#claim" className={FOOTER_LINK}>
                Claim Your Profile
              </Link>
              <Link href="/for-companies/" className={FOOTER_LINK}>
                Contractor Login
              </Link>
              <Link href="/for-companies/" className={FOOTER_LINK}>
                Get More Leads
              </Link>
              <Link href="/for-companies/#featured" className={FOOTER_LINK}>
                Featured Listings
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1px] text-footer-accent">
              Company
            </div>
            <div className="grid gap-[9px] text-sm">
              <Link href="/#how" className={FOOTER_LINK}>
                About
              </Link>
              <Link href="/get-a-quote/" className={FOOTER_LINK}>
                Contact
              </Link>
              <Link href="/#how" className={FOOTER_LINK}>
                How It Works
              </Link>
              <span className="text-[#E8F1F8]">Privacy</span>
              <span className="text-[#E8F1F8]">Terms</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/12 pt-6 text-[13px] text-[#8AA3B8]">
          © 2026 Michigan Garage Pros
        </div>
      </div>
    </footer>
  );
}

export function CompactFooter() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="container-site pb-8 pt-10">
        <div className="mb-[26px] flex flex-wrap items-center justify-between gap-7">
          <Logo footer />
          <div className="flex flex-wrap gap-[22px] text-sm">
            <Link href="/pros/" className={FOOTER_LINK}>
              Find a Pro
            </Link>
            <Link href="/garage-door-repair/" className={FOOTER_LINK}>
              Services
            </Link>
            <Link href="/cities/" className={FOOTER_LINK}>
              Cities
            </Link>
            <Link href="/for-companies/" className={FOOTER_LINK}>
              For Companies
            </Link>
            <Link href="/#how" className={FOOTER_LINK}>
              How It Works
            </Link>
          </div>
        </div>
        <div className="border-t border-white/12 pt-[22px] text-[13px] text-[#8AA3B8]">
          © 2026 Michigan Garage Pros
        </div>
      </div>
    </footer>
  );
}
