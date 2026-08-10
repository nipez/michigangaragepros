import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/BlogIndexPage";

export const metadata: Metadata = {
  title: "Michigan Garage Door Guides & Blog",
  description:
    "Homeowner guides on garage door springs, winter troubleshooting, repair costs, and hiring a garage door company in Michigan.",
};

export default function Page() {
  return <BlogIndexPage />;
}
