import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, decimal } from "drizzle-orm/mysql-core";

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
  category: mysqlEnum("category", ["family-adventures", "solo-travel", "water-sports", "relaxation", "luxury", "adventure", "diving-snorkeling", "island-hopping"]).notNull().default("adventure"),
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

// Transports table - centralized transport/ferry data used by Trip Planner and Boat Routes
export const transports = mysqlTable("transports", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Male to Maafushi Ferry"
  fromLocation: varchar("fromLocation", { length: 255 }).notNull(), // e.g., "male"
  toLocation: varchar("toLocation", { length: 255 }).notNull(), // e.g., "maafushi-island"
  transportType: mysqlEnum("transportType", ["ferry", "speedboat", "dhoni", "seaplane"]).notNull(),
  durationMinutes: int("durationMinutes").notNull(), // Duration in minutes
  priceUSD: int("priceUSD").notNull(), // Price in USD
  capacity: int("capacity").notNull(), // Passenger capacity
  operator: varchar("operator", { length: 255 }).notNull(), // e.g., "Public Ferry", "Speedboat Express"
  departureTime: varchar("departureTime", { length: 50 }), // e.g., "06:00"
  schedule: text("schedule"), // JSON array of departure times
  amenities: text("amenities"), // JSON array of amenities
  description: text("description"),
  image: varchar("image", { length: 500 }),
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transport = typeof transports.$inferSelect;
export type InsertTransport = typeof transports.$inferInsert;

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
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
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
  guideId: int("guideId"), // Reference to island_guides
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
  contentType: mysqlEnum("contentType", ["island", "point_of_interest"]).default("island").notNull(), // Distinguish between islands and POIs like Hanifaru Bay
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
  heroImage: varchar("heroImage", { length: 500 }), // Hero image URL
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
  displayOrder: int("displayOrder").default(0).notNull(), // For ordering featured destinations
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IslandGuide = typeof islandGuides.$inferSelect;
export type InsertIslandGuide = typeof islandGuides.$inferInsert;
export type IslandGuideContentType = 'island' | 'point_of_interest';

// SEO Meta Tags Management table - stores AI-generated and approved meta tags
export const seoMetaTags = mysqlTable("seo_meta_tags", {
  id: int("id").autoincrement().primaryKey(),
  contentType: mysqlEnum("contentType", ["blog", "package", "island_guide", "boat_route", "map_location", "home", "about", "contact"]).notNull(),
  contentId: int("contentId").notNull(), // Reference to the content item
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  keywords: text("keywords"), // JSON array of keywords
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  twitterCard: varchar("twitterCard", { length: 50 }),
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  robotsIndex: varchar("robotsIndex", { length: 20 }).default("index"),
  robotsFollow: varchar("robotsFollow", { length: 20 }).default("follow"),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  // AI Generation & Approval Workflow
  status: mysqlEnum("status", ["pending", "approved", "rejected", "modified"]).default("pending").notNull(),
  confidence: int("confidence").default(0), // 0-100 confidence score
  seoScore: int("seoScore").default(0), // 0-100 SEO score
  generatedBy: varchar("generatedBy", { length: 100 }), // "ai" or "manual"
  approvedBy: int("approvedBy"), // Reference to staff.id
  rejectionReason: text("rejectionReason"),
  generatedAt: timestamp("generatedAt").defaultNow(),
  approvedAt: timestamp("approvedAt"),
  // Version tracking
  version: int("version").default(1),
  previousVersionId: int("previousVersionId"), // For rollback capability
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SeoMetaTags = typeof seoMetaTags.$inferSelect;
export type InsertSeoMetaTags = typeof seoMetaTags.$inferInsert;

// Staff Roles table
export const staffRoles = mysqlTable("staff_roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., "Editor", "Manager", "Admin"
  description: text("description"),
  permissions: text("permissions").notNull(), // JSON array of permission strings
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StaffRole = typeof staffRoles.$inferSelect;
export type InsertStaffRole = typeof staffRoles.$inferInsert;

// Staff table
export const staff = mysqlTable("staff", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: int("roleId").notNull().references(() => staffRoles.id, { onDelete: "cascade" }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  isActive: int("isActive").default(1).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = typeof staff.$inferInsert;

// Activity Log table for tracking CMS changes
export const activityLog = mysqlTable("activity_log", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull().references(() => staff.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(), // e.g., "create", "update", "delete"
  entityType: varchar("entityType", { length: 100 }).notNull(), // e.g., "blog_post", "package"
  entityId: int("entityId"),
  changes: text("changes"), // JSON object with before/after values
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;


// CRM - Customer Queries table
export const crmQueries = mysqlTable("crm_queries", {
  id: int("id").autoincrement().primaryKey(),
  // Customer Information
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  customerCountry: varchar("customerCountry", { length: 100 }),
  // Query Details
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  queryType: mysqlEnum("queryType", ["booking", "general", "complaint", "feedback", "support", "other"]).default("general").notNull(),
  // Status & Priority
  status: mysqlEnum("status", ["new", "in_progress", "waiting_customer", "resolved", "closed"]).default("new").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  // Assignment
  assignedTo: int("assignedTo").references(() => staff.id, { onDelete: "set null" }), // Staff member assigned
  // Related Information
  packageId: int("packageId").references(() => packages.id, { onDelete: "set null" }), // If related to a package
  islandGuideId: int("islandGuideId").references(() => islandGuides.id, { onDelete: "set null" }), // If related to an island
  // Tracking
  firstResponseAt: timestamp("firstResponseAt"),
  resolvedAt: timestamp("resolvedAt"),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmQuery = typeof crmQueries.$inferSelect;
export type InsertCrmQuery = typeof crmQueries.$inferInsert;

// CRM - Query Interactions (notes, emails, calls, etc.)
export const crmInteractions = mysqlTable("crm_interactions", {
  id: int("id").autoincrement().primaryKey(),
  queryId: int("queryId").notNull().references(() => crmQueries.id, { onDelete: "cascade" }),
  staffId: int("staffId").notNull().references(() => staff.id, { onDelete: "cascade" }),
  // Interaction Details
  type: mysqlEnum("type", ["note", "email", "call", "meeting", "sms"]).default("note").notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  // Status
  isInternal: int("isInternal").default(1).notNull(), // 1 = internal only, 0 = shared with customer
  // Attachments
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmInteraction = typeof crmInteractions.$inferSelect;
export type InsertCrmInteraction = typeof crmInteractions.$inferInsert;

// CRM - Customer Profiles (aggregate customer data)
export const crmCustomers = mysqlTable("crm_customers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 100 }),
  // Customer Metrics
  totalQueries: int("totalQueries").default(0),
  totalBookings: int("totalBookings").default(0),
  totalSpent: int("totalSpent").default(0), // In cents
  // Preferences
  preferredContact: mysqlEnum("preferredContact", ["email", "phone", "sms"]).default("email"),
  newsletter: int("newsletter").default(0),
  // Status
  isActive: int("isActive").default(1),
  lastContactedAt: timestamp("lastContactedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmCustomer = typeof crmCustomers.$inferSelect;
export type InsertCrmCustomer = typeof crmCustomers.$inferInsert;


// Branding & Assets Management
export const branding = mysqlTable("branding", {
  id: int("id").autoincrement().primaryKey(),
  // Logo URLs
  logoUrl: varchar("logoUrl", { length: 500 }), // Main logo with text
  logoMarkUrl: varchar("logoMarkUrl", { length: 500 }), // Logo mark only (cross icon)
  faviconUrl: varchar("faviconUrl", { length: 500 }), // Favicon
  // Logo Variants
  logoWhiteUrl: varchar("logoWhiteUrl", { length: 500 }), // White version for dark backgrounds
  logoColorUrl: varchar("logoColorUrl", { length: 500 }), // Color version
  // Branding Colors
  primaryColor: varchar("primaryColor", { length: 7 }), // Hex color code (e.g., #0D7F7F)
  accentColor: varchar("accentColor", { length: 7 }), // Accent color (e.g., #00D4D4)
  // Company Info
  companyName: varchar("companyName", { length: 255 }), // "Isle Nomads"
  tagline: varchar("tagline", { length: 500 }), // Company tagline
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Branding = typeof branding.$inferSelect;
export type InsertBranding = typeof branding.$inferInsert;

// Atolls table for Maldives region browsing
export const atolls = mysqlTable("atolls", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Kaafu Atoll"
  slug: varchar("slug", { length: 255 }).notNull().unique(), // e.g., "kaafu-atoll"
  region: varchar("region", { length: 100 }).notNull(), // "North", "Central", "South"
  description: text("description"), // Overview of the atoll
  heroImage: varchar("heroImage", { length: 500 }), // Hero image URL
  overview: text("overview"), // Detailed overview
  bestFor: varchar("bestFor", { length: 500 }), // e.g., "short stays, budget trips, surfing"
  highlights: text("highlights"), // Key highlights as JSON array
  activities: text("activities"), // Available activities as JSON array
  accommodation: text("accommodation"), // Accommodation options as JSON array
  transportation: text("transportation"), // How to reach the atoll
  bestSeason: varchar("bestSeason", { length: 255 }), // Best time to visit
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Atoll = typeof atolls.$inferSelect;
export type InsertAtoll = typeof atolls.$inferInsert;


// Activity Spots - Hierarchical structure for Surf Spots, Dive Sites, and Snorkeling Spots
export const activitySpots = mysqlTable("activity_spots", {
  id: int("id").autoincrement().primaryKey(),
  islandGuideId: int("islandGuideId").notNull(), // Reference to island_guides
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Pasta Point", "Blue Lagoon Dive Site"
  slug: varchar("slug", { length: 255 }).notNull(), // URL-friendly identifier
  spotType: mysqlEnum("spotType", ["surf_spot", "dive_site", "snorkeling_spot"]).notNull(), // Type of activity spot
  description: text("description"), // Detailed description
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("intermediate"), // Skill level required
  // Location & Access
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  accessInfo: text("accessInfo"), // How to reach the spot (boat, walk, etc.)
  // Activity Details
  bestSeason: varchar("bestSeason", { length: 255 }), // Best time to visit
  bestTime: varchar("bestTime", { length: 100 }), // Best time of day
  waterConditions: text("waterConditions"), // Current conditions, visibility, etc.
  // For Dive Sites
  maxDepth: int("maxDepth"), // Max depth in meters
  minDepth: int("minDepth"), // Min depth in meters
  marineLife: text("marineLife"), // JSON array of marine life you might see
  // For Surf Spots
  waveHeight: varchar("waveHeight", { length: 100 }), // e.g., "2-4 feet", "4-6 feet"
  waveType: varchar("waveType", { length: 100 }), // e.g., "Beach break", "Reef break"
  // For Snorkeling Spots
  coralCoverage: varchar("coralCoverage", { length: 100 }), // e.g., "90%", "Excellent"
  fishSpecies: text("fishSpecies"), // JSON array of fish species
  // General
  tips: text("tips"), // JSON array of tips and recommendations
  facilities: text("facilities"), // JSON array of nearby facilities
  images: text("images"), // JSON array of image URLs
  // SEO & Status
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  published: int("published").default(0).notNull(),
  featured: int("featured").default(0).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ActivitySpot = typeof activitySpots.$inferSelect;
export type InsertActivitySpot = typeof activitySpots.$inferInsert;
export type ActivitySpotType = 'surf_spot' | 'dive_site' | 'snorkeling_spot';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
