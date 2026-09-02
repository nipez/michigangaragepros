import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ProsSearchPage } from "@/components/ProsSearchPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Find Local Garage Door Pros",
  description:
    "Enter your Michigan ZIP code or city to browse local garage door companies — compare services and service areas.",
  path: "/pros/",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; zip?: string; service?: string }>;
}) {
  const sp = await searchParams;
  const query = (sp.q ?? sp.zip ?? "").trim();
  const service = (sp.service ?? "").trim();
  return <ProsSearchPage query={query} service={service} />;
}
