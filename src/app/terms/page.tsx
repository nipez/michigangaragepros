import type { Metadata } from "next";
import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for Michigan Garage Pros, a Michigan garage door company directory.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms/" },
          ]),
        ]}
      />
      <Header />
      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <h1 className="mb-3.5 text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px]">
            Terms of Use
          </h1>
          <p className="mb-0 text-lg text-hero-muted">Last updated: September 2026</p>
        </div>
      </section>
      <section className="container-site max-w-[760px] py-14 pb-[88px]">
        <div className="grid gap-5 text-[15.5px] leading-[1.7] text-body-secondary">
          <p className="m-0">
            By using michigangaragepros.com you agree to these terms. Michigan
            Garage Pros is a directory and lead-matching website. We are not a
            garage door contractor and do not guarantee the work of any listed
            company.
          </p>
          <h2 className="m-0 text-xl font-extrabold text-navy">Listings</h2>
          <p className="m-0">
            Company profiles may include publicly available information and
            owner-submitted updates. Details can change; confirm pricing,
            licensing, and availability directly with the business before hiring.
          </p>
          <h2 className="m-0 text-xl font-extrabold text-navy">Quotes and leads</h2>
          <p className="m-0">
            Submitting a quote request authorizes us to share your project
            details with local companies that may contact you. Featured listings
            are paid placements and are labeled as such.
          </p>
          <h2 className="m-0 text-xl font-extrabold text-navy">Contact</h2>
          <p className="m-0">
            Questions:{" "}
            <Link href="/contact/" className="font-bold text-michigan-blue">
              Contact us
            </Link>{" "}
            or email{" "}
            <a href="mailto:nickperez@gmail.com" className="font-bold text-michigan-blue">
              nickperez@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
      <CompactFooter />
    </>
  );
}
