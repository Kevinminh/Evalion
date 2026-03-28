import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/priser", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/hjelpesenter", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/personvern", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/vilkar", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/informasjonskapsler", changeFrequency: "yearly" as const, priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
