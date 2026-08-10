"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getHomepageCities } from "@/data/cities";
import {
  getFeaturedCompany,
  getOrganicCompanies,
} from "@/data/companies";
import { SERVICES } from "@/data/services";
import {
  HOW_IT_WORKS,
  PRO_BENEFITS,
  SERVICE_OPTIONS,
  TRUST_POINTS,
} from "@/data/site";
import { CompanyCard } from "./CompanyCard";
import { CtaBand } from "./CtaBand";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { KeyIcon, LineIcon, PinIcon } from "./Icons";
import { LeadModal } from "./LeadModal";
import { MobileCta } from "./MobileCta";
import type { Lead } from "@/lib/lead";

export function HomePage() {
  const [heroService, setHeroService] = useState("");
  const [heroLoc, setHeroLoc] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [modalLead, setModalLead] = useState<Partial<Lead>>({});

  const featured = getFeaturedCompany();
  const organics = getOrganicCompanies(3);
  const canFind = !!heroLoc.trim();

  const openQuote = (lead: Partial<Lead> = {}, step = 1) => {
    setModalLead(lead);
    setModalStep(step);
    setModalOpen(true);
  };

  const heroFind = () => {
    if (!canFind) return;
    openQuote(
      { service: heroService, zip: heroLoc },
      heroService ? 2 : 1,
    );
  };

  return (
    <>
      <Header onQuoteClick={() => openQuote()} />

      <section className="hero-gradient">
        <div
          data-hero-grid="1"
          className="container-site grid items-center gap-14 py-[72px] pb-[84px]"
          style={{ gridTemplateColumns: "1.05fr 0.95fr" }}
        >
          <div>
            <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[rgba(124,192,244,0.35)] bg-[rgba(124,192,244,0.12)] px-3 py-1.5 text-[13px] font-semibold text-[#A8D4F5]">
              <PinIcon size={13} />
              Serving homeowners across Michigan
            </div>
            <h1 className="mb-4 text-[clamp(36px,4.4vw,58px)] font-extrabold leading-[1.08] tracking-[-1.2px] text-balance">
              Find a Trusted Garage Door Pro in Michigan
            </h1>
            <p className="mb-8 max-w-[52ch] text-[19px] leading-[1.55] text-hero-muted text-pretty">
              Compare local garage-door companies, see services and reviews, and
              connect with a professional in your area.
            </p>
            <div className="rounded-2xl bg-white p-[22px] shadow-[0_24px_60px_rgba(4,16,28,0.45)]">
              <div data-form-row="1" className="flex items-end gap-3">
                <label className="block flex-[1.2]">
                  <span className="mb-[7px] block text-[13px] font-bold text-navy">
                    What do you need help with?
                  </span>
                  <select
                    value={heroService}
                    onChange={(e) => setHeroService(e.target.value)}
                    className="field-input cursor-pointer"
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block flex-1">
                  <span className="mb-[7px] block text-[13px] font-bold text-navy">
                    Where are you located?
                  </span>
                  <input
                    value={heroLoc}
                    onChange={(e) => setHeroLoc(e.target.value)}
                    placeholder="ZIP code or city"
                    className="field-input"
                  />
                </label>
                <button
                  type="button"
                  onClick={heroFind}
                  disabled={!canFind}
                  className="h-[50px] shrink-0 rounded-[10px] border-none px-[26px] text-[15px] font-extrabold text-white transition-colors"
                  style={{
                    background: canFind ? "#2F80ED" : "#B9CDDE",
                    cursor: canFind ? "pointer" : "default",
                  }}
                >
                  Find Pros →
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-[18px] text-[13.5px] font-semibold text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="font-extrabold text-success">✓</span> Local
                  companies
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-extrabold text-success">✓</span> Compare
                  services
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-extrabold text-success">✓</span> Free to
                  homeowners
                </span>
              </div>
            </div>
          </div>
          <div data-hero-img="1" className="relative min-h-[460px]">
            <div className="absolute inset-0 overflow-hidden rounded-[18px]">
              <Image
                src="/hero-collage.png"
                alt="Garage door technician serving a Michigan home"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1020px) 100vw, 560px"
              />
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_12px_32px_rgba(4,16,28,0.35)]">
              <div className="grid size-[38px] place-items-center rounded-[10px] bg-icon-tile">
                <KeyIcon size={20} />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-navy">
                  Local pro on the way
                </div>
                <div className="text-xs text-muted">
                  Same-day options in most cities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container-site pt-[88px]">
        <div className="mx-auto mb-11 max-w-[60ch] text-center">
          <h2 className="mb-3 text-[clamp(28px,3vw,38px)] font-extrabold tracking-[-0.8px] text-navy">
            What Do You Need Help With?
          </h2>
          <p className="m-0 text-[17px] text-muted">
            Pick a service to see local companies that can help.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          {SERVICES.map((svc) => (
            <Link key={svc.slug} href={`/${svc.slug}/`} className="service-card">
              <div className="mb-4 grid size-[46px] place-items-center rounded-xl bg-icon-tile text-michigan-blue">
                <LineIcon name={svc.icon} />
              </div>
              <div className="mb-1.5 text-lg font-bold text-navy">{svc.name}</div>
              <div className="text-[14.5px] leading-[1.55] text-muted text-pretty">
                {svc.desc}
              </div>
              <div className="mt-3.5 text-sm font-bold text-michigan-blue">
                Find pros →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="pros" className="container-site pt-[88px]">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="mb-2.5 text-[clamp(28px,3vw,38px)] font-extrabold tracking-[-0.8px] text-navy">
              Garage Door Pros Near You
            </h2>
            <p className="m-0 text-base text-muted">
              Local Michigan companies — compare ratings, services, and service
              areas across the state.
            </p>
          </div>
          <Link href="/companies/" className="text-[15px] font-bold">
            Browse all companies →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          <CompanyCard
            company={featured}
            onQuoteClick={() => openQuote()}
          />
          {organics.map((c) => (
            <CompanyCard
              key={c.slug}
              company={c}
              onQuoteClick={() => openQuote()}
            />
          ))}
        </div>
      </section>

      <section id="cities" className="container-site pt-[88px]">
        <div
          data-two-col="1"
          className="grid items-start gap-12"
          style={{ gridTemplateColumns: "0.9fr 1.1fr" }}
        >
          <div>
            <h2 className="mb-3 text-[clamp(28px,3vw,38px)] font-extrabold tracking-[-0.8px] text-navy">
              Find Garage Door Pros by City
            </h2>
            <p className="mb-6 text-[16.5px] leading-[1.6] text-muted text-pretty">
              From Detroit to Traverse City, Michigan Garage Pros covers markets
              across the state. Choose your city to see companies serving your
              area.
            </p>
            <Link href="/cities/" className="btn-navy !px-5 !py-3 !text-[14.5px]">
              View All Michigan Cities →
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
            {getHomepageCities().map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}/`}
                className="city-chip"
              >
                <PinIcon className="shrink-0 text-faint" />
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="container-site pt-[88px]">
        <h2 className="mb-11 text-center text-[clamp(28px,3vw,38px)] font-extrabold tracking-[-0.8px] text-navy">
          Find the Right Garage Door Pro in 3 Steps
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {HOW_IT_WORKS.map((item) => (
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

      <section className="container-site pt-[88px]">
        <div
          data-two-col="1"
          className="grid items-center gap-12"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <div>
            <h2 className="mb-3.5 text-[clamp(28px,3vw,38px)] font-extrabold tracking-[-0.8px] text-navy text-balance">
              A Better Way to Find Local Garage Door Service
            </h2>
            <p className="m-0 text-[16.5px] leading-[1.6] text-muted text-pretty">
              One place to see who serves your city, what they do, and what other
              homeowners say — instead of calling down a list.
            </p>
          </div>
          <div className="grid gap-3.5">
            {TRUST_POINTS.map((tp) => (
              <div
                key={tp.id}
                className="flex gap-4 rounded-[14px] border border-border bg-white px-5 py-[18px]"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-icon-tile text-michigan-blue">
                  <LineIcon name={tp.id} size={22} />
                </div>
                <div>
                  <div className="mb-0.5 text-base font-extrabold text-navy">
                    {tp.title}
                  </div>
                  <div className="text-[14.5px] leading-[1.55] text-muted">
                    {tp.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site mt-[88px]">
        <CtaBand
          title="Need Garage Door Help?"
          subtitle="Tell us what you need and where you're located. We'll help you find garage-door professionals serving your area."
          primaryLabel="Find a Garage Door Pro →"
          onPrimaryClick={() => openQuote()}
          secondaryLabel="Browse Local Companies"
          secondaryHref="#pros"
        />
      </section>

      <section id="companies" className="container-site py-[88px]">
        <div
          data-two-col="1"
          className="grid items-center gap-12 rounded-[20px] border border-border bg-white p-[clamp(32px,4vw,56px)]"
          style={{ gridTemplateColumns: "1.1fr 0.9fr" }}
        >
          <div>
            <div className="mb-[18px] inline-block rounded-full bg-icon-tile px-3 py-1.5 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
              For Garage Door Companies
            </div>
            <h2 className="mb-3 text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.8px] text-navy">
              Own a Garage Door Company?
            </h2>
            <p className="mb-[26px] text-[16.5px] leading-[1.6] text-muted text-pretty">
              Get discovered by Michigan homeowners looking for garage-door
              repair, installation, maintenance, and emergency service.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/for-companies/#claim" className="btn-navy">
                Claim Your Free Profile
              </Link>
              <Link href="/for-companies/#featured" className="btn-outline !rounded-xl !px-6 !py-3.5 !text-[15px]">
                Learn About Pro Profiles
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {PRO_BENEFITS.map((b) => (
              <div
                key={b}
                className="flex items-center gap-3 text-[15px] font-semibold text-text"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success-bg text-[13px] font-extrabold text-success">
                  ✓
                </span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <MobileCta onClick={() => openQuote()} />
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialLead={modalLead}
        initialStep={modalStep}
      />
    </>
  );
}
