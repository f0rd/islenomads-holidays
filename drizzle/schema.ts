import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Blog posts table
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  featuredImage: varchar("featuredImage", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  tags: varchar("tags", { length: 500 }),
  published: int("published").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert & { metaTitle?: string; metaDescription?: string; metaKeywords?: string };

// Blog comments table
export const blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  content: text("content").notNull(),
  approved: int("approved").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

// Packages table
export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: int("price").notNull(), // Price in cents
  duration: varchar("duration", { length: 100 }).notNull(), // e.g., "5 days"
  destination: varchar("destination", { length: 255 }).notNull(),
  highlights: text("highlights"), // JSON array of highlights
  amenities: text("amenities"), // JSON array of amenities
  image: varchar("image", { length: 500 }),
  featured: int("featured").default(0).notNull(),
  published: int("published").default(0).notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;