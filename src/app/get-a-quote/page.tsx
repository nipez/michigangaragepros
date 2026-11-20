import type { Metadata } from "next";
import { getCityBySlug } from "@/data/cities";
import { getCompanyBySlug } from "@/data/companies";
import { representativeZipForCitySlug } from "@/data/zipCodes";
import {
  normalizeQuoteService,
  normalizeQuoteSourcePage,
} from "@/lib/quote-links";
import { buildPageMetadata } from "@/lib/seo";
import { QuoteFlow } from "@/components/QuoteFlow";

export const metadata: Metadata = buildPageMetadata({
  title: "Get a Free Quote",
  description:
    "Request a free garage door quote from local Michigan professionals. Free for homeowners, no obligation.",
  path: "/get-a-quote/",
});

export default async function GetAQuotePage({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string;
    zip?: string;
    company?: string;
    city?: string;
    cityName?: string;
    timing?: string;
    src?: string;
  }>;
}) {
  const params = await searchParams;
  const companySlug = params.company?.trim() || "";
  const company = companySlug ? getCompanyBySlug(companySlug) : undefined;

  const citySlug = params.city?.trim().toLowerCase() || "";
  const city = citySlug ? getCityBySlug(citySlug) : undefined;
  const cityName =
    city?.name ||
    params.cityName?.trim() ||
    (company ? company.city.replace(/, MI$/i, "").trim() : "") ||
    "";

  const zipFromParam = params.zip?.trim() || "";
  const zipFromCity = citySlug
    ? representativeZipForCitySlug(citySlug) || ""
    : "";
  const zipFromCompanyCity = company?.citySlug
    ? representativeZipForCitySlug(company.citySlug) || ""
    : "";

  return (
    <QuoteFlow
      initialService={normalizeQuoteService(params.service)}
      initialZip={zipFromParam || zipFromCity || zipFromCompanyCity}
      initialCompanySlug={company?.slug ?? companySlug}
      initialCompanyName={company?.name ?? ""}
      initialCityName={cityName}
      initialTiming={params.timing?.trim() || ""}
      sourcePage={normalizeQuoteSourcePage(params.src)}
    />
  );
}
