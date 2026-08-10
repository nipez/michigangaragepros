import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug } from "@/data/services";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Garage Door Repair in Michigan",
  description:
    "Compare local Michigan companies that repair residential garage doors, then request a free quote.",
};

export default function Page() {
  const service = getServiceBySlug("garage-door-repair");
  if (!service) notFound();
  return <ServicePage service={service} />;
}
