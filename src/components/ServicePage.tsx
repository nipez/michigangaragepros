import Link from "next/link";
import { getTopCompanies } from "@/data/companies";
import { CITIES } from "@/data/cities";
import { SERVICES, type Service } from "@/data/services";
import { COMMON_PROBLEMS } from "@/data/site";
import { BeFeaturedCard, CompanyCard } from "./CompanyCard";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";
import { LineIcon, PinIcon } from "./Icons";

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
                Jump to local company listings in major Michigan markets.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {CITY_LINKS.map((name) => {
                  const city = CITIES.find((c) => c.name === name);
                  return (
                    <Link
                      key={name}
                      href={`/cities/${city?.slug ?? ""}/`}
                      className="group flex items-center gap-2.5 rounded-xl border border-border bg-bg px-3.5 py-3 transition-colors hover:border-bright-blue hover:bg-white hover:text-inherit"
                    >
                      <PinIcon
                        size={14}
                        className="shrink-0 text-faint transition-colors group-hover:text-michigan-blue"
                      />
                      <span className="min-w-0 flex-1 text-[14.5px] font-bold text-navy group-hover:text-michigan-blue">
                        {name}
                      </span>
                      <span
                        aria-hidden
                        className="text-[15px] font-extrabold text-bright-blue transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
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
        <CtaBand title={service.ctaTitle} subtitle={service.ctaSub} />
      </section>

      <CompactFooter />
    </>
  );
}
