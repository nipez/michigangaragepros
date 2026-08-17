import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { getAllBlogPosts, getBlogImage } from "@/data/blog";
import { BlogPostImage } from "./BlogPostImage";
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

function sectionKey(heading: string | undefined, index: number) {
  return heading ?? `intro-${index}`;
}

function isNumberedHeading(heading?: string) {
  return Boolean(heading && /^\d+\./.test(heading.trim()));
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  const image = getBlogImage(post);
  const related = getAllBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aSame = Number(a.category === post.category);
      const bSame = Number(b.category === post.category);
      return bSame - aSame || b.date.localeCompare(a.date);
    })
    .slice(0, 3);

  const [intro, ...rest] = post.sections;

  return (
    <>
      <Header active="blog" />

      <article>
        <section className="hero-gradient">
          <div className="container-site py-14 pb-12">
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
            <div className="mb-4 flex flex-wrap items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.8px] text-[#A8D4F5]">
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                {post.category}
              </span>
              <span>{formatDate(post.date)}</span>
              <span className="text-white/35">·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="mb-4 max-w-[22ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
              {post.title}
            </h1>
            <p className="mb-0 max-w-[58ch] text-lg leading-[1.55] text-hero-muted text-pretty">
              {post.description}
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-bg">
          <div className="container-site max-w-[820px] py-[56px] md:py-[64px]">
            <div className="blog-article rounded-[20px] border border-border bg-white px-5 py-8 shadow-[0_10px_40px_rgba(16,42,67,0.06)] sm:px-8 sm:py-10 md:px-11 md:py-12">
              {intro ? (
                <div className="blog-intro mb-10">
                  <BlogPostImage
                    image={image}
                    float
                    placeholderHint={`Drop image at public/blog/${post.slug}.webp`}
                  />
                  <div className="grid gap-4">
                    {intro.heading ? (
                      <h2 className="m-0 text-[clamp(22px,2.2vw,28px)] font-extrabold tracking-[-0.4px] text-navy">
                        {intro.heading}
                      </h2>
                    ) : null}
                    {intro.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="m-0 text-[16.5px] leading-[1.75] text-body-secondary text-pretty"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-7">
                {rest.map((section, index) => {
                  const numbered = isNumberedHeading(section.heading);
                  return (
                    <div
                      key={sectionKey(section.heading, index + 1)}
                      className={
                        numbered
                          ? "rounded-2xl border border-border bg-bg/80 px-5 py-5 sm:px-6"
                          : undefined
                      }
                    >
                      {section.heading ? (
                        <h2
                          className={`mb-3 font-extrabold tracking-[-0.4px] text-navy ${
                            numbered
                              ? "text-[18px] sm:text-[19px]"
                              : "text-[clamp(22px,2.2vw,28px)]"
                          }`}
                        >
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
                  );
                })}
              </div>

              <aside className="mt-12 overflow-hidden rounded-2xl border border-bright-blue/25 bg-[linear-gradient(135deg,#f3f8fd_0%,#ffffff_55%)] p-6 sm:p-7">
                <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-michigan-blue">
                  Next step
                </div>
                <div className="mb-2 text-lg font-extrabold text-navy">
                  Find help near you
                </div>
                <p className="mb-5 text-[15px] leading-[1.6] text-muted">
                  Enter your ZIP to browse Michigan garage-door companies, or
                  jump to a service or region page.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/pros/" className="btn-primary !px-5 !py-3">
                    Find Local Pros →
                  </Link>
                  <Link
                    href="/broken-springs/"
                    className="btn-outline !px-5 !py-3"
                  >
                    Broken Spring Help
                  </Link>
                  <Link
                    href="/emergency-service/"
                    className="btn-outline !px-5 !py-3"
                  >
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
              </aside>
            </div>
          </div>
        </section>
      </article>

      <section className="container-site py-14 pb-10">
        <h2 className="mb-5 text-xl font-extrabold text-navy">
          More guides for Michigan homeowners
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <RelatedCard key={item.slug} post={item} />
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

function RelatedCard({ post }: { post: BlogPost }) {
  const image = getBlogImage(post);
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group overflow-hidden rounded-2xl border border-border bg-white transition-colors hover:border-bright-blue hover:text-inherit"
    >
      <div className="blog-card-thumb">
        <BlogPostImage
          image={image}
          placeholderHint={`${post.slug}.webp`}
        />
      </div>
      <div className="p-5">
        <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.8px] text-faint">
          {post.category}
        </div>
        <div className="text-[15.5px] font-extrabold leading-[1.35] text-navy group-hover:text-michigan-blue">
          {post.title}
        </div>
      </div>
    </Link>
  );
}
