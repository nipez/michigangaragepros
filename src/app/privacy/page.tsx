import type { Metadata } from "next";
import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Michigan Garage Pros — how we handle contact info from quote requests, claims, and Featured interest forms.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy/" },
          ]),
        ]}
      />
      <Header />
      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <h1 className="mb-3.5 text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px]">
            Privacy Policy
          </h1>
          <p className="mb-0 text-lg text-hero-muted">Last updated: September 2026</p>
        </div>
      </section>
      <section className="container-site max-w-[760px] py-14 pb-[88px]">
        <div className="grid gap-5 text-[15.5px] leading-[1.7] text-body-secondary">
          <p className="m-0">
            Michigan Garage Pros (&quot;we&quot;) operates michigangaragepros.com, a
            directory that helps Michigan homeowners find garage door companies
            and helps those companies manage listings.
          </p>
          <h2 className="m-0 text-xl font-extrabold text-navy">Information we collect</h2>
          <p className="m-0">
            When you submit a quote request, claim form, or Featured interest
            form, we collect the details you provide (such as name, email, phone,
            ZIP, service needed, and company information). We also collect
            standard analytics data via Google Analytics (measurement ID
            configured on the site).
          </p>
          <h2 className="m-0 text-xl font-extrabold text-navy">How we use it</h2>
          <p className="m-0">
            Quote details are shared with relevant local companies so they can
            respond. Claim and Featured requests are used to verify ownership and
            follow up about listings. We do not sell personal information.
          </p>
          <h2 className="m-0 text-xl font-extrabold text-navy">Contact</h2>
          <p className="m-0">
            Privacy questions:{" "}
            <a href="mailto:nickperez@gmail.com" className="font-bold text-michigan-blue">
              nickperez@gmail.com
            </a>
            . See also our{" "}
            <Link href="/contact/" className="font-bold text-michigan-blue">
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
      <CompactFooter />
    </>
  );
}
