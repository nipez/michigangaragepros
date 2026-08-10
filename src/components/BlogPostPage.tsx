import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { getAllBlogPosts } from "@/data/blog";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { CtaBand } from "./CtaBand";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  const related = getAllBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Header active="blog" />

      <article>
        <section className="hero-gradient">
          <div className="container-site py-14 pb-16">
            <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
              <Link href="/" className="on-dark-link">
                Home
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/blog/" className="on-dark-link">
                Blog
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-footer-link">{post.category}</span>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.8px] text-[#A8D4F5]">
              <span>{post.category}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="mb-4 max-w-[20ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
              {post.title}
            </h1>
            <p className="mb-0 max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
              {post.description}
            </p>
          </div>
        </section>

        <section className="container-site max-w-[760px] py-[64px]">
          <div className="grid gap-8">
            {post.sections.map((section, index) => (
              <div key={section.heading ?? `intro-${index}`}>
                {section.heading ? (
                  <h2 className="mb-3 text-[clamp(22px,2.2vw,28px)] font-extrabold tracking-[-0.4px] text-navy">
                    {section.heading}
                  </h2>
                ) : null}
                <div className="grid gap-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="m-0 text-[16.5px] leading-[1.75] text-body-secondary text-pretty"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-bg p-6">
            <div className="mb-2 text-lg font-extrabold text-navy">
              Find help near you
            </div>
            <p className="mb-4 text-[15px] leading-[1.6] text-muted">
              Enter your ZIP to browse Michigan garage-door companies, or jump
              to a service or region page.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pros/" className="btn-primary !px-5 !py-3">
                Find Local Pros →
              </Link>
              <Link href="/broken-springs/" className="btn-outline !px-5 !py-3">
                Broken Spring Help
              </Link>
              <Link href="/emergency-service/" className="btn-outline !px-5 !py-3">
                Emergency Service
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { href: "/regions/southeast/", label: "Southeast MI" },
                { href: "/regions/west/", label: "West MI" },
                { href: "/regions/central/", label: "Central MI" },
                { href: "/cities/", label: "All cities" },
                { href: "/garage-door-repair/", label: "Repair" },
                { href: "/garage-door-openers/", label: "Openers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-[13px] font-semibold text-navy transition-colors hover:border-bright-blue hover:text-michigan-blue"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>

      <section className="container-site pb-10">
        <h2 className="mb-5 text-xl font-extrabold text-navy">
          More guides for Michigan homeowners
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}/`}
              className="rounded-xl border border-border bg-white p-5 transition-colors hover:border-bright-blue hover:text-inherit"
            >
              <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.8px] text-faint">
                {item.category}
              </div>
              <div className="text-[15.5px] font-extrabold text-navy">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site mb-[88px]">
        <CtaBand
          title="Need a Garage Door Pro Today?"
          subtitle="Browse local companies by ZIP, or request a quote if you want to get matched."
          primaryLabel="Find Local Pros →"
          primaryHref="/pros/"
          secondaryLabel="Get a Free Quote"
          secondaryHref="/get-a-quote/"
        />
      </section>

      <CompactFooter />
    </>
  );
}
