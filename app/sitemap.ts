import type { MetadataRoute } from "next";
import { defaultAgenda, navItems } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nda-ud-coalition.example";
  const routes = [
    ...navItems.map((item) => item.href),
    "/admin",
    ...defaultAgenda.map((item) => `/agenda/${item.slug}`)
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));
}
