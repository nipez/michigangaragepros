import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { CitiesIndexPage } from "@/components/CitiesIndexPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Garage Door Pros by Michigan City",
  description:
    "Browse Michigan cities and compare local garage door companies for repair, springs, openers, installation, and emergency service.",
  path: "/cities/",
});

export default function Page() {
  return <CitiesIndexPage />;
}
