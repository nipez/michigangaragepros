import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Garage Door Maintenance in Michigan",
  description:
    "Find Michigan pros for garage door tune-ups, lubrication, and safety checks.",
  path: "/maintenance/",
});

export default function Page() {
  const service = getServiceBySlug("maintenance");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
