import type { Metadata } from "next";
import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Michigan Garage Pros",
  description:
    "Contact the Michigan Garage Pros directory team about listings, claims, Featured placement, or site feedback.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact/" },
          ]),
        ]}
      />
      <Header />
      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <h1 className="mb-3.5 max-w-[18ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Contact
          </h1>
          <p className="mb-0 max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Reach the Michigan Garage Pros directory team — for listing claims,
            Featured interest, or site questions.
          </p>
        </div>
      </section>
      <section className="container-site max-w-[760px] py-14 pb-[88px]">
        <div className="grid gap-6 text-[16px] leading-[1.7] text-body-secondary">
          <p className="m-0">
            Email:{" "}
            <a
              href="mailto:nickperez@gmail.com"
              className="font-bold text-michigan-blue"
            >
              nickperez@gmail.com
            </a>
          </p>
          <p className="m-0">
            Need garage door service at your home? We&apos;re a directory —{" "}
            <Link href="/get-a-quote/" className="font-bold text-michigan-blue">
              request a free quote
            </Link>{" "}
            or{" "}
            <Link href="/pros/" className="font-bold text-michigan-blue">
              browse local pros by ZIP
            </Link>
            .
          </p>
          <p className="m-0">
            Own a garage door company?{" "}
            <Link href="/for-companies/#claim" className="font-bold text-michigan-blue">
              Claim your page
            </Link>{" "}
            or ask about{" "}
            <Link href="/for-companies/#featured" className="font-bold text-michigan-blue">
              Featured listings
            </Link>
            .
          </p>
        </div>
      </section>
      <CompactFooter />
    </>
  );
}
