import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Garage Door Repair in Michigan",
  description:
    "Compare local Michigan companies for garage door repair — stuck, noisy, off-track, or damaged doors — then request a free quote.",
  path: "/garage-door-repair/",
});

export default function Page() {
  const service = getServiceBySlug("garage-door-repair");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
