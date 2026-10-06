import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES, COLLECTIONS } from "@/lib/store/catalog";
import { JOURNAL_POSTS } from "@/app/journal/page";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticPages = [
    "",
    "/about",
    "/materials",
    "/responsible-business",
    "/journal",
    "/stockists",
    "/bundles",
    "/outlet",
    "/coming-soon",
    "/customer-care/shipping",
    "/customer-care/warranty",
    "/customer-care/repairs",
    "/customer-care/care",
    "/customer-care/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/accessibility",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.7,
  }));

  const productPages = PRODUCTS.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/products/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const collectionPages = COLLECTIONS.map((col) => ({
    url: `${baseUrl}/collection/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const journalPages = JOURNAL_POSTS.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...collectionPages,
    ...journalPages,
  ];
}
