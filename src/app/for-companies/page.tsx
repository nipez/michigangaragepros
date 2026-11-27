import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ForCompaniesPage } from "@/components/ForCompaniesPage";

export const metadata: Metadata = buildPageMetadata({
  title: "For Garage Door Pros — Claim Your Free Listing",
  description:
    "Claim your free Michigan Garage Pros listing to receive homeowner leads, reply to reviews, track performance, and upgrade to Featured placement.",
  path: "/for-companies/",
});

export default function Page() {
  return <ForCompaniesPage />;
}
