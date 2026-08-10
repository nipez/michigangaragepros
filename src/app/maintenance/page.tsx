import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Garage Door Maintenance in Michigan",
  description:
    "Find local Michigan pros for garage door tune-ups, lubrication, and safety checks.",
};

export default function Page() {
  const service = getServiceBySlug("maintenance");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
