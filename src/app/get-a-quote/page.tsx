import type { Metadata } from "next";
import { QuoteFlow } from "@/components/QuoteFlow";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free garage door quote from local Michigan professionals. Free for homeowners, no obligation.",
};

export default async function GetAQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; zip?: string }>;
}) {
  const params = await searchParams;
  return (
    <QuoteFlow
      initialService={params.service ?? ""}
      initialZip={params.zip ?? ""}
    />
  );
}
