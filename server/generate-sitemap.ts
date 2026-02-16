/**
 * Sitemap Generation Script for Isle Nomads Holidays
 * Generates XML sitemap for all public pages and dynamic content
 */

import { getDb } from "./db";
import { islandGuides, atolls, packages, blogPosts } from "../drizzle/schema";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

async function generateSitemap() {
  const baseUrl = "https://islenomads.com";
  const entries: SitemapEntry[] = [];
  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { url: "/", priority: 1.0, changefreq: "weekly" as const },
    { url: "/about", priority: 0.9, changefreq: "monthly" as const },
    { url: "/map", priority: 0.8, changefreq: "weekly" as const },
    { url: "/explore-maldives", priority: 0.9, changefreq: "weekly" as const },
    { url: "/trip-planner", priority: 0.8, changefreq: "weekly" as const },
    { url: "/packages", priority: 0.9, changefreq: "weekly" as const },
    { url: "/blog", priority: 0.8, changefreq: "daily" as const },
    { url: "/boat-routes", priority: 0.7, changefreq: "monthly" as const },
    { url: "/island-guides", priority: 0.8, changefreq: "weekly" as const },
    { url: "/atolls", priority: 0.8, changefreq: "monthly" as const },
  ];

  // Add static pages
  staticPages.forEach((page) => {
    entries.push({
      url: `${baseUrl}${page.url}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    const db = await getDb();
    if (!db) {
      console.error("Database connection failed");
      return;
    }

    // Fetch all island guides
    const islandGuidesData = await db.select().from(islandGuides);
    islandGuidesData.forEach((guide: any) => {
      entries.push({
        url: `${baseUrl}/island/${guide.islandId}`,
        lastmod: guide.updatedAt ? new Date(guide.updatedAt).toISOString().split("T")[0] : today,
        changefreq: "monthly" as const,
        priority: 0.7,
      });
    });

    // Fetch all atolls
    const atollsData = await db.select().from(atolls);
    atollsData.forEach((atoll: any) => {
      entries.push({
        url: `${baseUrl}/atoll/${atoll.slug}`,
        lastmod: atoll.updatedAt ? new Date(atoll.updatedAt).toISOString().split("T")[0] : today,
        changefreq: "monthly" as const,
        priority: 0.7,
      });
    });

    // Fetch all packages
    const packagesData = await db.select().from(packages);
    packagesData.forEach((pkg: any) => {
      entries.push({
        url: `${baseUrl}/packages#${pkg.slug}`,
        lastmod: pkg.updatedAt ? new Date(pkg.updatedAt).toISOString().split("T")[0] : today,
        changefreq: "weekly" as const,
        priority: 0.7,
      });
    });

    // Fetch all blog posts
    const blogsData = await db.select().from(blogPosts);
    blogsData.forEach((blog: any) => {
      entries.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString().split("T")[0] : today,
        changefreq: "weekly" as const,
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Error fetching dynamic content:", error);
  }

  // Generate XML
  const xml = generateXml(entries);

  // Write to public directory
  const outputPath = path.join(process.cwd(), "client", "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`Total entries: ${entries.length}`);
}

function generateXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map(
      (entry) =>
        `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Run if executed directly
if (require.main === module) {
  generateSitemap().catch(console.error);
}

export { generateSitemap };
