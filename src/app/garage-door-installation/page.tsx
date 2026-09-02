import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Garage Door Installation in Michigan",
  description:
    "Compare Michigan companies for new garage door installation and full replacements, then request quotes.",
  path: "/garage-door-installation/",
});

export default function Page() {
  const service = getServiceBySlug("garage-door-installation");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
