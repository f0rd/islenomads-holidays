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

// Blog posts table with comprehensive SEO fields
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
  // SEO Meta Tags
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  // Open Graph & Social Media
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  twitterCard: varchar("twitterCard", { length: 50 }),
  // SEO Optimization
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  keywordDensity: varchar("keywordDensity", { length: 50 }),
  readabilityScore: int("readabilityScore"),
  seoScore: int("seoScore"),
  // Structured Data
  schemaType: varchar("schemaType", { length: 100 }).default("BlogPosting"),
  // Canonical URL
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  // Robots Meta
  robotsIndex: varchar("robotsIndex", { length: 20 }).default("index"),
  robotsFollow: varchar("robotsFollow", { length: 20 }).default("follow"),
  // Internal Links
  internalLinks: text("internalLinks"),
  // Last Modified for sitemap
  lastModified: timestamp("lastModified").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

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

// Packages table with SEO fields
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
  // SEO Meta Tags
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  // Open Graph
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  // SEO Optimization
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  seoScore: int("seoScore"),
  // Canonical URL
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  // Robots Meta
  robotsIndex: varchar("robotsIndex", { length: 20 }).default("index"),
  robotsFollow: varchar("robotsFollow", { length: 20 }).default("follow"),
  // Structured Data
  schemaType: varchar("schemaType", { length: 100 }).default("Product"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

// Boat Routes table
export const boatRoutes = mysqlTable("boat_routes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  type: mysqlEnum("type", ["speedboat", "ferry"]).notNull(),
  fromLocation: varchar("fromLocation", { length: 255 }).notNull(),
  toLocation: varchar("toLocation", { length: 255 }).notNull(),
  fromLat: varchar("fromLat", { length: 50 }).notNull(),
  fromLng: varchar("fromLng", { length: 50 }).notNull(),
  toLat: varchar("toLat", { length: 50 }).notNull(),
  toLng: varchar("toLng", { length: 50 }).notNull(),
  distance: varchar("distance", { length: 50 }), // e.g., "45 km"
  duration: varchar("duration", { length: 100 }).notNull(), // e.g., "1 hour 30 mins"
  price: int("price").notNull(), // Price in cents
  schedule: text("schedule"), // JSON array of departure times
  capacity: int("capacity").notNull(),
  amenities: text("amenities"), // JSON array of amenities
  boatInfo: text("boatInfo"), // JSON object with boat details
  description: text("description"),
  image: varchar("image", { length: 500 }),
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoatRoute = typeof boatRoutes.$inferSelect;
export type InsertBoatRoute = typeof boatRoutes.$inferInsert;

// Map Locations table (islands, resorts, dive sites, etc.)
export const mapLocations = mysqlTable("map_locations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  type: mysqlEnum("type", ["island", "resort", "dive_site", "surf_spot", "atoll", "city"]).notNull(),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  description: text("description"),
  highlights: text("highlights"), // JSON array
  amenities: text("amenities"), // JSON array
  image: varchar("image", { length: 500 }),
  icon: varchar("icon", { length: 50 }), // Icon name for map display
  color: varchar("color", { length: 20 }), // Color for marker
  difficulty: varchar("difficulty", { length: 50 }), // For dive/surf sites
  depth: varchar("depth", { length: 50 }), // For dive sites
  waveHeight: varchar("waveHeight", { length: 50 }), // For surf spots
  rating: varchar("rating", { length: 10 }), // 0-5 rating
  reviews: int("reviews").default(0),
  population: int("population"), // For islands/cities
  priceRange: varchar("priceRange", { length: 50 }), // For resorts
  bestSeason: varchar("bestSeason", { length: 100 }),
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MapLocation = typeof mapLocations.$inferSelect;
export type InsertMapLocation = typeof mapLocations.$inferInsert;

// Island Guides table - comprehensive guides for islands with editable content
export const islandGuides = mysqlTable("island_guides", {
  id: int("id").autoincrement().primaryKey(),
  locationId: int("locationId"), // Reference to mapLocations
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  atoll: varchar("atoll", { length: 255 }),
  overview: text("overview"), // 80-200 words description
  quickFacts: text("quickFacts"), // JSON array of 8 facts
  // Transportation
  flightInfo: text("flightInfo"),
  speedboatInfo: text("speedboatInfo"),
  ferryInfo: text("ferryInfo"),
  // Activities
  topThingsToDo: text("topThingsToDo"), // JSON array of activities
  // Water Sports
  snorkelingGuide: text("snorkelingGuide"), // JSON object with spots, difficulty, tips
  divingGuide: text("divingGuide"), // JSON object with sites, difficulty, tips
  surfWatersports: text("surfWatersports"), // JSON object
  sandbankDolphinTrips: text("sandbankDolphinTrips"), // JSON object
  // Beaches & Local Rules
  beachesLocalRules: text("beachesLocalRules"), // JSON object with beaches and rules
  // Food & Cafés
  foodCafes: text("foodCafes"), // JSON array of restaurants/cafes
  // Practical Info
  currency: varchar("currency", { length: 100 }),
  language: varchar("language", { length: 100 }),
  bestTimeToVisit: varchar("bestTimeToVisit", { length: 255 }),
  whatToPack: text("whatToPack"), // JSON array
  healthTips: text("healthTips"), // JSON array
  emergencyContacts: text("emergencyContacts"), // JSON array
  // Itineraries
  threeDayItinerary: text("threeDayItinerary"), // JSON array
  fiveDayItinerary: text("fiveDayItinerary"), // JSON array
  // FAQ
  faq: text("faq"), // JSON array of Q&A
  // Media
  images: text("images"), // JSON array of image URLs
  // Coordinates
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  // SEO Fields
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  seoScore: int("seoScore"),
  // Status
  published: int("published").default(0).notNull(),
  featured: int("featured").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IslandGuide = typeof islandGuides.$inferSelect;
export type InsertIslandGuide = typeof islandGuides.$inferInsert;
