import type { Metadata } from "next";
import Link from "next/link";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Featured checkout canceled | Michigan Garage Pros",
  robots: { index: false, follow: false },
};

export default function FeaturedCheckoutCancelPage() {
  return (
    <>
      <Header active="for-companies" claimHref="/for-companies/#claim" />
      <main className="container-site py-16 sm:py-20">
        <div className="mx-auto max-w-[560px] rounded-[20px] border border-border bg-white p-8 text-navy shadow-[0_12px_40px_rgba(15,40,70,0.06)]">
          <div className="mb-2 text-[13px] font-extrabold tracking-[1.5px] text-bright-blue uppercase">
            Featured Checkout
          </div>
          <h1 className="mb-3 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.6px]">
            Checkout canceled
          </h1>
          <p className="m-0 text-[15.5px] leading-[1.6] text-muted">
            No charge was made. You can restart Stripe Checkout whenever
            you&apos;re ready, or leave an interest note and we&apos;ll follow up
            offline.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/for-companies/#featured"
              className="inline-flex rounded-[10px] bg-bright-blue px-5 py-3 text-[14px] font-extrabold text-white hover:bg-michigan-blue"
            >
              Choose a Featured plan →
            </Link>
            <Link
              href="/for-companies/"
              className="inline-flex rounded-[10px] border border-border bg-bg px-5 py-3 text-[14px] font-bold text-navy hover:border-bright-blue"
            >
              Back to For Companies
            </Link>
          </div>
        </div>
      </main>
      <CompactFooter />
    </>
  );
}
