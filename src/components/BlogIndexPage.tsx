import Link from "next/link";
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

export function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header active="blog" />

      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <div className="mb-[18px] text-[13.5px] font-semibold text-[#8AA3B8]">
            <Link href="/" className="on-dark-link">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-footer-link">Blog</span>
          </div>
          <h1 className="mb-3.5 max-w-[20ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Michigan Garage Door Guides
          </h1>
          <p className="mb-0 max-w-[56ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            Practical advice for homeowners — springs, winter troubleshooting,
            repair costs, and how to hire a local pro with confidence.
          </p>
        </div>
      </section>

      <section className="container-site py-[72px]">
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group rounded-2xl border border-border bg-white p-6 transition-colors hover:border-bright-blue hover:text-inherit md:p-7"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.8px] text-faint">
                <span className="rounded-full bg-icon-tile px-2.5 py-1 text-michigan-blue">
                  {post.category}
                </span>
                <span>{formatDate(post.date)}</span>
                <span>{post.readMinutes} min read</span>
              </div>
              <h2 className="mb-2 text-[clamp(20px,2.2vw,26px)] font-extrabold tracking-[-0.4px] text-navy group-hover:text-michigan-blue">
                {post.title}
              </h2>
              <p className="m-0 max-w-[70ch] text-[15.5px] leading-[1.6] text-muted">
                {post.description}
              </p>
              <div className="mt-4 text-[14px] font-bold text-michigan-blue">
                Read guide →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site mb-[88px]">
        <CtaBand
          title="Ready to Find a Local Pro?"
          subtitle="Enter your ZIP to see garage-door companies near you."
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
