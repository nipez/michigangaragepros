import Link from "next/link";
import { getTopCompanies } from "@/data/companies";
import { getCityBySlug } from "@/data/cities";
import { PRIORITY_CITY_SLUGS } from "@/data/growth";
import { SERVICES, type Service } from "@/data/services";
import { COMMON_PROBLEM_GUIDES, COMMON_PROBLEMS } from "@/data/site";
import { BeFeaturedCard, CompanyCard } from "./CompanyCard";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";
import { LineIcon, PinIcon } from "./Icons";
import { ServiceHeroSearch } from "./ServiceHeroSearch";

const PRIORITY_CITIES = PRIORITY_CITY_SLUGS.map((slug) => getCityBySlug(slug)).filter(
  (c): c is NonNullable<typeof c> => Boolean(c),
);

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
          <ServiceHeroSearch
            serviceName={service.name}
            findLabel={service.findLabel}
          />
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
              homeowners hit most often — each opens a practical guide with
              safe checks and when to call a local pro.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
            {COMMON_PROBLEMS.map((p) => {
              const guide = COMMON_PROBLEM_GUIDES[p];
              return (
                <Link
                  key={p}
                  href={`/blog/${guide.slug}/`}
                  className="group rounded-xl border border-border bg-white px-[18px] py-4 no-underline transition-colors hover:border-bright-blue hover:text-inherit"
                >
                  <div className="text-[15px] font-semibold text-text group-hover:text-michigan-blue">
                    {p}
                  </div>
                  <div className="mt-1.5 text-[12.5px] font-semibold text-faint group-hover:text-bright-blue">
                    {guide.blurb} →
                  </div>
                </Link>
              );
            })}
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

      <section className="mt-[72px] border-y border-border bg-bg">
        <div className="container-site py-14 md:py-16">
          <div
            data-two-col="1"
            className="grid items-stretch gap-5 md:gap-6"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <div className="rounded-2xl border border-border bg-white p-6 md:p-7">
              <h3 className="mb-1.5 text-xl font-extrabold text-navy">
                Related Services
              </h3>
              <p className="mb-5 text-[14.5px] leading-[1.55] text-muted">
                Explore other garage-door help Michigan homeowners look for.
              </p>
              <div className="grid gap-2.5">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}/`}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-bg px-3.5 py-3 transition-colors hover:border-bright-blue hover:bg-white hover:text-inherit"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-icon-tile text-michigan-blue">
                      <LineIcon name={s.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1 text-[14.5px] font-bold text-navy group-hover:text-michigan-blue">
                      {s.name}
                    </span>
                    <span
                      aria-hidden
                      className="text-[15px] font-extrabold text-bright-blue transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 md:p-7">
              <h3 className="mb-1.5 text-xl font-extrabold text-navy">
                {service.name} by City
              </h3>
              <p className="mb-5 text-[14.5px] leading-[1.55] text-muted">
                Priority Michigan markets for {service.name.toLowerCase()} —
                jump to local company listings.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PRIORITY_CITIES.slice(0, 12).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}/`}
                    className="group flex items-center gap-2.5 rounded-xl border border-border bg-bg px-3.5 py-3 transition-colors hover:border-bright-blue hover:bg-white hover:text-inherit"
                  >
                    <PinIcon
                      size={14}
                      className="shrink-0 text-faint transition-colors group-hover:text-michigan-blue"
                    />
                    <span className="min-w-0 flex-1 text-[14.5px] font-bold text-navy group-hover:text-michigan-blue">
                      {city.name}
                    </span>
                    <span
                      aria-hidden
                      className="text-[15px] font-extrabold text-bright-blue transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/cities/"
                className="mt-4 inline-flex text-[14px] font-bold text-michigan-blue hover:underline"
              >
                View all Michigan cities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pt-14 pb-[88px] md:pt-16">
        <CtaBand
          title={service.ctaTitle}
          subtitle={service.ctaSub}
          primaryLabel={service.findLabel}
          primaryHref={`/pros/?service=${encodeURIComponent(service.name)}`}
          secondaryLabel="Get a Free Quote"
          secondaryHref={`/get-a-quote/?service=${encodeURIComponent(service.name)}`}
        />
      </section>

      <CompactFooter />
    </>
  );
}
