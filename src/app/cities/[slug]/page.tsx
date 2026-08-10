import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPage } from "@/components/CityPage";
import { CITIES, getCityBySlug } from "@/data/cities";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: "City Not Found" };
  return {
    title: `Garage Door Pros in ${city.name}, ${city.state}`,
    description: `Compare garage-door companies serving ${city.name}, Michigan — repair, springs, openers, installation, and emergency service.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();
  return <CityPage city={city} />;
}
