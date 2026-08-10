import Link from "next/link";
import { CITIES, getCitiesByRegion } from "@/data/cities";
import { getCompaniesForCity } from "@/data/companies";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { PinIcon } from "./Icons";
import { CtaBand } from "./CtaBand";

const REGION_ORDER = [
  "Southeast",
  "West",
  "Central",
  "Southwest",
  "North",
  "Upper Peninsula",
];

export function CitiesIndexPage() {
  const byRegion = getCitiesByRegion();
  const regions = REGION_ORDER.filter((r) => byRegion[r]?.length);

  return (
    <>
      <Header active="cities" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="text-[#8AA3B8] hover:text-white">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">Cities</span>
          </div>
          <h1 className="mb-3.5 max-w-[22ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Garage Door Pros by Michigan City
          </h1>
          <p className="mb-[30px] max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Browse {CITIES.length} Michigan markets — from Detroit and Grand
            Rapids to Traverse City and the Upper Peninsula — and compare local
            garage door companies serving your area.
          </p>
          <Link
            href="/get-a-quote/"
            className="inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover hover:text-white"
          >
            Get a Free Quote →
          </Link>
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
            <div key={region}>
              <h3 className="mb-4 text-lg font-extrabold text-navy">
                {region} Michigan
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
                {byRegion[region]
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((city) => {
                    const count = getCompaniesForCity(city.slug).length;
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
          subtitle="Tell us where you need help — we'll match you with Michigan garage door pros serving your ZIP."
        />
      </section>

      <CompactFooter />
    </>
  );
}
