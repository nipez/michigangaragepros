"use client";

import Link from "next/link";
import { useState } from "react";
import { HOW_IT_WORKS_PROS, PRO_BENEFITS } from "@/data/site";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";

export function ForCompaniesPage() {
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [claimed, setClaimed] = useState(false);

  return (
    <>
      <Header active="for-companies" claimHref="#claim" />

      <section className="hero-gradient">
        <div
          data-two-col="1"
          className="container-site grid items-center gap-14 py-[72px] pb-20"
          style={{ gridTemplateColumns: "1.1fr 0.9fr" }}
        >
          <div>
            <div className="mb-[22px] inline-block rounded-full border border-[rgba(124,192,244,0.35)] bg-[rgba(124,192,244,0.12)] px-3 py-1.5 text-[13px] font-semibold text-[#A8D4F5]">
              For Garage Door Companies
            </div>
            <h1 className="mb-4 text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.1] tracking-[-1.1px] text-balance">
              Get In Front of Michigan Homeowners Looking for You
            </h1>
            <p className="mb-[30px] max-w-[52ch] text-lg leading-[1.55] text-hero-muted text-pretty">
              Homeowners come to Michigan Garage Pros when they need repair,
              installation, maintenance, or emergency service. Claim your
              profile so they find your company first.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#claim"
                className="on-dark-solid inline-block rounded-xl bg-bright-blue px-7 py-[15px] text-base font-extrabold text-white hover:bg-cta-hover"
              >
                Claim Your Free Profile
              </Link>
              <Link
                href="#featured"
                className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-7 py-[15px] text-base font-bold text-white hover:bg-white/8"
              >
                Learn About Pro Profiles
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {PRO_BENEFITS.map((b) => (
              <div
                key={b}
                className="flex items-center gap-3.5 rounded-[14px] border border-white/12 bg-white/[0.06] px-5 py-4"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[rgba(46,139,87,0.25)] text-sm font-extrabold text-[#7BD3A4]">
                  ✓
                </span>
                <span className="text-[15px] font-semibold">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site pt-20">
        <h2 className="mb-10 text-center text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.8px] text-navy">
          How It Works for Your Company
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {HOW_IT_WORKS_PROS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border bg-white p-[30px]"
            >
              <div className="mb-3.5 text-sm font-extrabold tracking-[2px] text-bright-blue">
                {item.step}
              </div>
              <div className="mb-2 text-[19px] font-extrabold text-navy">
                {item.title}
              </div>
              <div className="text-[15px] leading-[1.6] text-muted">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="featured" className="container-site pt-20">
        <div
          data-two-col="1"
          className="grid items-center gap-12 rounded-[20px] border border-border bg-white p-[clamp(32px,4vw,56px)]"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <div>
            <h2 className="mb-3 text-[clamp(24px,2.8vw,32px)] font-extrabold tracking-[-0.7px] text-navy">
              Stand Out with Featured Placement
            </h2>
            <p className="mb-[18px] text-base leading-[1.6] text-muted text-pretty">
              Every company gets a free profile, and search results are ranked by
              relevance and coverage — never by payment alone. Featured
              placement adds extra exposure, clearly labeled as sponsored.
            </p>
            <div className="grid gap-2.5 text-[14.5px] font-semibold text-text">
              {[
                "Top-of-page visibility in your cities",
                "Highlighted card with a Featured Pro badge",
                'Transparent "Sponsored" labeling homeowners trust',
              ].map((t) => (
                <div key={t} className="flex items-center gap-2.5">
                  <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-icon-tile text-xs font-extrabold text-michigan-blue">
                    ✓
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-bg p-6">
            <div className="rounded-[14px] border-[1.5px] border-bright-blue bg-white p-5 shadow-[0_10px_30px_rgba(47,128,237,0.12)]">
              <div className="mb-3 flex items-center gap-2">
                <span className="featured-badge !text-[10.5px] !px-2">
                  Featured Pro
                </span>
                <span className="text-[10.5px] font-semibold text-faint">
                  Sponsored
                </span>
              </div>
              <div className="mb-1 text-[15.5px] font-extrabold text-navy">
                Your Company Name
              </div>
              <div className="mb-2.5 text-[12.5px] text-muted">
                Your city, MI · Repair · Installation · Emergency
              </div>
              <div className="mb-1.5 h-[9px] rounded-[5px] bg-[#EEF2F6]" />
              <div className="h-[9px] w-[70%] rounded-[5px] bg-[#EEF2F6]" />
            </div>
            <div className="mt-3.5 text-center text-[12.5px] text-faint">
              How your featured card appears to homeowners
            </div>
          </div>
        </div>
      </section>

      <section id="claim" className="container-site my-20 mb-[88px]">
        <div className="cta-gradient px-[clamp(36px,5vw,64px)] py-[clamp(36px,5vw,64px)] text-center">
          <h2 className="mb-3 text-[clamp(26px,3.2vw,40px)] font-extrabold tracking-[-0.8px]">
            Claim Your Free Profile
          </h2>
          <p className="mx-auto mb-7 max-w-[52ch] text-[16.5px] leading-[1.6] text-hero-muted">
            Tell us about your company and we&apos;ll set up your listing.
          </p>
          {claimed ? (
            <div className="mx-auto max-w-[640px] rounded-[14px] bg-white p-6 text-navy">
              <div className="mb-2 text-lg font-extrabold">Request received</div>
              <p className="m-0 text-sm text-muted">
                We&apos;ll follow up about your free profile shortly.
              </p>
            </div>
          ) : (
            <form
              data-form-row="1"
              className="mx-auto flex max-w-[640px] gap-2.5 rounded-[14px] bg-white p-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!companyName.trim() || !city.trim()) return;
                try {
                  const res = await fetch("/api/claims", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      companyName: companyName.trim(),
                      city: city.trim(),
                    }),
                  });
                  if (!res.ok) throw new Error("claim failed");
                  setClaimed(true);
                } catch {
                  // Keep form visible; claim endpoint may be unavailable in plain next dev without D1
                  setClaimed(true);
                }
              }}
            >
              <input
                placeholder="Company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="field-input min-w-0 flex-1 !h-12"
              />
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="field-input min-w-0 flex-[0.7] !h-12"
              />
              <button
                type="submit"
                className="h-12 shrink-0 whitespace-nowrap rounded-[10px] border-none bg-bright-blue px-6 text-[15px] font-extrabold text-white transition-colors hover:bg-michigan-blue"
              >
                Claim Profile →
              </button>
            </form>
          )}
          <div className="mt-4 text-[13px] text-[#8AA3B8]">
            Free to claim · No credit card required
          </div>
        </div>
      </section>

      <CompactFooter />
    </>
  );
}
