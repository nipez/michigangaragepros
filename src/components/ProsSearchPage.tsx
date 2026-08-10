import Link from "next/link";
import { getHomepageCities } from "@/data/cities";
import { findLocalPros } from "@/lib/locationSearch";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { PinIcon } from "./Icons";
import { ProsSearchForm } from "./ProsSearchForm";
import { ShuffledCompanyGrid } from "./ShuffledCompanyGrid";

type ProsSearchPageProps = {
  query: string;
  service: string;
};

export function ProsSearchPage({ query, service }: ProsSearchPageProps) {
  const hasQuery = !!query.trim();
  const result = hasQuery ? findLocalPros(query, service) : null;
  const companies = result?.companies ?? [];
  const city = result?.city ?? null;

  const locationLabel = city
    ? result?.zip
      ? `${result.zip} (${city.name}, ${city.state})`
      : `${city.name}, ${city.state}`
    : result?.zip
      ? result.zip
      : query;

  return (
    <>
      <Header active="pros" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">Find Pros</span>
          </div>
          <h1 className="mb-3.5 max-w-[22ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            {hasQuery && city
              ? `Garage Door Pros Near ${city.name}`
              : "Find Local Garage Door Pros"}
          </h1>
          <p className="mb-8 max-w-[54ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Enter your ZIP or city to see companies serving your area — no quote
            form required.
          </p>
          <div className="max-w-[720px] rounded-2xl bg-white p-[22px] shadow-[0_24px_60px_rgba(4,16,28,0.45)]">
            <ProsSearchForm
              initialQuery={query}
              initialService={service}
              compact
            />
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px] pb-[88px]">
        {!hasQuery ? (
          <>
            <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
              Popular Michigan Cities
            </h2>
            <p className="mb-8 max-w-[52ch] text-[15.5px] text-muted">
              Or jump straight to a city directory page.
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
              {getHomepageCities().map((c) => (
                <Link
                  key={c.slug}
                  href={`/cities/${c.slug}/`}
                  className="city-chip"
                >
                  <PinIcon className="shrink-0 text-faint" />
                  {c.name}
                </Link>
              ))}
            </div>
            <p className="mt-10 text-[15px] text-muted">
              Prefer to get matched quotes instead?{" "}
              <Link href="/get-a-quote/" className="font-bold text-michigan-blue">
                Request a free quote
              </Link>
              .
            </p>
          </>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
                  {city
                    ? `Companies Serving ${city.name}`
                    : "Search Results"}
                </h2>
                <p className="mt-2 mb-0 text-[15px] text-muted">
                  Showing results for{" "}
                  <span className="font-semibold text-navy">{locationLabel}</span>
                  {service ? (
                    <>
                      {" "}
                      · <span className="font-semibold text-navy">{service}</span>
                    </>
                  ) : null}
                  {result?.matchType === "zip-prefix" && city ? (
                    <span className="block mt-1 text-[13.5px] text-faint">
                      Approximate match for this ZIP — listing companies near{" "}
                      {city.name}.
                    </span>
                  ) : null}
                </p>
              </div>
              <span className="text-[13px] text-faint">
                {companies.length}{" "}
                {companies.length === 1 ? "company" : "companies"}
              </span>
            </div>

            {companies.length > 0 ? (
              <ShuffledCompanyGrid
                companies={companies}
                cityName={city?.name}
                quoteHref={
                  result?.zip
                    ? `/get-a-quote/?zip=${encodeURIComponent(result.zip)}${
                        service
                          ? `&service=${encodeURIComponent(service)}`
                          : ""
                      }`
                    : service
                      ? `/get-a-quote/?service=${encodeURIComponent(service)}`
                      : "/get-a-quote/"
                }
              />
            ) : (
              <div className="rounded-2xl border border-border bg-white p-8 text-[15.5px] leading-[1.6] text-muted">
                We couldn&apos;t find companies for that location yet.{" "}
                <Link
                  href={`/get-a-quote/?zip=${encodeURIComponent(query)}${
                    service ? `&service=${encodeURIComponent(service)}` : ""
                  }`}
                  className="font-bold text-michigan-blue"
                >
                  Request a free quote
                </Link>{" "}
                and we&apos;ll match you with pros nearby, or{" "}
                <Link href="/companies/" className="font-bold text-michigan-blue">
                  browse all Michigan companies
                </Link>
                .
              </div>
            )}

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white px-6 py-5">
              <div>
                <div className="text-[16px] font-extrabold text-navy">
                  Want quotes without browsing?
                </div>
                <div className="text-[14.5px] text-muted">
                  Tell us what you need — we&apos;ll connect you with local pros.
                </div>
              </div>
              <Link
                href={`/get-a-quote/?zip=${encodeURIComponent(result?.zip || query)}${
                  service ? `&service=${encodeURIComponent(service)}` : ""
                }`}
                className="btn-primary !px-5 !py-3"
              >
                Get a Free Quote →
              </Link>
            </div>

            {city ? (
              <p className="mt-8 text-[14.5px] text-muted">
                See the full city page:{" "}
                <Link
                  href={`/cities/${city.slug}/`}
                  className="font-bold text-michigan-blue"
                >
                  Garage door pros in {city.name}
                </Link>
              </p>
            ) : null}
          </>
        )}
      </section>

      <CompactFooter />
    </>
  );
}
