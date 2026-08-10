import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Garage Door Opener Repair in Michigan",
  description:
    "Find local Michigan technicians for garage door opener repair or replacement. Free quotes.",
};

export default function Page() {
  const service = getServiceBySlug("garage-door-openers");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
