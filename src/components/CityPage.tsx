import Link from "next/link";
import type { City } from "@/data/cities";
import { citySlug, getCityBySlug } from "@/data/cities";
import { getCompaniesForCity } from "@/data/companies";
import { SERVICES } from "@/data/services";
import { CompanyRow } from "./CompanyCard";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";

export function CityPage({ city }: { city: City }) {
  const companies = getCompaniesForCity(city.slug);

  return (
    <>
      <Header active="cities" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5 text-[#8AA3B8]">/</span>
            <Link href="/cities/" className="on-dark-link">
              Cities
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">{city.name}</span>
          </div>
          <h1 className="mb-3.5 max-w-[24ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Garage Door Pros in {city.name}, {city.state}
          </h1>
          <p className="mb-[30px] max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Compare garage-door companies serving {city.name} and nearby
            communities — repair, springs, openers, installation, and emergency
            service.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/get-a-quote/"
              className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
            >
              Get a Free Quote →
            </Link>
            <Link
              href="#city-pros"
              className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-[26px] py-3.5 text-[15.5px] font-bold text-white hover:bg-white/8"
            >
              Browse Companies
            </Link>
          </div>
        </div>
      </section>

      <section id="city-pros" className="container-site pt-[72px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Companies Serving {city.name}
          </h2>
          <span className="text-[13px] text-faint">
            {companies.length}{" "}
            {companies.length === 1 ? "company" : "companies"} listed
          </span>
        </div>
        {companies.length > 0 ? (
          <div className="grid gap-4">
            {companies.map((c) => (
              <CompanyRow key={c.slug} company={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-8 text-[15.5px] leading-[1.6] text-muted">
            We&apos;re still adding companies for {city.name}.{" "}
            <Link href="/get-a-quote/" className="font-bold text-michigan-blue">
              Request a free quote
            </Link>{" "}
            and we&apos;ll match you with pros nearby, or{" "}
            <Link href="/companies/" className="font-bold text-michigan-blue">
              browse all Michigan companies
            </Link>
            .
          </div>
        )}
      </section>

      <section className="container-site pt-[72px]">
        <div
          data-two-col="1"
          className="grid items-start gap-12"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <div>
            <h3 className="mb-[18px] text-xl font-extrabold text-navy">
              Services in {city.name}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}/`}
                  className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  {s.name === "Broken Springs"
                    ? "Broken Spring Repair"
                    : s.name === "Garage Door Openers"
                      ? "Opener Repair"
                      : s.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-[18px] text-xl font-extrabold text-navy">
              Nearby Communities
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {city.nearby.map((n) => {
                const nearby = getCityBySlug(citySlug(n));
                if (nearby) {
                  return (
                    <Link
                      key={n}
                      href={`/cities/${nearby.slug}/`}
                      className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                    >
                      {n}
                    </Link>
                  );
                }
                return (
                  <span
                    key={n}
                    className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text"
                  >
                    {n}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-site my-[72px] mb-[88px]">
        <CtaBand
          title={`Need Garage Door Help in ${city.name}?`}
          subtitle="Tell us what you need — we'll match you with local pros serving your neighborhood."
        />
      </section>

      <CompactFooter />
    </>
  );
}
