import Link from "next/link";
import type { CostGuidePage as CostGuideData } from "@/data/costGuides";
import { formatCostRange, getServiceCostGuide } from "@/data/serviceCosts";
import { SITE_URL } from "@/data/site";
import {
  getIndexableCityServicePairs,
} from "@/lib/indexability";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";

export function CostGuidePage({ guide }: { guide: CostGuideData }) {
  const costGuide = getServiceCostGuide(guide.service.slug);
  const cityLinks = getIndexableCityServicePairs()
    .filter((p) => p.service.slug === guide.service.slug)
    .slice(0, 10);

  const jsonLd = [
    {
      "@type": "WebPage",
      name: guide.h1,
      description: guide.description,
      url: `${SITE_URL}${guide.path}`,
      isPartOf: { "@type": "WebSite", name: "Michigan Garage Pros", url: SITE_URL },
    },
    faqPageJsonLd(guide.faqs),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: guide.service.name, path: `/${guide.service.slug}/` },
      { name: "Cost guide", path: guide.path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5 text-[#8AA3B8]">/</span>
            <Link href={`/${guide.service.slug}/`} className="on-dark-link">
              {guide.service.shortName}
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">Cost</span>
          </div>
          <h1 className="mb-3.5 max-w-[24ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            {guide.h1}
          </h1>
          <p className="mb-[30px] max-w-[62ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            {guide.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${guide.service.slug}/`}
              className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
            >
              Browse {guide.service.shortName} Pros →
            </Link>
            <Link
              href="/get-a-quote/"
              className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-[26px] py-3.5 text-[15.5px] font-bold text-white hover:bg-white/8"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {costGuide && (
        <section className="container-site pt-[72px]">
          <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Typical Michigan Ranges
          </h2>
          <p className="mb-6 max-w-[68ch] text-[15px] leading-[1.6] text-muted text-pretty">
            {costGuide.disclaimer}
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
                {costGuide.lines.map((line) => (
                  <tr
                    key={line.label}
                    className="border-b border-border last:border-0"
                  >
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
        </section>
      )}

      {cityLinks.length > 0 && (
        <section className="container-site pt-[72px]">
          <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Compare Local {guide.service.shortName} Pros
          </h2>
          <p className="mb-6 max-w-[60ch] text-[15px] leading-[1.6] text-muted">
            City pages with enough local listings for{" "}
            {guide.service.localTitle.toLowerCase()}:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {cityLinks.map(({ city }) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}/${guide.service.slug}/`}
                className="rounded-full border border-border bg-white px-4 py-[9px] text-sm font-semibold text-text transition-colors hover:border-bright-blue hover:text-michigan-blue"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-site pt-[72px]">
        <h2 className="mb-6 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
          {guide.service.localTitle} Cost FAQ
        </h2>
        <div className="grid gap-3">
          {guide.faqs.map((f) => (
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
          title={`Ready for a Real ${guide.service.localTitle} Quote?`}
          subtitle="Ranges above are planning estimates — local pros give written prices for your door."
          primaryHref={`/${guide.service.slug}/`}
          primaryLabel={`Browse ${guide.service.shortName} Pros`}
          secondaryHref="/get-a-quote/"
          secondaryLabel="Get a Free Quote"
        />
      </section>

      <CompactFooter />
    </>
  );
}
