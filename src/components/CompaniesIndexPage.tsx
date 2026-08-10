import Link from "next/link";
import { getAllCompaniesSorted } from "@/data/companies";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { BeFeaturedCard, CompanyCard } from "./CompanyCard";
import { CtaBand } from "./CtaBand";

export function CompaniesIndexPage() {
  const companies = getAllCompaniesSorted();
  const hasPaidFeatured = companies.some((c) => c.featured);

  return (
    <>
      <Header active="pros" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5 text-[#8AA3B8]">/</span>
            <span className="text-[#E8F1F8]">Companies</span>
          </div>
          <h1 className="mb-3.5 max-w-[24ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Michigan Garage Door Companies
          </h1>
          <p className="mb-[30px] max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Browse {companies.length} garage door service companies across
            Michigan. Compare services and service areas — then request
            a free quote.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/get-a-quote/"
              className="on-dark-solid inline-block rounded-xl bg-bright-blue px-[26px] py-3.5 text-[15.5px] font-extrabold text-white hover:bg-cta-hover"
            >
              Get a Free Quote →
            </Link>
            <Link
              href="/for-companies/"
              className="on-dark-link inline-block rounded-xl border-[1.5px] border-white/35 px-[26px] py-3.5 text-[15.5px] font-bold text-white hover:bg-white/8"
            >
              Claim Your Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="container-site pt-[72px] pb-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 text-[clamp(26px,2.8vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            All Companies
          </h2>
          <span className="text-[13px] text-faint">
            {companies.length} listings · A–Z
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {!hasPaidFeatured && <BeFeaturedCard />}
          {companies.map((c) => (
            <CompanyCard key={c.slug} company={c} />
          ))}
        </div>
      </section>

      <section className="container-site my-[72px] mb-[88px]">
        <CtaBand
          title="Own a Garage Door Company in Michigan?"
          subtitle="Claim your free profile, update your services, and start receiving homeowner leads."
          primaryHref="/for-companies/"
          primaryLabel="Claim Your Profile →"
        />
      </section>

      <CompactFooter />
    </>
  );
}
