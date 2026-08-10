import Link from "next/link";
import { getTopCompanies } from "@/data/companies";
import { CITIES } from "@/data/cities";
import { SERVICES, type Service } from "@/data/services";
import { COMMON_PROBLEMS } from "@/data/site";
import { BeFeaturedCard, CompanyCard } from "./CompanyCard";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";

const CITY_LINKS = [
  "Detroit",
  "Grand Rapids",
  "Lansing",
  "Ann Arbor",
  "Traverse City",
  "Kalamazoo",
];

export function ServicePage({ service }: { service: Service }) {
  const topCompanies = getTopCompanies(3);
  const related = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Header active="services" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#E8F1F8]">{service.name}</span>
          </div>
          <h1 className="mb-3.5 max-w-[22ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            {service.heroTitle}
          </h1>
          <p className="mb-[30px] max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            {service.heroSub}
          </p>
          <div className="max-w-[640px] rounded-[14px] bg-white p-4 shadow-[0_24px_60px_rgba(4,16,28,0.45)]">
            <form
              data-form-row="1"
              className="flex gap-2.5"
              action="/get-a-quote/"
            >
              <input type="hidden" name="service" value={service.name} />
              <input
                name="zip"
                placeholder="ZIP code or city"
                className="field-input flex-1"
              />
              <Link
                href={`/get-a-quote/?service=${encodeURIComponent(service.name)}`}
                className="on-dark-solid flex h-[50px] shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] bg-bright-blue px-[26px] text-[15px] font-extrabold text-white hover:bg-michigan-blue"
              >
                {service.findLabel}
              </Link>
            </form>
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <div
          data-two-col="1"
          className="grid items-start gap-12"
          style={{ gridTemplateColumns: "0.9fr 1.1fr" }}
        >
          <div>
            <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
              Common Garage Door Problems
            </h2>
            <p className="m-0 text-base leading-[1.6] text-muted text-pretty">
              Not sure what&apos;s wrong? These are the issues Michigan
              homeowners request repair help for most often. A local pro can
              diagnose the exact cause on-site.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
            {COMMON_PROBLEMS.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-border bg-white px-[18px] py-4 text-[15px] font-semibold text-text"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Companies Offering {service.name}
          </h2>
          <span className="text-[13px] text-faint">
            Top-rated Michigan companies
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <BeFeaturedCard />
          {topCompanies.map((c) => (
            <CompanyCard key={c.slug} company={c} compact />
          ))}
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <div
          data-two-col="1"
          className="grid items-start gap-12"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <div>
            <h3 className="mb-[18px] text-xl font-extrabold text-navy">
              Related Services
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}/`}
                  className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-[18px] text-xl font-extrabold text-navy">
              {service.name} by City
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {CITY_LINKS.map((name) => {
                const city = CITIES.find((c) => c.name === name);
                return (
                  <Link
                    key={name}
                    href={`/cities/${city?.slug ?? ""}/`}
                    className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-site my-[72px] mb-[88px]">
        <CtaBand title={service.ctaTitle} subtitle={service.ctaSub} />
      </section>

      <CompactFooter />
    </>
  );
}
