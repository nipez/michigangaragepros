import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CostGuidePage } from "@/components/CostGuidePage";
import {
  COST_GUIDE_SLUGS,
  getCostGuideBySlug,
} from "@/data/costGuides";
import { notFoundMetadata } from "@/lib/notFoundMetadata";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return COST_GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getCostGuideBySlug(slug);
  if (!guide) return notFoundMetadata;
  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: guide.path,
    absoluteTitle: true,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getCostGuideBySlug(slug);
  if (!guide) notFound();
  return <CostGuidePage guide={guide} />;
}
