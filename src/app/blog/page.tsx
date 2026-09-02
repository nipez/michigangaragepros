import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { BlogIndexPage } from "@/components/BlogIndexPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Michigan Garage Door Guides & Blog",
  description:
    "Homeowner guides on garage door springs, winter troubleshooting, repair costs, and hiring a garage door company in Michigan.",
  path: "/blog/",
});

export default function Page() {
  return <BlogIndexPage />;
}
