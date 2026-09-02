import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ForCompaniesPage } from "@/components/ForCompaniesPage";

export const metadata: Metadata = buildPageMetadata({
  title: "For Garage Door Companies",
  description:
    "Claim your free Michigan Garage Pros company page and get in front of homeowners looking for garage door service.",
  path: "/for-companies/",
});

export default function Page() {
  return <ForCompaniesPage />;
}
