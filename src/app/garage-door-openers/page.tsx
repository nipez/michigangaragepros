import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Garage Door Opener Repair in Michigan",
  description:
    "Compare Michigan technicians for garage door opener repair or replacement, then request a free quote.",
  path: "/garage-door-openers/",
});

export default function Page() {
  const service = getServiceBySlug("garage-door-openers");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
