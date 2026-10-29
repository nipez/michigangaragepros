import Link from "next/link";
import type { City } from "@/data/cities";
import { getCitySeo } from "@/data/growth";
import {
  formatCostRange,
} from "@/data/serviceCosts";
import { SITE_URL } from "@/data/site";
import {
  getIndexableServicesForCity,
  getNearbyIndexableCities,
  getProsForCity,
  INDEX_PRO_THRESHOLD,
  isCityIndexable,
} from "@/lib/indexability";
import {
  buildCityCostBlurb,
  buildCityFaqs,
  buildCityIntro,
} from "@/lib/localPageContent";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  localBusinessItemListJsonLd,
} from "@/lib/seo";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { ShuffledCompanyGrid } from "./ShuffledCompanyGrid";

export function CityPage({ city }: { city: City }) {
  const companies = getProsForCity(city.slug);
  const indexable = isCityIndexable(city.slug);
  const seo = getCitySeo(city.slug);
  const pageTitle =
    seo?.title ?? `Garage Door Pros in ${city.name}, ${city.state}`;
  const heading =
    seo?.h1 ?? `Garage Door Pros in ${city.name}, ${city.state}`;
  const intro = buildCityIntro(city, companies.length);
  const faqs = buildCityFaqs(city, companies.length);
  const costTable = buildCityCostBlurb(city);
  const indexableServices = getIndexableServicesForCity(city.slug);
  const nearbyIndexable = getNearbyIndexableCities(city, 6);

  const jsonLd = [
    {
      "@type": "CollectionPage",
      name: pageTitle,
      description: seo?.description ?? intro,
      url: `${SITE_URL}/cities/${city.slug}/`,
      isPartOf: { "@type": "WebSite", name: "Michigan Garage Pros", url: SITE_URL },
    },
    localBusinessItemListJsonLd({
      name: `Garage door companies serving ${city.name}`,
      items: companies.slice(0, 25).map((c) => ({
        name: c.name,
        path: `/companies/${c.slug}/`,
        phone: c.phone,
        address: c.address,
        cityLabel: c.city,
        website: c.website,
      })),
    }),
    faqPageJsonLd(faqs),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cities", path: "/cities/" },
      { name: city.name, path: `/cities/${city.slug}/` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
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
            {heading}
          </h1>
          <p className="mb-[30px] max-w-[62ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            {intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/pros/?q=${encodeURIComponent(city.name)}`}
              className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
            >
              Find Pros Near {city.name} →
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

      {!indexable && (
        <section className="container-site pt-8">
          <p className="m-0 rounded-xl border border-border bg-white px-4 py-3 text-[14px] leading-[1.55] text-muted">
            This {city.name} hub has fewer than {INDEX_PRO_THRESHOLD} directory
            pros so far — the page stays available for homeowners, but we are
            still building local coverage.
          </p>
        </section>
      )}

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
          <ShuffledCompanyGrid companies={companies} cityName={city.name} />
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

      {costTable && indexable && (
        <section className="container-site pt-[72px]">
          <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Typical Garage Door Repair Costs in {city.name}
          </h2>
          <p className="mb-6 max-w-[68ch] text-[15px] leading-[1.6] text-muted text-pretty">
            {costTable.disclaimer}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[320px] border-collapse text-left text-[14.5px]">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="px-5 py-3.5 font-extrabold text-navy">Job</th>
                  <th className="px-5 py-3.5 font-extrabold text-navy">
                    Typical range
                  </th>
                </tr>
              </thead>
              <tbody>
                {costTable.lines.map((line) => (
                  <tr key={line.label} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5 text-text">
                      <div className="font-semibold">{line.label}</div>
                      {line.note ? (
                        <div className="mt-0.5 text-[13px] text-faint">
                          {line.note}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-navy whitespace-nowrap">
                      {formatCostRange(line.low, line.high)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-faint">
            See also{" "}
            <Link
              href="/cost/garage-door-repair/"
              className="font-bold text-michigan-blue"
            >
              statewide repair cost guide
            </Link>
            .
          </p>
        </section>
      )}

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
            {indexableServices.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {indexableServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/cities/${city.slug}/${s.slug}/`}
                    className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                  >
                    {s.localTitle}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/garage-door-repair/"
                  className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  Statewide repair
                </Link>
                <Link
                  href="/broken-springs/"
                  className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  Statewide springs
                </Link>
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-[18px] text-xl font-extrabold text-navy">
              Nearby Communities
            </h3>
            {nearbyIndexable.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {nearbyIndexable.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/cities/${n.slug}/`}
                    className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[14.5px] leading-[1.55] text-muted">
                Browse the{" "}
                <Link href="/cities/" className="font-bold text-michigan-blue">
                  Michigan cities index
                </Link>{" "}
                for markets with fuller directory coverage.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <h2 className="mb-6 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
          {city.name} Garage Door FAQ
        </h2>
        <div className="grid gap-3">
          {faqs.map((f) => (
            <details
              key={f.question}
              className="rounded-2xl border border-border bg-white px-5 py-4"
            >
              <summary className="cursor-pointer list-none text-[15.5px] font-extrabold text-navy">
                {f.question}
              </summary>
              <p className="mt-2.5 mb-0 text-[14.5px] leading-[1.6] text-muted text-pretty">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-site my-[72px] mb-[88px]">
        <CtaBand
          title={`Need Garage Door Help in ${city.name}?`}
          subtitle="Tell us what you need — we'll match you with local pros serving your neighborhood."
          primaryHref={`/pros/?q=${encodeURIComponent(city.name)}`}
          primaryLabel="Browse Local Pros"
          secondaryHref="/get-a-quote/"
          secondaryLabel="Get a Free Quote"
        />
      </section>

      <CompactFooter />
    </>
  );
}
