import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyProfilePage } from "@/components/CompanyProfilePage";
import { COMPANIES, getCompanyBySlug } from "@/data/companies";

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
  return {
    title: company.name,
    description: `${company.name} — garage door service in ${company.city}. ${company.rating} stars from ${company.reviews} reviews.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();
  return <CompanyProfilePage company={company} />;
}
