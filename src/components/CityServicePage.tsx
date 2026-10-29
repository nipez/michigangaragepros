import Link from "next/link";
import type { City } from "@/data/cities";
import { costGuidePathForService } from "@/data/costGuides";
import {
  formatCostRange,
  getLocalizedCostTable,
} from "@/data/serviceCosts";
import type { Service } from "@/data/services";
import { SITE_URL } from "@/data/site";
import {
  getIndexableServicesForCity,
  getNearbyIndexableCitiesForService,
  getProsForCityService,
  INDEX_PRO_THRESHOLD,
  isCityIndexable,
  isCityServiceIndexable,
} from "@/lib/indexability";
import {
  buildCityServiceFaqs,
  buildCityServiceIntro,
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

export function CityServicePage({
  city,
  service,
}: {
  city: City;
  service: Service;
}) {
  const companies = getProsForCityService(city.slug, service);
  const indexable = isCityServiceIndexable(city.slug, service);
  const path = `/cities/${city.slug}/${service.slug}/`;
  const h1 = `${service.localTitle} in ${city.name}, ${city.state}`;
  const intro = buildCityServiceIntro(city, service, companies.length);
  const faqs = buildCityServiceFaqs(city, service, companies.length);
  const costTable = getLocalizedCostTable(service, city);
  const nearbyForService = getNearbyIndexableCitiesForService(city, service, 6);
  const otherIndexableServices = getIndexableServicesForCity(city.slug).filter(
    (s) => s.slug !== service.slug,
  );
  const costPath = costGuidePathForService(service.slug);
  const cityHubIndexable = isCityIndexable(city.slug);

  const jsonLd = [
    {
      "@type": "CollectionPage",
      name: h1,
      description: intro,
      url: `${SITE_URL}${path}`,
      isPartOf: { "@type": "WebSite", name: "Michigan Garage Pros", url: SITE_URL },
    },
    localBusinessItemListJsonLd({
      name: `${service.localTitle} companies in ${city.name}`,
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
      { name: service.localTitle, path },
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
            <span className="mx-1.5 text-[#8AA3B8]">/</span>
            {cityHubIndexable ? (
              <Link href={`/cities/${city.slug}/`} className="on-dark-link">
                {city.name}
              </Link>
            ) : (
              <span className="text-[#8AA3B8]">{city.name}</span>
            )}
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">{service.shortName}</span>
          </div>
          <h1 className="mb-3.5 max-w-[26ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            {h1}
          </h1>
          <p className="mb-[30px] max-w-[62ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            {intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/pros/?q=${encodeURIComponent(city.name)}&service=${encodeURIComponent(service.name)}`}
              className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
            >
              Find {service.shortName} Pros Near {city.name} →
            </Link>
            <Link
              href="#local-pros"
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
            Fewer than {INDEX_PRO_THRESHOLD} directory pros currently tag{" "}
            {service.localTitle.toLowerCase()} for {city.name}. This page stays
            available, and you can still browse statewide{" "}
            <Link href={`/${service.slug}/`} className="font-bold text-michigan-blue">
              {service.name.toLowerCase()}
            </Link>
            .
          </p>
        </section>
      )}

      <section id="local-pros" className="container-site pt-[72px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            {service.localTitle} Companies in {city.name}
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
            We don&apos;t have {service.localTitle.toLowerCase()} specialists
            tagged for {city.name} yet.{" "}
            {cityHubIndexable ? (
              <>
                <Link href={`/cities/${city.slug}/`} className="font-bold text-michigan-blue">
                  See all {city.name} companies
                </Link>
                ,{" "}
              </>
            ) : null}
            <Link href={`/${service.slug}/`} className="font-bold text-michigan-blue">
              browse statewide {service.name.toLowerCase()}
            </Link>
            , or{" "}
            <Link href="/get-a-quote/" className="font-bold text-michigan-blue">
              request a free quote
            </Link>
            .
          </div>
        )}
      </section>

      {costTable && indexable && (
        <section className="container-site pt-[72px]">
          <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Typical {service.localTitle} Costs in {city.name}
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
          {costPath ? (
            <p className="mt-3 text-[13px] text-faint">
              More detail in our{" "}
              <Link href={costPath} className="font-bold text-michigan-blue">
                Michigan {service.localTitle.toLowerCase()} cost guide
              </Link>
              .
            </p>
          ) : null}
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
              More in {city.name}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {cityHubIndexable && (
                <Link
                  href={`/cities/${city.slug}/`}
                  className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  {city.name} city hub
                </Link>
              )}
              {otherIndexableServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/cities/${city.slug}/${s.slug}/`}
                  className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  {s.localTitle}
                </Link>
              ))}
              <Link
                href={`/${service.slug}/`}
                className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
              >
                Statewide {service.localTitle}
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-[18px] text-xl font-extrabold text-navy">
              Nearby {service.shortName} Markets
            </h3>
            {nearbyForService.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {nearbyForService.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/cities/${n.slug}/${service.slug}/`}
                    className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[14.5px] leading-[1.55] text-muted">
                See{" "}
                <Link href={`/${service.slug}/`} className="font-bold text-michigan-blue">
                  statewide {service.localTitle.toLowerCase()}
                </Link>{" "}
                for other Michigan markets.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px]">
        <h2 className="mb-6 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
          {city.name} {service.localTitle} FAQ
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
          title={`Need ${service.localTitle} in ${city.name}?`}
          subtitle="Tell us what you need — we'll match you with local pros serving your neighborhood."
          primaryHref={`/pros/?q=${encodeURIComponent(city.name)}&service=${encodeURIComponent(service.name)}`}
          primaryLabel="Browse Local Pros"
          secondaryHref={`/get-a-quote/?service=${encodeURIComponent(service.name)}`}
          secondaryLabel="Get a Free Quote"
        />
      </section>

      <CompactFooter />
    </>
  );
}
