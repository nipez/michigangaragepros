import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { CompaniesIndexPage } from "@/components/CompaniesIndexPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Michigan Garage Door Companies",
  description:
    "Browse garage door service companies across Michigan. Compare services and service areas.",
  path: "/companies/",
});

export default function Page() {
  return <CompaniesIndexPage />;
}
