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
    
    // Use the domain from environment variable or fallback to production domain
    const domain = process.env.VITE_SITE_URL || 'https://holidays.islenomads.com';

    const entries: Array<{
      loc: string;
      lastmod?: string;
      changefreq?: string;
      priority?: number;
    }> = [
      {
        loc: `${domain}/`,
        priority: 1.0,
        changefreq: "weekly",
      },
      {
        loc: `${domain}/about`,
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        loc: `${domain}/contact`,
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        loc: `${domain}/blog`,
        priority: 0.9,
        changefreq: "daily",
      },
      {
        loc: `${domain}/packages`,
        priority: 0.9,
        changefreq: "weekly",
      },
      {
        loc: `${domain}/explore-maldives`,
        priority: 0.9,
        changefreq: "weekly",
      },
      {
        loc: `${domain}/island-guides`,
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        loc: `${domain}/atolls`,
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        loc: `${domain}/map`,
        priority: 0.7,
        changefreq: "monthly",
      },
      {
        loc: `${domain}/trip-planner`,
        priority: 0.7,
        changefreq: "monthly",
      },
      ...blogs.map((b) => ({
        loc: `${domain}/blog/${b.slug}`,
        lastmod: b.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "monthly" as const,
      })),
      ...guides.map((g) => ({
        loc: `${domain}/island/${g.slug || g.id}`,
        lastmod: g.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "monthly" as const,
      })),
      ...atolls.map((a) => ({
        loc: `${domain}/atoll/${a.slug}`,
        lastmod: a.updatedAt?.toISOString().split("T")[0],
        priority: 0.7,
        changefreq: "monthly" as const,
      })),
      ...attractions.map((a) => ({
        loc: `${domain}/attraction/${a.slug}`,
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
