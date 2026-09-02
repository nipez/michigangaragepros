import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyProfilePage } from "@/components/CompanyProfilePage";
import {
  COMPANIES,
  getCompanyAboutDisplay,
  getCompanyBySlug,
} from "@/data/companies";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Company Not Found" };
  const about = getCompanyAboutDisplay(company);
  return buildPageMetadata({
    title: company.name,
    description:
      about.slice(0, 155) +
      (about.length > 155 ? "…" : ""),
    path: `/companies/${company.slug}/`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();
  // Claim status is fetched client-side so this page stays statically generated
  // and avoids Worker 1102 from SSR'ing the full companies dataset.
  return <CompanyProfilePage company={company} />;
}
