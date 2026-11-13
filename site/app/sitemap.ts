import type { MetadataRoute } from "next";
import { baseRoutes } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return baseRoutes.flatMap((routePath) => {
    const zh = routePath ? `https://cyano.app/${routePath}` : "https://cyano.app";
    const en = routePath ? `https://cyano.app/en/${routePath}` : "https://cyano.app/en";
    return [zh, en].map((url) => ({
      url,
      lastModified: new Date("2026-11-12"),
      changeFrequency: "monthly" as const,
      priority: routePath ? 0.75 : 1,
      alternates: {
        languages: {
          "zh-CN": zh,
          en,
        },
      },
    }));
  });
}
