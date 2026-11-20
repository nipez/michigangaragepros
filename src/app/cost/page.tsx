import type { Metadata } from "next";
import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { MobileCta } from "@/components/MobileCta";
import { getAllCostGuides } from "@/data/costGuides";
import { SITE_URL } from "@/data/site";
import { buildQuoteHref } from "@/lib/quote-links";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  itemListJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Garage Door Cost Guides for Michigan",
  description:
    "Typical Michigan garage door cost ranges for repair, springs, openers, installation, maintenance, and emergency service — planning estimates before you compare local quotes.",
  path: "/cost/",
});

export default function CostHubPage() {
  const guides = getAllCostGuides();
  const quoteHref = buildQuoteHref({ source: "cost" });

  const jsonLd = [
    {
      "@type": "CollectionPage",
      name: "Garage Door Cost Guides for Michigan",
      description:
        "Typical Michigan garage door cost ranges for homeowners comparing local quotes.",
      url: `${SITE_URL}/cost/`,
      isPartOf: {
        "@type": "WebSite",
        name: "Michigan Garage Pros",
        url: SITE_URL,
      },
    },
    itemListJsonLd({
      name: "Michigan garage door cost guides",
      items: guides.map((g) => ({
        name: g.h1,
        path: g.path,
      })),
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cost guides", path: "/cost/" },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header quoteHref={quoteHref} />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">Cost guides</span>
          </div>
          <h1 className="mb-3.5 max-w-[20ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Garage Door Cost Guides for Michigan
          </h1>
          <p className="mb-[30px] max-w-[62ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Planning ranges for common garage door jobs — not quotes. Use these
            guides to budget, then compare written estimates from local pros.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={quoteHref}
              className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
            >
              Get a Free Quote →
            </Link>
            <Link
              href="/pros/"
              className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-[26px] py-3.5 text-[15.5px] font-bold text-white hover:bg-white/8"
            >
              Find a Pro
            </Link>
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px] pb-4">
        <h2 className="mb-3 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
          Browse by Service
        </h2>
        <p className="mb-8 max-w-[60ch] text-[15px] leading-[1.6] text-muted">
          Six statewide guides covering the jobs Michigan homeowners ask about
          most.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.service.slug}
              href={guide.path}
              className="block rounded-2xl border border-border bg-white px-5 py-4 transition-colors hover:border-bright-blue"
            >
              <div className="text-[16px] font-extrabold text-navy">
                {guide.service.localTitle} Cost
              </div>
              <p className="mt-1.5 mb-0 text-[14px] leading-[1.55] text-muted text-pretty">
                Typical Michigan ranges for{" "}
                {guide.service.localTitle.toLowerCase()}, what changes the
                price, and how to compare quotes.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site pt-[72px] pb-[72px]">
        <CtaBand
          title="Ready to compare local quotes?"
          subtitle="Browse Michigan garage door companies near your ZIP, or request a free quote."
          primaryHref={quoteHref}
          primaryLabel="Get a Free Quote →"
          secondaryHref="/pros/"
          secondaryLabel="Find a Pro"
        />
      </section>
      <MobileCta href={quoteHref} />
      <CompactFooter />
    </>
  );
}
