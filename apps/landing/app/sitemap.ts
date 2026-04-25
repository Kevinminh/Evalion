import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/teamet", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/personvern-og-vilkar", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/logg-inn", changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/registrer-deg", changeFrequency: "yearly" as const, priority: 0.4 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
