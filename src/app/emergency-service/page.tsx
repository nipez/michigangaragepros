import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Emergency Garage Door Service in Michigan",
  description:
    "Connect with local Michigan pros offering same-day and after-hours garage door emergency service.",
};

export default function Page() {
  const service = getServiceBySlug("emergency-service");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
