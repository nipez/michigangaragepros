import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityServicePage } from "@/components/CityServicePage";
import { getCityBySlug } from "@/data/cities";
import { PRIORITY_CITY_SLUGS } from "@/data/growth";
import { SERVICES, getServiceBySlug } from "@/data/services";
import {
  countProsForCityService,
  isCityServiceIndexable,
} from "@/lib/indexability";
import { buildCityServiceIntro } from "@/lib/localPageContent";
import { notFoundMetadata } from "@/lib/notFoundMetadata";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const params: { slug: string; service: string }[] = [];
  for (const slug of PRIORITY_CITY_SLUGS) {
    for (const service of SERVICES) {
      params.push({ slug, service: service.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}): Promise<Metadata> {
  const { slug, service: serviceSlug } = await params;
  const city = getCityBySlug(slug);
  const service = getServiceBySlug(serviceSlug);
  if (
    !city ||
    !service ||
    !(PRIORITY_CITY_SLUGS as readonly string[]).includes(slug)
  ) {
    return notFoundMetadata;
  }
  const indexable = isCityServiceIndexable(city.slug, service);
  const intro = buildCityServiceIntro(
    city,
    service,
    countProsForCityService(city.slug, service),
  );
  return buildPageMetadata({
    title: `${service.localTitle} in ${city.name}, ${city.state}`,
    description: intro.slice(0, 160),
    path: `/cities/${city.slug}/${service.slug}/`,
    noIndex: !indexable,
    followWhenNoIndex: true,
    includeCanonical: true,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}) {
  const { slug, service: serviceSlug } = await params;
  // Only ship priority city × service URLs (not all 122 cities).
  if (!(PRIORITY_CITY_SLUGS as readonly string[]).includes(slug)) {
    notFound();
  }
  const city = getCityBySlug(slug);
  const service = getServiceBySlug(serviceSlug);
  if (!city || !service) notFound();
  return <CityServicePage city={city} service={service} />;
}
