import type { Metadata } from "next";
import { CitiesIndexPage } from "@/components/CitiesIndexPage";
import { CITIES } from "@/data/cities";

export const metadata: Metadata = {
  title: "Garage Door Pros by Michigan City",
  description: `Browse ${CITIES.length} Michigan cities and compare local garage door companies for repair, springs, openers, installation, and emergency service.`,
};

export default function Page() {
  return <CitiesIndexPage />;
}
