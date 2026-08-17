import Link from "next/link";
import type { City } from "@/data/cities";
import { citySlug, getCityBySlug } from "@/data/cities";
import { getCompaniesForCity } from "@/data/companies";
import { getCitySeo } from "@/data/growth";
import { SITE_URL } from "@/data/site";
import { SERVICES } from "@/data/services";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";
import { ShuffledCompanyGrid } from "./ShuffledCompanyGrid";

export function CityPage({ city }: { city: City }) {
  const companies = getCompaniesForCity(city.slug);
  const seo = getCitySeo(city.slug);
  const intro =
    seo?.intro ??
    `Compare garage-door companies serving ${city.name} and nearby communities — repair, springs, openers, installation, and emergency service.`;
  const faqs = seo?.faqs ?? [
    {
      question: `How do I find garage door pros in ${city.name}?`,
      answer: `Browse the companies listed on this page, or enter your ZIP on Find Pros to see listings that serve ${city.name} and nearby areas.`,
    },
    {
      question: "Is this a contractor website?",
      answer:
        "Michigan Garage Pros is a statewide directory. We help homeowners compare local companies and help pros claim or feature their listings.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Garage Door Pros in ${city.name}, ${city.state}`,
        description: intro,
        url: `${SITE_URL}/cities/${city.slug}/`,
        isPartOf: { "@type": "WebSite", name: "Michigan Garage Pros", url: SITE_URL },
      },
      {
        "@type": "ItemList",
        name: `Garage door companies serving ${city.name}`,
        numberOfItems: companies.length,
        itemListElement: companies.slice(0, 25).map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          url: `${SITE_URL}/companies/${c.slug}/`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
