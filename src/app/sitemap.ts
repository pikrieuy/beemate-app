import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://beemate.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/people",
    "/teams",
    "/competitions",
    "/dashboard",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}
