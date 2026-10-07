import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="hero-gradient">
        <div className="container-site py-14 pb-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-hero-muted">
            404
          </p>
          <h1 className="mb-3.5 max-w-[18ch] text-[clamp(32px,3.8vw,48px)] font-extrabold leading-[1.1] tracking-[-1px] text-balance">
            Page not found
          </h1>
          <p className="mb-8 max-w-[48ch] text-lg leading-[1.55] text-hero-muted text-pretty">
            That URL is not in our directory. Try finding a local pro or browse
            Michigan cities instead.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pros/" className="btn-primary">
              Find a Pro
            </Link>
            <Link href="/cities/" className="btn-outline">
              Browse cities
            </Link>
          </div>
        </div>
      </section>
      <CompactFooter />
    </>
  );
}
