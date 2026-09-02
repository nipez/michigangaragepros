import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Emergency Garage Door Service in Michigan",
  description:
    "Find Michigan companies offering same-day and emergency garage door repair when the door cannot wait.",
  path: "/emergency-service/",
});

export default function Page() {
  const service = getServiceBySlug("emergency-service");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
