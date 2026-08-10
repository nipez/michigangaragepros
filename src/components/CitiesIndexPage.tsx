import Link from "next/link";
import { CITIES, getCitiesByRegion } from "@/data/cities";
import { getCompanyCountForCity } from "@/data/companies";
import { REGIONS, regionSlugFromName } from "@/data/regions";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { PinIcon } from "./Icons";
import { CtaBand } from "./CtaBand";
import { MichiganRegionMap } from "./MichiganRegionMap";

export function CitiesIndexPage() {
  const byRegion = getCitiesByRegion();
  const regions = REGIONS.filter((r) => byRegion[r.name]?.length);

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
            <span className="text-[#E8F1F8]">Cities</span>
          </div>
          <div
            data-two-col="1"
            className="grid items-center gap-10"
            style={{ gridTemplateColumns: "1.1fr 0.9fr" }}
          >
            <div>
              <h1 className="mb-3.5 max-w-[22ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
                Garage Door Pros by Michigan City
              </h1>
              <p className="mb-[30px] max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
                Browse {CITIES.length} Michigan markets — or start with a region
                page to see where coverage sits across the state.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pros/"
                  className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
                >
                  Find Pros by ZIP →
                </Link>
                <Link
                  href="#regions"
                  className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-[26px] py-3.5 text-[15.5px] font-bold text-white hover:bg-white/8"
                >
                  Browse Regions
                </Link>
              </div>
            </div>
            <MichiganRegionMap />
          </div>
        </div>
      </section>

      <section id="regions" className="container-site pt-[72px]">
        <div className="mb-8">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Michigan Regions
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.6] text-muted">
            Each region page highlights coverage on the map, common local
            issues, and the cities we list there.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {regions.map((region) => {
            const count = byRegion[region.name]?.length ?? 0;
            return (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}/`}
                className="rounded-2xl border border-border bg-white p-6 transition-colors hover:border-bright-blue hover:text-inherit"
              >
                <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[1px] text-faint">
                  {count} cities
                </div>
                <div className="mb-2 text-lg font-extrabold text-navy">
                  {region.title}
                </div>
                <p className="m-0 text-[14.5px] leading-[1.55] text-muted">
                  {region.tagline}
                </p>
                <div className="mt-4 text-[14px] font-bold text-michigan-blue">
                  Explore region →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-site py-[72px]">
        <div className="mb-10">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            All Michigan Cities
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.6] text-muted">
            Choose a city to see companies that list that market in their
            primary location or service area.
          </p>
        </div>

        <div className="grid gap-12">
          {regions.map((region) => (
            <div key={region.slug}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <h3 className="m-0 text-lg font-extrabold text-navy">
                  {region.title}
                </h3>
                <Link
                  href={`/regions/${regionSlugFromName(region.name)}/`}
                  className="text-[14px] font-bold text-michigan-blue"
                >
                  Region guide →
                </Link>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
                {byRegion[region.name]
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((city) => {
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
            </div>
          ))}
        </div>
      </section>

      <section className="container-site mb-[88px]">
        <CtaBand
          title="Don't See Your City?"
          subtitle="Enter your ZIP to browse nearby companies, or request a quote if you'd rather get matched."
          primaryLabel="Find Pros by ZIP →"
          primaryHref="/pros/"
          secondaryLabel="Get a Free Quote"
          secondaryHref="/get-a-quote/"
        />
      </section>

      <CompactFooter />
    </>
  );
}
