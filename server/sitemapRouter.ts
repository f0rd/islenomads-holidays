import { publicProcedure, router } from "./_core/trpc";
import {
  getAllBlogPosts,
  getAllPackages,
  getIslandGuides,
  getAllAtolls,
  getAllAttractionGuides,
} from "./db";

export const sitemapRouter = router({
  xml: publicProcedure.query(async () => {
    const blogs = await getAllBlogPosts();
    const packages = await getAllPackages();
    const guides = await getIslandGuides();
    const atolls = await getAllAtolls();
    const attractions = await getAllAttractionGuides();

    const entries: Array<{
      loc: string;
      lastmod?: string;
      changefreq?: string;
      priority?: number;
    }> = [
      {
        loc: "https://islenomads.com/",
        priority: 1.0,
        changefreq: "weekly",
      },
      {
        loc: "https://islenomads.com/about",
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        loc: "https://islenomads.com/contact",
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        loc: "https://islenomads.com/blog",
        priority: 0.9,
        changefreq: "daily",
      },
      {
        loc: "https://islenomads.com/packages",
        priority: 0.9,
        changefreq: "weekly",
      },
      {
        loc: "https://islenomads.com/explore-maldives",
        priority: 0.9,
        changefreq: "weekly",
      },
      {
        loc: "https://islenomads.com/island-guides",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        loc: "https://islenomads.com/atolls",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        loc: "https://islenomads.com/map",
        priority: 0.7,
        changefreq: "monthly",
      },
      {
        loc: "https://islenomads.com/trip-planner",
        priority: 0.7,
        changefreq: "monthly",
      },
      ...blogs.map((b) => ({
        loc: `https://islenomads.com/blog/${b.slug}`,
        lastmod: b.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "monthly" as const,
      })),
      ...guides.map((g) => ({
        loc: `https://islenomads.com/island/${g.slug || g.id}`,
        lastmod: g.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "monthly" as const,
      })),
      ...atolls.map((a) => ({
        loc: `https://islenomads.com/atoll/${a.slug}`,
        lastmod: a.updatedAt?.toISOString().split("T")[0],
        priority: 0.7,
        changefreq: "monthly" as const,
      })),
      ...attractions.map((a) => ({
        loc: `https://islenomads.com/attraction/${a.slug}`,
        lastmod: a.updatedAt?.toISOString().split("T")[0],
        priority: 0.7,
        changefreq: "monthly" as const,
      })),
    ];

    // Generate XML
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries
        .map((entry) => [
          "  <url>",
          `    <loc>${entry.loc}</loc>`,
          ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
          ...(entry.changefreq
            ? [`    <changefreq>${entry.changefreq}</changefreq>`]
            : []),
          ...(entry.priority !== undefined
            ? [`    <priority>${entry.priority}</priority>`]
            : []),
          "  </url>",
        ])
        .flat(),
      "</urlset>",
    ].join("\n");

    return xml;
  }),
});
