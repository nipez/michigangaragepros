import Link from "next/link";
import { getCityBySlug } from "@/data/cities";
import {
  getCompaniesForCity,
  getCompanyCountForCity,
} from "@/data/companies";
import { REGIONS, type Region } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { getCitiesByRegion } from "@/data/cities";
import { CompanyCard, BeFeaturedCard } from "./CompanyCard";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";
import { MichiganRegionMap } from "./MichiganRegionMap";
import { PinIcon } from "./Icons";

export function RegionPage({ region }: { region: Region }) {
  const byRegion = getCitiesByRegion();
  const cities = (byRegion[region.name] ?? [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const hubCities = region.hubCitySlugs
    .map((slug) => getCityBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const companyBySlug = new Map<string, ReturnType<typeof getCompaniesForCity>[number]>();
  for (const city of cities) {
    for (const company of getCompaniesForCity(city.slug)) {
      if (!companyBySlug.has(company.slug)) {
        companyBySlug.set(company.slug, company);
      }
    }
  }
  const sampleCompanies = [...companyBySlug.values()]
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name))
    .slice(0, 4);
  const hasPaidFeatured = sampleCompanies.some((c) => c.featured);

  return (
    <>
      <Header active="cities" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/cities/" className="on-dark-link">
              Cities
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">{region.title}</span>
          </div>
          <div
            data-two-col="1"
            className="grid items-center gap-10"
            style={{ gridTemplateColumns: "1.15fr 0.85fr" }}
          >
            <div>
              <div className="mb-4 inline-flex rounded-full border border-[rgba(124,192,244,0.35)] bg-[rgba(124,192,244,0.12)] px-3 py-1.5 text-[13px] font-semibold text-[#A8D4F5]">
                {cities.length} cities in our directory
              </div>
              <h1 className="mb-3.5 max-w-[18ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
                Garage Door Pros in {region.title}
              </h1>
              <p className="mb-6 max-w-[52ch] text-lg leading-[1.55] text-hero-muted text-pretty">
                {region.tagline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/pros/?q=${encodeURIComponent(hubCities[0]?.name ?? region.name)}`}
                  className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
                >
                  Find Local Pros →
                </Link>
                <Link
                  href="#region-cities"
                  className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-[26px] py-3.5 text-[15.5px] font-bold text-white hover:bg-white/8"
                >
                  Browse Cities
                </Link>
              </div>
            </div>
            <MichiganRegionMap activeSlug={region.slug} />
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <div
          data-two-col="1"
          className="grid items-start gap-12"
          style={{ gridTemplateColumns: "1.2fr 0.8fr" }}
        >
          <div>
            <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
              About {region.title}
            </h2>
            <p className="mb-4 text-[16.5px] leading-[1.7] text-muted text-pretty">
              {region.description}
            </p>
            <p className="m-0 text-[15px] leading-[1.65] text-body-secondary">
              <span className="font-bold text-navy">Coverage focus: </span>
              {region.coverageNote}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-bg p-6">
            <h3 className="mb-3 text-base font-extrabold text-navy">
              Why homeowners search here
            </h3>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {region.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[14.5px] leading-[1.5] text-text"
                >
                  <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-success-bg text-xs font-extrabold text-success">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
          Common Garage Door Needs in {region.name} Michigan
        </h2>
        <p className="mb-6 max-w-[60ch] text-[15.5px] leading-[1.6] text-muted">
          These are the issues local homeowners look up most often before
          comparing companies in {region.title}.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {region.commonIssues.map((issue) => (
            <div
              key={issue}
              className="rounded-xl border border-border bg-white px-[18px] py-4 text-[15px] font-semibold text-text"
            >
              {issue}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}/`}
              className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {sampleCompanies.length > 0 ? (
        <section className="container-site pt-[72px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
                Sample Pros Serving {region.name} Michigan
              </h2>
              <p className="mt-2 mb-0 text-[15px] text-muted">
                A rotating look at companies that cover cities in this region.
              </p>
            </div>
            <Link href="/companies/" className="text-[15px] font-bold">
              Browse all companies →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {!hasPaidFeatured && <BeFeaturedCard cityName={region.title} />}
            {sampleCompanies.map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="region-cities" className="container-site pt-[72px]">
        <div className="mb-8">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Cities in {region.title}
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.6] text-muted">
            Open a city page to see companies that list that market in their
            primary location or service area.
          </p>
        </div>
        {hubCities.length > 0 ? (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-[1px] text-faint">
              Hub markets
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {hubCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}/`}
                  className="rounded-full border-[1.5px] border-bright-blue/35 bg-[rgba(47,128,237,0.06)] px-4 py-2 text-sm font-bold text-michigan-blue"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
          {cities.map((city) => {
            const count = getCompanyCountForCity(city.slug);
            return (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}/`}
                className="city-chip !justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  <PinIcon className="shrink-0 text-faint" />
                  {city.name}
                </span>
                <span className="text-[12px] font-semibold text-faint">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <h3 className="mb-4 text-lg font-extrabold text-navy">
          Explore other Michigan regions
        </h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
          {REGIONS.filter((r) => r.slug !== region.slug).map((r) => (
            <Link
              key={r.slug}
              href={`/regions/${r.slug}/`}
              className="rounded-xl border border-border bg-white px-4 py-4 transition-colors hover:border-bright-blue hover:text-inherit"
            >
              <div className="mb-1 text-[15px] font-extrabold text-navy">
                {r.title}
              </div>
              <div className="text-[13px] text-muted">{r.tagline}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site my-[72px] mb-[88px]">
        <CtaBand
          title={`Need Garage Door Help in ${region.title}?`}
          subtitle="Enter your ZIP to see local companies, or request a quote if you'd rather get matched."
          primaryLabel="Find Local Pros →"
          primaryHref="/pros/"
          secondaryLabel="Get a Free Quote"
          secondaryHref="/get-a-quote/"
        />
      </section>

      <CompactFooter />
    </>
  );
}
