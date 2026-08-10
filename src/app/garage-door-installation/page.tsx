import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "New Garage Door Installation in Michigan",
  description:
    "Compare local Michigan companies for new garage door installation and full replacements. Free quotes.",
};

export default function Page() {
  const service = getServiceBySlug("garage-door-installation");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
