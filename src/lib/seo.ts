import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/data/site";

/** Normalize a path to an absolute apex URL with trailing slash (except root). */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`;
  return `${SITE_URL}${withSlash}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Open Graph type — default website; use article for blog posts. */
  ogType?: "website" | "article";
  /**
   * Skip the root layout title template (`%s | Michigan Garage Pros`).
   * Use for complete SERP titles that already carry their own CTA/branding.
   */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export const DEFAULT_OG_IMAGE = "/og-default.png";

/** Canonical + Open Graph (+ optional Twitter) for indexable pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  ogType = "website",
  absoluteTitle = false,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title;
  const useAbsolute =
    absoluteTitle || title.includes(SITE_NAME);
  const ogImages = [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }];

  return {
    title: useAbsolute ? { absolute: fullTitle } : fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: ogType,
      siteName: SITE_NAME,
      locale: "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true } }),
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Michigan garage door company directory — compare local pros for repair, springs, openers, installation, and emergency service.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/pros/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Michigan Garage Pros is a statewide directory that helps homeowners compare local garage door companies and helps pros claim or feature their listings.",
    areaServed: {
      "@type": "State",
      name: "Michigan",
    },
  };
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function itemListJsonLd(input: {
  name: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@type": "ItemList",
    name: input.name,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
