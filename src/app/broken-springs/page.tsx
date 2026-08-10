import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Broken Spring Repair in Michigan",
  description:
    "Find local Michigan pros who repair and replace garage door springs. Request a free quote.",
};

export default function Page() {
  const service = getServiceBySlug("broken-springs");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
