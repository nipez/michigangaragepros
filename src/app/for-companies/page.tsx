import type { Metadata } from "next";
import { ForCompaniesPage } from "@/components/ForCompaniesPage";

export const metadata: Metadata = {
  title: "For Garage Door Companies",
  description:
    "Claim your free Michigan Garage Pros profile and get in front of homeowners looking for garage door service.",
};

export default function Page() {
  return <ForCompaniesPage />;
}
