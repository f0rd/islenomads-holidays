import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, decimal, primaryKey, unique, index, longtext } from "drizzle-orm/mysql-core";

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
  fromPlaceId: int("fromPlaceId"), // Reference to places (starting point)
  toPlaceId: int("toPlaceId"), // Reference to places (destination)
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
  fromPlaceId: int("fromPlaceId"), // Reference to places (starting point)
  toPlaceId: int("toPlaceId"), // Reference to places (destination)
  fromIslandGuideId: int("fromIslandGuideId"), // Reference to island_guides (starting point) - deprecated
  toIslandGuideId: int("toIslandGuideId"), // Reference to island_guides (destination) - deprecated
  fromAtollId: int("fromAtollId"), // Reference to atolls (starting atoll)
  toAtollId: int("toAtollId"), // Reference to atolls (destination atoll)
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
  placeId: int("placeId"), // Reference to places table
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
  placeId: int("placeId"), // Reference to places table
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
  // Water Sports - Managed separately in activity_spots table
  // surfWatersports: text("surfWatersports"), // JSON object
  // sandbankDolphinTrips: text("sandbankDolphinTrips"), // JSON object
  // Attractions & Landmarks (See section)
  attractions: text("attractions"), // JSON array of landmarks/attractions with name, description, location
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
  // Nearby Locations
  nearbyAirports: text("nearbyAirports"), // JSON array of nearby airports with name, distance, iata code
  nearbyDiveSites: text("nearbyDiveSites"), // JSON array of nearby dive sites with name, distance, difficulty
  nearbySurfSpots: text("nearbySurfSpots"), // JSON array of nearby surf spots with name, distance, difficulty
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

// Places table - Unified entity for all geographical locations (islands, dive sites, surf spots, etc.)
export const places = mysqlTable("places", {
  id: int("id").autoincrement().primaryKey(),
  atollId: int("atollId"), // Foreign key to atolls (optional for non-island places)
  name: varchar("name", { length: 255 }).notNull(), // Place name
  code: varchar("code", { length: 50 }).notNull().unique(), // Unique place code
  type: mysqlEnum("type", ["island", "dive_site", "surf_spot", "snorkeling_spot", "poi"]).notNull(), // Type of place
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Place = typeof places.$inferSelect;
export type InsertPlace = typeof places.$inferInsert;

// Activity Spots - Hierarchical structure for Surf Spots, Dive Sites, and Snorkeling Spots
export const activitySpots = mysqlTable("activity_spots", {
  id: int("id").autoincrement().primaryKey(),
  placeId: int("placeId"), // Reference to places table
  islandGuideId: int("islandGuideId").notNull(), // Reference to island_guides
  atollId: int("atollId"), // Optional direct reference to atolls for easier filtering
  primaryTypeId: int("primaryTypeId"), // FK to activity_types for categorization
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Pasta Point", "Blue Lagoon Dive Site"
  slug: varchar("slug", { length: 255 }).notNull(), // URL-friendly identifier
  spotType: mysqlEnum("spotType", ["surf_spot", "dive_site", "snorkeling_spot"]).notNull(), // Type of activity spot
  category: varchar("category", { length: 100 }), // e.g., "Beginner Dive Sites", "Advanced Surf Breaks", "Manta Ray Spots"
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
  // Management & Ratings
  rating: varchar("rating", { length: 10 }), // e.g., "4.8", for sorting and recommendations
  reviewCount: int("reviewCount").default(0), // Number of reviews
  capacity: int("capacity"), // Max people per session (for operational planning)
  operatorInfo: text("operatorInfo"), // JSON with operator details (name, contact, etc.)
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


// ============================================================================
// NEW SCHEMA: Activity Types, Island-Spot Access, Experiences, Transport Routes
// ============================================================================

/**
 * Activity Types: Defines categories like diving, snorkeling, surfing, etc.
 * Allows flexible filtering and organization of all activity spots.
 */
export const activityTypes = mysqlTable("activity_types", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(), // e.g., "diving", "snorkeling", "surfing"
  name: varchar("name", { length: 100 }).notNull(), // Display name
  icon: varchar("icon", { length: 100 }), // Icon class or emoji
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ActivityType = typeof activityTypes.$inferSelect;
export type InsertActivityType = typeof activityTypes.$inferInsert;

/**
 * Island-Spot Access: Many-to-many relationship with practical metadata
 * Solves: Multiple islands can access the same spot
 * Stores: Distance, travel time, boat type, price, operator notes
 */
export const islandSpotAccess = mysqlTable(
  "island_spot_access",
  {
    id: int("id").autoincrement().primaryKey(),
    islandId: int("islandId").notNull(),
    spotId: int("spotId").notNull(),
    // Access metadata
    distanceKm: decimal("distanceKm", { precision: 6, scale: 2 }),
    travelTimeMin: int("travelTimeMin"),
    transferType: mysqlEnum("transferType", [
      "dhoni",
      "speedboat",
      "public_ferry",
      "walk",
      "mixed",
    ]),
    priceFromUsd: decimal("priceFromUsd", { precision: 8, scale: 2 }),
    operatorNotes: text("operatorNotes"),
    recommended: int("recommended").default(0).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    islandSpotAccessIdx: index("idx_island_spot_access_island").on(
      table.islandId
    ),
    spotAccessIdx: index("idx_island_spot_access_spot").on(table.spotId),
    uniqueAccess: unique("unique_island_spot_access").on(
      table.islandId,
      table.spotId
    ),
  })
);

export type IslandSpotAccess = typeof islandSpotAccess.$inferSelect;
export type InsertIslandSpotAccess = typeof islandSpotAccess.$inferInsert;

/**
 * Experiences: Bookable products like "2-tank dive", "night fishing", "sandbank trip"
 * These are the actual offerings that can be purchased/booked
 */
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  activityTypeId: int("activityTypeId").notNull(), // FK to activityTypes
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortIntro: varchar("shortIntro", { length: 500 }),
  description: text("description"),
  durationMin: int("durationMin"), // Duration in minutes
  priceFromUsd: decimal("priceFromUsd", { precision: 8, scale: 2 }),
  includes: text("includes"), // What's included (JSON or text)
  excludes: text("excludes"), // What's not included
  requirements: text("requirements"), // Certification, age, etc.
  featuredImage: varchar("featuredImage", { length: 500 }),
  published: int("published").default(0).notNull(),
  featured: int("featured").default(0).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

/**
 * Island-Experience: Many-to-many linking islands to available experiences
 * Allows "Popular things to do" on island pages
 */
export const islandExperiences = mysqlTable(
  "island_experiences",
  {
    islandId: int("islandId").notNull(),
    experienceId: int("experienceId").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.islandId, table.experienceId] }),
  })
);

export type IslandExperience = typeof islandExperiences.$inferSelect;
export type InsertIslandExperience = typeof islandExperiences.$inferInsert;

/**
 * Transport Routes: Public ferries, speedboats, private transfers
 * Stores schedule info and booking details for "How to Get There"
 */
export const transportRoutes = mysqlTable(
  "transport_routes",
  {
    id: int("id").autoincrement().primaryKey(),
    fromIslandId: int("fromIslandId").notNull(),
    toIslandId: int("toIslandId").notNull(),
    routeType: mysqlEnum("routeType", [
      "public_ferry",
      "speedboat",
      "private_transfer",
    ]).notNull(),
    operatorName: varchar("operatorName", { length: 255 }),
    scheduleText: text("scheduleText"), // Simple CMS version (e.g., "Daily 8am, 2pm, 5pm")
    durationMin: int("durationMin"),
    priceMvr: decimal("priceMvr", { precision: 8, scale: 2 }),
    priceUsd: decimal("priceUsd", { precision: 8, scale: 2 }),
    bookingInfo: text("bookingInfo"),
    sourceUrl: varchar("sourceUrl", { length: 500 }),
    lastVerifiedAt: timestamp("lastVerifiedAt"),
    isActive: int("isActive").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    fromIslandIdx: index("idx_transport_from_island").on(table.fromIslandId),
    toIslandIdx: index("idx_transport_to_island").on(table.toIslandId),
    routeIdx: index("idx_transport_route_type").on(
      table.fromIslandId,
      table.toIslandId,
      table.routeType
    ),
  })
);

export type TransportRoute = typeof transportRoutes.$inferSelect;
export type InsertTransportRoute = typeof transportRoutes.$inferInsert;

/**
 * Media: Centralized media storage for all entities
 * Replaces scattered image URLs with proper asset management
 */
export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("altText", { length: 255 }),
  caption: text("caption"),
  credit: varchar("credit", { length: 255 }),
  width: int("width"),
  height: int("height"),
  mimeType: varchar("mimeType", { length: 50 }),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * SEO: Reusable SEO metadata for islands, spots, atolls, experiences, blogs
 * Prevents duplication and centralizes SEO management
 */
export const seoMetadata = mysqlTable(
  "seo_metadata",
  {
    id: int("id").autoincrement().primaryKey(),
    entityType: mysqlEnum("entityType", [
      "island",
      "spot",
      "atoll",
      "experience",
      "blog",
    ]).notNull(),
    entityId: int("entityId").notNull(),
    metaTitle: varchar("metaTitle", { length: 255 }),
    metaDescription: varchar("metaDescription", { length: 500 }),
    metaKeywords: varchar("metaKeywords", { length: 500 }),
    ogImageId: int("ogImageId"), // FK to media
    twitterCard: varchar("twitterCard", { length: 50 }),
    canonicalUrl: varchar("canonicalUrl", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    entityIdx: unique("unique_seo_entity").on(table.entityType, table.entityId),
  })
);

export type SeoMetadata = typeof seoMetadata.$inferSelect;
export type InsertSeoMetadata = typeof seoMetadata.$inferInsert;

/**
 * Spot Types (Optional): For multi-type tags per spot
 * E.g., a spot can be snorkeling + beach + photography
 */
export const spotTypes = mysqlTable(
  "spot_types",
  {
    spotId: int("spotId").notNull(),
    activityTypeId: int("activityTypeId").notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.spotId, table.activityTypeId] }),
  })
);

export type SpotType = typeof spotTypes.$inferSelect;
export type InsertSpotType = typeof spotTypes.$inferInsert;


// Airports table for Maldives airports
export const airports = mysqlTable("airports", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Malé International Airport"
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  iataCode: varchar("iataCode", { length: 10 }).notNull().unique(), // e.g., "MLE"
  icaoCode: varchar("icaoCode", { length: 10 }), // e.g., "VRMM"
  description: text("description"),
  // Location
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  atoll: varchar("atoll", { length: 255 }), // Which atoll the airport is in
  // Facilities & Services
  facilities: text("facilities"), // JSON array of facilities
  airlines: text("airlines"), // JSON array of airlines
  // Connectivity
  internationalFlights: int("internationalFlights").default(1).notNull(),
  domesticFlights: int("domesticFlights").default(0).notNull(),
  // Contact & Info
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  // Status
  isActive: int("isActive").default(1).notNull(),
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Airport = typeof airports.$inferSelect;
export type InsertAirport = typeof airports.$inferInsert;

// Airport Routes table - speedboat/ferry routes from airports to islands
export const airportRoutes = mysqlTable("airport_routes", {
  id: int("id").autoincrement().primaryKey(),
  airportId: int("airportId").notNull().references(() => airports.id, { onDelete: "cascade" }),
  islandGuideId: int("islandGuideId").notNull().references(() => islandGuides.id, { onDelete: "cascade" }),
  // Route Details
  transportType: mysqlEnum("transportType", ["speedboat", "ferry", "seaplane", "dhoni"]).notNull(),
  distance: varchar("distance", { length: 100 }), // e.g., "45 km"
  duration: varchar("duration", { length: 100 }).notNull(), // e.g., "20 mins"
  price: int("price"), // Price in cents
  // Availability
  frequency: varchar("frequency", { length: 100 }), // e.g., "Daily"
  operatingDays: varchar("operatingDays", { length: 100 }), // e.g., "Daily"
  // Additional Info
  description: text("description"),
  notes: text("notes"),
  // Status
  isPopular: int("isPopular").default(0).notNull(),
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AirportRoute = typeof airportRoutes.$inferSelect;
export type InsertAirportRoute = typeof airportRoutes.$inferInsert;


/**
 * UNIFIED GEOGRAPHICAL ENTITIES SCHEMA
 * Single source of truth for all geographical entities (islands, dive sites, surf spots, etc.)
 * Replaces: places, mapLocations, activitySpots (consolidates into one structure)
 */

/**
 * Geographical Entities: Core table for all locations
 * Stores islands, dive sites, surf spots, snorkeling spots, and POIs
 */
export const geographicalEntities = mysqlTable(
  "geographical_entities",
  {
    id: int("id").autoincrement().primaryKey(),
    
    // Identity
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    code: varchar("code", { length: 50 }).unique(),
    
    // Classification
    entityType: mysqlEnum("entityType", [
      "island",
      "dive_site",
      "surf_spot",
      "snorkeling_spot",
      "airport",
      "resort",
      "poi",
    ]).notNull(),
    
    // Location
    latitude: varchar("latitude", { length: 50 }),
    longitude: varchar("longitude", { length: 50 }),
    atollId: int("atollId"),
    
    // Basic Content
    description: text("description"),
    overview: text("overview"),
    heroImage: varchar("heroImage", { length: 500 }),
    
    // Status
    isActive: int("isActive").default(1).notNull(),
    published: int("published").default(0).notNull(),
    
    // Timestamps
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    slugIdx: index("idx_geo_entities_slug").on(table.slug),
    typeIdx: index("idx_geo_entities_type").on(table.entityType),
    atollIdx: index("idx_geo_entities_atoll").on(table.atollId),
  })
);

export type GeographicalEntity = typeof geographicalEntities.$inferSelect;
export type InsertGeographicalEntity = typeof geographicalEntities.$inferInsert;

/**
 * Entity Details: Extended content for geographical entities (1-to-1 relationship)
 * Stores island-specific content: activities, food, itineraries, FAQ, etc.
 */
export const entityDetails = mysqlTable(
  "entity_details",
  {
    id: int("id").autoincrement().primaryKey(),
    entityId: int("entityId")
      .notNull()
      .unique()
      .references(() => geographicalEntities.id, { onDelete: "cascade" }),
    
    // Island-specific Fields
    bestTimeToVisit: varchar("bestTimeToVisit", { length: 500 }),
    currency: varchar("currency", { length: 255 }),
    language: varchar("language", { length: 255 }),
    
    // Transportation
    flightInfo: text("flightInfo"),
    speedboatInfo: text("speedboatInfo"),
    ferryInfo: text("ferryInfo"),
    
    // Content Sections (JSON arrays - using longtext for large content)
    activities: longtext("activities"), // JSON: [{name, emoji, description}, ...]
    restaurants: longtext("restaurants"), // JSON: [{name, type, description}, ...]
    whatToPack: longtext("whatToPack"), // JSON: [{item, reason}, ...]
    healthTips: longtext("healthTips"), // JSON: [{tip, details}, ...]
    emergencyContacts: longtext("emergencyContacts"), // JSON: [{type, number, name}, ...]
    attractions: longtext("attractions"), // JSON: [{name, description, location}, ...]
    
    // Itineraries
    threeDayItinerary: longtext("threeDayItinerary"), // JSON: [{day, activities}, ...]
    fiveDayItinerary: longtext("fiveDayItinerary"), // JSON: [{day, activities}, ...]
    
    // FAQ
    faq: longtext("faq"), // JSON: [{question, answer}, ...]
    
    // Quick Facts
    quickFacts: longtext("quickFacts"), // JSON: [{label, value}, ...]
    
    // Timestamps
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    entityIdx: index("idx_entity_details_entity").on(table.entityId),
  })
);

export type EntityDetail = typeof entityDetails.$inferSelect;
export type InsertEntityDetail = typeof entityDetails.$inferInsert;

/**
 * Entity Relationships: Links between geographical entities
 * Examples: island → nearby dive site, island → nearby surf spot, etc.
 */
export const entityRelationships = mysqlTable(
  "entity_relationships",
  {
    id: int("id").autoincrement().primaryKey(),
    
    sourceEntityId: int("sourceEntityId")
      .notNull()
      .references(() => geographicalEntities.id, { onDelete: "cascade" }),
    
    targetEntityId: int("targetEntityId")
      .notNull()
      .references(() => geographicalEntities.id, { onDelete: "cascade" }),
    
    // Relationship Type
    relationshipType: mysqlEnum("relationshipType", [
      "nearby_dive_site",
      "nearby_surf_spot",
      "nearby_snorkeling_spot",
      "airport_access",
      "resort_access",
      "related_island",
    ]).notNull(),
    
    // Metadata
    distance: varchar("distance", { length: 50 }), // e.g., "2 km"
    difficulty: varchar("difficulty", { length: 50 }), // e.g., "Beginner", "Intermediate", "Advanced"
    notes: text("notes"),
    sortOrder: int("sortOrder").default(0).notNull(),
    
    // Timestamps
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    sourceIdx: index("idx_entity_rel_source").on(table.sourceEntityId),
    targetIdx: index("idx_entity_rel_target").on(table.targetEntityId),
    typeIdx: index("idx_entity_rel_type").on(table.relationshipType),
    uniqueRel: unique("unique_entity_relationship").on(
      table.sourceEntityId,
      table.targetEntityId,
      table.relationshipType
    ),
  })
);

export type EntityRelationship = typeof entityRelationships.$inferSelect;
export type InsertEntityRelationship = typeof entityRelationships.$inferInsert;

/**
 * Entity Media: Images and media files for geographical entities
 * Replaces scattered image URLs with proper asset management
 */
export const entityMedia = mysqlTable(
  "entity_media",
  {
    id: int("id").autoincrement().primaryKey(),
    
    entityId: int("entityId")
      .notNull()
      .references(() => geographicalEntities.id, { onDelete: "cascade" }),
    
    mediaType: mysqlEnum("mediaType", ["image", "video", "audio"]).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    
    caption: text("caption"),
    altText: varchar("altText", { length: 255 }),
    displayOrder: int("displayOrder").default(0).notNull(),
    
    // Timestamps
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    entityIdx: index("idx_entity_media_entity").on(table.entityId),
    typeIdx: index("idx_entity_media_type").on(table.mediaType),
  })
);

export type EntityMedia = typeof entityMedia.$inferSelect;
export type InsertEntityMedia = typeof entityMedia.$inferInsert;
