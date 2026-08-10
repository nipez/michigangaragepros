import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/data/blog";
import { CITIES } from "@/data/cities";
import { COMPANIES } from "@/data/companies";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "pros",
    "cities",
    "companies",
    "blog",
    "for-companies",
    "get-a-quote",
    ...SERVICES.map((s) => s.slug),
  ].map((path) => ({
    url: path ? `${SITE_URL}/${path}/` : `${SITE_URL}/`,
    lastModified,
    changeFrequency: path === "" || path === "pros" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "pros" || path === "cities" ? 0.9 : 0.7,
  }));

  const regionRoutes: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: `${SITE_URL}/regions/${region.slug}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE_URL}/cities/${city.slug}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const companyRoutes: MetadataRoute.Sitemap = COMPANIES.map((company) => ({
    url: `${SITE_URL}/companies/${company.slug}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(`${post.date}T12:00:00`),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...regionRoutes,
    ...cityRoutes,
    ...companyRoutes,
    ...blogRoutes,
  ];
}
