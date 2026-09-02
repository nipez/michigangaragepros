import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Broken Spring Repair in Michigan",
  description:
    "Find local Michigan pros who repair and replace broken garage door springs. Request a free quote.",
  path: "/broken-springs/",
});

export default function Page() {
  const service = getServiceBySlug("broken-springs");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
