import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { getHomepageCities } from "@/data/cities";
import { getTopCompanies } from "@/data/companies";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Michigan Garage Pros | Find Trusted Garage Door Pros",
  description:
    "Compare local Michigan garage-door companies, see services and coverage, and request a free quote. Free for homeowners.",
  path: "/",
});

export default function Page() {
  return (
    <HomePage
      topCompanies={getTopCompanies(3)}
      homepageCities={getHomepageCities()}
    />
  );
}
