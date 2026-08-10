import type { Metadata } from "next";
import { CompaniesIndexPage } from "@/components/CompaniesIndexPage";
import { COMPANIES } from "@/data/companies";

export const metadata: Metadata = {
  title: "Michigan Garage Door Companies",
  description: `Browse ${COMPANIES.length} garage door service companies across Michigan. Compare ratings, services, and service areas.`,
};

export default function Page() {
  return <CompaniesIndexPage />;
}
