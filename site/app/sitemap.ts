import { baseRoutes } from "@/lib/content";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return baseRoutes.flatMap((path) => {
    const zh = "https://cyano.app/" + path;
    const en = "https://cyano.app/en" + (path ? "/" + path : "");
    return [zh, en].map((url) => ({
      url,
      lastModified: new Date("2026-11-12"),
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
      alternates: { languages: { "zh-CN": zh, en } },
    }));
  });
}
