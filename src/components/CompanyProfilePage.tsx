import Link from "next/link";
import type { Company } from "@/data/companies";
import { SAMPLE_REVIEWS } from "@/data/companies";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { BoltIcon, LogoMark, Stars } from "./Icons";

export function CompanyProfilePage({ company }: { company: Company }) {
  return (
    <>
      <Header active="pros" />

      <section className="border-b border-border bg-white">
        <div className="container-site py-10">
          <div className="mb-[22px] text-[13.5px] font-semibold text-faint">
            <Link href="/" className="text-faint hover:text-michigan-blue">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/companies/" className="text-faint hover:text-michigan-blue">
              Companies
            </Link>
            <span className="mx-1.5">/</span>
            <Link
              href={`/cities/${company.citySlug}/`}
              className="text-faint hover:text-michigan-blue"
            >
              {company.city.replace(", MI", "")}
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted">{company.name}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex min-w-[280px] items-center gap-5">
              <div className="grid size-[72px] shrink-0 place-items-center rounded-2xl bg-navy">
                <LogoMark size={36} />
              </div>
              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <h1 className="m-0 text-[clamp(24px,2.6vw,32px)] font-extrabold tracking-[-0.6px] text-navy">
                    {company.name}
                  </h1>
                  {company.featured && (
                    <span className="featured-badge">Featured Pro</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[15px]">
                  <Stars rating={company.rating} />
                  <strong>{company.rating.toFixed(1)}</strong>
                  <span className="text-muted">· {company.reviews} reviews</span>
                  <span className="text-[#C4CFDA]">|</span>
                  <span className="text-muted">{company.city}</span>
                  {company.emergency && (
                    <>
                      <span className="text-[#C4CFDA]">|</span>
                      <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-success">
                        <BoltIcon />
                        Emergency service
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {company.phone ? (
                <a href={`tel:${company.phone}`} className="btn-outline !rounded-[11px] !px-[22px] !py-[13px] !text-[15px]">
                  Call Company
                </a>
              ) : (
                <span className="btn-outline !rounded-[11px] !px-[22px] !py-[13px] !text-[15px]">
                  Call Company
                </span>
              )}
              <Link
                href="/get-a-quote/"
                className="btn-primary !rounded-[11px] !px-[22px] !py-[13px] !text-[15px] !font-extrabold"
              >
                Request a Quote →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div
        data-profile-grid="1"
        className="container-site grid items-start gap-9 py-12 pb-[88px]"
        style={{ gridTemplateColumns: "1fr 360px" }}
      >
        <div className="grid gap-8">
          <div className="rounded-2xl border border-border bg-white p-7">
            <h2 className="mb-3 text-xl font-extrabold text-navy">About</h2>
            <p className="m-0 text-[15.5px] leading-[1.65] text-body-secondary text-pretty">
              {company.about}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-7">
            <h2 className="mb-4 text-xl font-extrabold text-navy">Services</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
              {company.services.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 text-[14.5px] font-semibold text-text"
                >
                  <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-success-bg text-xs font-extrabold text-success">
                    ✓
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-7">
            <h2 className="mb-4 text-xl font-extrabold text-navy">Photos</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex h-[150px] items-center justify-center rounded-xl bg-bg text-sm font-semibold text-faint"
                >
                  Work photo
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="m-0 text-xl font-extrabold text-navy">Reviews</h2>
              <div className="text-sm text-muted">
                <Stars rating={company.rating} className="mr-1" />
                <strong className="text-text">{company.rating.toFixed(1)}</strong> ·{" "}
                {company.reviews} reviews
              </div>
            </div>
            <div className="grid gap-[18px]">
              {SAMPLE_REVIEWS.map((r, i) => (
                <div
                  key={r.name}
                  className={
                    i < SAMPLE_REVIEWS.length - 1
                      ? "border-b border-[#EEF2F6] pb-[18px]"
                      : ""
                  }
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                    <span className="text-[14.5px] font-bold text-navy">
                      {r.name}
                    </span>
                    <Stars rating={r.stars} className="text-[13px]" />
                    <span className="text-[12.5px] text-faint">
                      {r.location} · {r.when}
                    </span>
                  </div>
                  <p className="m-0 text-[14.5px] leading-[1.6] text-body-secondary">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky top-[92px] grid gap-5">
          <div className="rounded-2xl border-[1.5px] border-bright-blue bg-white p-[26px] shadow-[0_14px_36px_rgba(47,128,237,0.10)]">
            <h3 className="mb-1.5 text-lg font-extrabold text-navy">
              Get a free quote
            </h3>
            <p className="mb-[18px] text-[13.5px] leading-[1.55] text-muted">
              Tell us what you need — {company.name} will follow up directly.
            </p>
            <Link
              href="/get-a-quote/"
              className="block rounded-[11px] bg-bright-blue py-3.5 text-center text-[15px] font-extrabold text-white hover:bg-michigan-blue hover:text-white"
            >
              Start Your Request →
            </Link>
            <div className="mt-3.5 flex justify-center gap-4 text-[12.5px] font-semibold text-muted">
              <span>
                <span className="font-extrabold text-success">✓</span> Free
              </span>
              <span>
                <span className="font-extrabold text-success">✓</span> No
                obligation
              </span>
              <span>
                <span className="font-extrabold text-success">✓</span> Fast
                response
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-[26px]">
            <h3 className="mb-3.5 text-base font-extrabold text-navy">
              Service Area
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.serviceArea.map((a) => (
                <span key={a} className="tag-pill !text-[12.5px] !px-[11px] !py-[5px]">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-[26px]">
            <h3 className="mb-3.5 text-base font-extrabold text-navy">
              Business Info
            </h3>
            <div className="grid gap-2.5 text-sm text-body-secondary">
              <div className="flex justify-between gap-3">
                <span className="text-faint">Hours</span>
                <span className="font-semibold">{company.hours}</span>
              </div>
              {company.emergencyHours && (
                <div className="flex justify-between gap-3">
                  <span className="text-faint">Emergency</span>
                  <span className="font-semibold text-success">
                    {company.emergencyHours}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-faint">On platform</span>
                <span className="font-semibold">{company.onPlatform}</span>
              </div>
              {company.website && (
                <div className="flex justify-between gap-3">
                  <span className="text-faint">Website</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-michigan-blue hover:underline"
                  >
                    Visit site
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CompactFooter />
    </>
  );
}
