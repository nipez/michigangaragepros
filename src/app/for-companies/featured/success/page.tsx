import type { Metadata } from "next";
import { FeaturedCheckoutSuccessClient } from "@/components/FeaturedCheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Featured checkout success | Michigan Garage Pros",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function FeaturedCheckoutSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim() ?? "";

  return <FeaturedCheckoutSuccessClient sessionId={sessionId} />;
}
