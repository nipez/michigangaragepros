import type { Metadata } from "next";
import { getCompanyBySlug } from "@/data/companies";
import { QuoteFlow } from "@/components/QuoteFlow";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free garage door quote from local Michigan professionals. Free for homeowners, no obligation.",
};

export default async function GetAQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; zip?: string; company?: string }>;
}) {
  const params = await searchParams;
  const companySlug = params.company?.trim() || "";
  const company = companySlug ? getCompanyBySlug(companySlug) : undefined;

  return (
    <QuoteFlow
      initialService={params.service ?? ""}
      initialZip={params.zip ?? ""}
      initialCompanySlug={company?.slug ?? companySlug}
      initialCompanyName={company?.name ?? ""}
    />
  );
}
