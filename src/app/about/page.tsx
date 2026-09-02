import type { Metadata } from "next";
import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Michigan Garage Pros",
  description:
    "Michigan Garage Pros is a statewide garage door company directory — not a contractor. Learn how we help homeowners compare local pros.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ]),
        ]}
      />
      <Header />
      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <h1 className="mb-3.5 max-w-[20ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            About Michigan Garage Pros
          </h1>
          <p className="mb-0 max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            A Michigan garage door directory that helps homeowners compare local
            companies — and helps pros claim and feature their listings.
          </p>
        </div>
      </section>
      <section className="container-site max-w-[760px] py-14 pb-[88px]">
        <div className="grid gap-6 text-[16px] leading-[1.7] text-body-secondary">
          <p className="m-0">
            Michigan Garage Pros is <strong className="text-navy">not a garage door contractor</strong>.
            We do not send our own technicians, and we do not operate a fake
            storefront with an invented headquarters address.
          </p>
          <p className="m-0">
            Homeowners use the site to browse city pages, service guides, and
            company profiles — then request a quote or contact a local business
            directly. Companies can{" "}
            <Link href="/for-companies/" className="font-bold text-michigan-blue">
              claim a free listing
            </Link>{" "}
            or inquire about Featured placement.
          </p>
          <p className="m-0">
            Listings are built from publicly available business information and
            owner-submitted updates. Always confirm details with the company
            before hiring.
          </p>
          <p className="m-0">
            Questions about the directory? See{" "}
            <Link href="/contact/" className="font-bold text-michigan-blue">
              Contact
            </Link>
            .
          </p>
        </div>
      </section>
      <CompactFooter />
    </>
  );
}
