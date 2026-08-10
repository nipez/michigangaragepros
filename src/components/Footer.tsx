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
                <Link
                  key={s.slug}
                  href={`/${s.slug}/`}
                  className="text-footer-link hover:text-white"
                >
                  {s.name === "Broken Springs"
                    ? "Broken Spring Repair"
                    : s.name === "Garage Door Openers"
                      ? "Garage Door Opener Repair"
                      : s.name === "Garage Door Installation"
                        ? "Installation"
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
                    className="text-footer-link hover:text-white"
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
              <Link href="/companies/" className="text-footer-link hover:text-white">
                Browse Companies
              </Link>
              <Link href="/for-companies/#claim" className="text-footer-link hover:text-white">
                Claim Your Profile
              </Link>
              <Link href="/for-companies/" className="text-footer-link hover:text-white">
                Contractor Login
              </Link>
              <Link href="/for-companies/" className="text-footer-link hover:text-white">
                Get More Leads
              </Link>
              <Link href="/for-companies/#featured" className="text-footer-link hover:text-white">
                Featured Listings
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1px] text-footer-accent">
              Company
            </div>
            <div className="grid gap-[9px] text-sm">
              <Link href="/#how" className="text-footer-link hover:text-white">
                About
              </Link>
              <Link href="/get-a-quote/" className="text-footer-link hover:text-white">
                Contact
              </Link>
              <Link href="/#how" className="text-footer-link hover:text-white">
                How It Works
              </Link>
              <span className="text-[#8AA3B8]">Privacy</span>
              <span className="text-[#8AA3B8]">Terms</span>
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
            <Link href="/#pros" className="text-footer-link hover:text-white">
              Find a Pro
            </Link>
            <Link
              href="/garage-door-repair/"
              className="text-footer-link hover:text-white"
            >
              Services
            </Link>
            <Link href="/cities/" className="text-footer-link hover:text-white">
              Cities
            </Link>
            <Link href="/for-companies/" className="text-footer-link hover:text-white">
              For Companies
            </Link>
            <Link href="/#how" className="text-footer-link hover:text-white">
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
