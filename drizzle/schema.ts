import {
  pgTable,
  pgEnum,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  decimal,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS (Postgres requires CREATE TYPE separately)
// ============================================================================

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const packageCategoryEnum = pgEnum("package_category", [
  "family-adventures",
  "solo-travel",
  "water-sports",
  "relaxation",
  "luxury",
  "adventure",
  "diving-snorkeling",
  "island-hopping",
]);
export const transportTypeEnum = pgEnum("transport_type", [
  "ferry",
  "speedboat",
  "dhoni",
  "seaplane",
]);
export const boatRouteTypeEnum = pgEnum("boat_route_type", [
  "speedboat",
  "ferry",
]);
export const islandGuideContentTypeEnum = pgEnum("island_guide_content_type", [
  "island",
  "point_of_interest",
]);
export const seoContentTypeEnum = pgEnum("seo_content_type", [
  "blog",
  "package",
  "island_guide",
  "boat_route",
  "map_location",
  "home",
  "about",
  "contact",
]);
export const seoStatusEnum = pgEnum("seo_status", [
  "pending",
  "approved",
  "rejected",
  "modified",
]);
export const crmQueryTypeEnum = pgEnum("crm_query_type", [
  "booking",
  "general",
  "complaint",
  "feedback",
  "support",
  "other",
]);
export const crmQueryStatusEnum = pgEnum("crm_query_status", [
  "new",
  "in_progress",
  "waiting_customer",
  "resolved",
  "closed",
]);
export const crmQueryPriorityEnum = pgEnum("crm_query_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const crmInteractionTypeEnum = pgEnum("crm_interaction_type", [
  "note",
  "email",
  "call",
  "meeting",
  "sms",
]);
export const crmPreferredContactEnum = pgEnum("crm_preferred_contact", [
  "email",
  "phone",
  "sms",
]);
export const placeTypeEnum = pgEnum("place_type", [
  "island",
  "dive_site",
  "surf_spot",
  "snorkeling_spot",
  "poi",
  "airport",
]);
export const spotTypeEnum = pgEnum("spot_type", [
  "surf_spot",
  "dive_site",
  "snorkeling_spot",
]);
export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const transferTypeEnum = pgEnum("transfer_type", [
  "dhoni",
  "speedboat",
  "public_ferry",
  "walk",
  "mixed",
]);
export const seoEntityTypeEnum = pgEnum("seo_entity_type", [
  "island",
  "spot",
  "atoll",
  "experience",
  "blog",
]);
export const attractionTypeEnum = pgEnum("attraction_type", [
  "dive_site",
  "surf_spot",
  "snorkeling_spot",
  "poi",
]);
export const attractionDifficultyEnum = pgEnum("attraction_difficulty", [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);
export const airportTransportTypeEnum = pgEnum("airport_transport_type", [
  "speedboat",
  "ferry",
  "seaplane",
  "dhoni",
]);

// ============================================================================
// TABLES
// ============================================================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  featuredImage: varchar("featuredImage", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  tags: varchar("tags", { length: 500 }),
  published: integer("published").default(0).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  twitterCard: varchar("twitterCard", { length: 50 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  keywordDensity: varchar("keywordDensity", { length: 50 }),
  readabilityScore: integer("readabilityScore"),
  seoScore: integer("seoScore"),
  schemaType: varchar("schemaType", { length: 100 }).default("BlogPosting"),
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  robotsIndex: varchar("robotsIndex", { length: 20 }).default("index"),
  robotsFollow: varchar("robotsFollow", { length: 20 }).default("follow"),
  internalLinks: text("internalLinks"),
  lastModified: timestamp("lastModified").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  content: text("content").notNull(),
  approved: integer("approved").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  category: packageCategoryEnum("category").notNull().default("adventure"),
  highlights: text("highlights"),
  amenities: text("amenities"),
  image: varchar("image", { length: 500 }),
  featured: integer("featured").default(0).notNull(),
  published: integer("published").default(0).notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  seoScore: integer("seoScore"),
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  robotsIndex: varchar("robotsIndex", { length: 20 }).default("index"),
  robotsFollow: varchar("robotsFollow", { length: 20 }).default("follow"),
  schemaType: varchar("schemaType", { length: 100 }).default("Product"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

export const transports = pgTable("transports", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  fromLocation: varchar("fromLocation", { length: 255 }).notNull(),
  toLocation: varchar("toLocation", { length: 255 }).notNull(),
  fromPlaceId: integer("fromPlaceId"),
  toPlaceId: integer("toPlaceId"),
  transportType: transportTypeEnum("transportType").notNull(),
  durationMinutes: integer("durationMinutes").notNull(),
  priceUSD: integer("priceUSD").notNull(),
  capacity: integer("capacity").notNull(),
  operator: varchar("operator", { length: 255 }).notNull(),
  departureTime: varchar("departureTime", { length: 50 }),
  schedule: text("schedule"),
  amenities: text("amenities"),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  published: integer("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Transport = typeof transports.$inferSelect;
export type InsertTransport = typeof transports.$inferInsert;

export const boatRoutes = pgTable("boat_routes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  type: boatRouteTypeEnum("type").notNull(),
  fromPlaceId: integer("fromPlaceId"),
  toPlaceId: integer("toPlaceId"),
  fromIslandGuideId: integer("fromIslandGuideId"),
  toIslandGuideId: integer("toIslandGuideId"),
  fromAtollId: integer("fromAtollId"),
  toAtollId: integer("toAtollId"),
  fromLocation: varchar("fromLocation", { length: 255 }).notNull(),
  toLocation: varchar("toLocation", { length: 255 }).notNull(),
  fromLat: varchar("fromLat", { length: 50 }).notNull(),
  fromLng: varchar("fromLng", { length: 50 }).notNull(),
  toLat: varchar("toLat", { length: 50 }).notNull(),
  toLng: varchar("toLng", { length: 50 }).notNull(),
  distance: varchar("distance", { length: 50 }),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  schedule: text("schedule"),
  capacity: integer("capacity").notNull(),
  amenities: text("amenities"),
  boatInfo: text("boatInfo"),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BoatRoute = typeof boatRoutes.$inferSelect;
export type InsertBoatRoute = typeof boatRoutes.$inferInsert;

export const islandGuides = pgTable("island_guides", {
  id: serial("id").primaryKey(),
  placeId: integer("placeId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  contentType: islandGuideContentTypeEnum("contentType").default("island").notNull(),
  atoll: varchar("atoll", { length: 255 }),
  overview: text("overview"),
  quickFacts: text("quickFacts"),
  flightInfo: text("flightInfo"),
  speedboatInfo: text("speedboatInfo"),
  ferryInfo: text("ferryInfo"),
  topThingsToDo: text("topThingsToDo"),
  attractions: text("attractions"),
  beachesLocalRules: text("beachesLocalRules"),
  foodCafes: text("foodCafes"),
  currency: varchar("currency", { length: 100 }),
  language: varchar("language", { length: 100 }),
  bestTimeToVisit: varchar("bestTimeToVisit", { length: 255 }),
  whatToPack: text("whatToPack"),
  healthTips: text("healthTips"),
  emergencyContacts: text("emergencyContacts"),
  threeDayItinerary: text("threeDayItinerary"),
  fiveDayItinerary: text("fiveDayItinerary"),
  faq: text("faq"),
  nearbyAirports: text("nearbyAirports"),
  nearbyDiveSites: text("nearbyDiveSites"),
  nearbySurfSpots: text("nearbySurfSpots"),
  heroImage: varchar("heroImage", { length: 500 }),
  images: text("images"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  seoScore: integer("seoScore"),
  published: integer("published").default(0).notNull(),
  featured: integer("featured").default(0).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type IslandGuide = typeof islandGuides.$inferSelect;
export type InsertIslandGuide = typeof islandGuides.$inferInsert;
export type IslandGuideContentType = "island" | "point_of_interest";

export const seoMetaTags = pgTable("seo_meta_tags", {
  id: serial("id").primaryKey(),
  contentType: seoContentTypeEnum("contentType").notNull(),
  contentId: integer("contentId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  keywords: text("keywords"),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  twitterCard: varchar("twitterCard", { length: 50 }),
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  robotsIndex: varchar("robotsIndex", { length: 20 }).default("index"),
  robotsFollow: varchar("robotsFollow", { length: 20 }).default("follow"),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  status: seoStatusEnum("status").default("pending").notNull(),
  confidence: integer("confidence").default(0),
  seoScore: integer("seoScore").default(0),
  generatedBy: varchar("generatedBy", { length: 100 }),
  approvedBy: integer("approvedBy"),
  rejectionReason: text("rejectionReason"),
  generatedAt: timestamp("generatedAt").defaultNow(),
  approvedAt: timestamp("approvedAt"),
  version: integer("version").default(1),
  previousVersionId: integer("previousVersionId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SeoMetaTags = typeof seoMetaTags.$inferSelect;
export type InsertSeoMetaTags = typeof seoMetaTags.$inferInsert;

export const staffRoles = pgTable("staff_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type StaffRole = typeof staffRoles.$inferSelect;
export type InsertStaffRole = typeof staffRoles.$inferInsert;

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("roleId")
    .notNull()
    .references(() => staffRoles.id, { onDelete: "cascade" }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  isActive: integer("isActive").default(1).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = typeof staff.$inferInsert;

export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  staffId: integer("staffId")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: integer("entityId"),
  changes: text("changes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

export const crmQueries = pgTable("crm_queries", {
  id: serial("id").primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  customerCountry: varchar("customerCountry", { length: 100 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  queryType: crmQueryTypeEnum("queryType").default("general").notNull(),
  status: crmQueryStatusEnum("status").default("new").notNull(),
  priority: crmQueryPriorityEnum("priority").default("medium").notNull(),
  assignedTo: integer("assignedTo").references(() => staff.id, {
    onDelete: "set null",
  }),
  packageId: integer("packageId").references(() => packages.id, {
    onDelete: "set null",
  }),
  islandGuideId: integer("islandGuideId").references(() => islandGuides.id, {
    onDelete: "set null",
  }),
  firstResponseAt: timestamp("firstResponseAt"),
  resolvedAt: timestamp("resolvedAt"),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CrmQuery = typeof crmQueries.$inferSelect;
export type InsertCrmQuery = typeof crmQueries.$inferInsert;

export const crmInteractions = pgTable("crm_interactions", {
  id: serial("id").primaryKey(),
  queryId: integer("queryId")
    .notNull()
    .references(() => crmQueries.id, { onDelete: "cascade" }),
  staffId: integer("staffId")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  type: crmInteractionTypeEnum("type").default("note").notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  isInternal: integer("isInternal").default(1).notNull(),
  attachments: text("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CrmInteraction = typeof crmInteractions.$inferSelect;
export type InsertCrmInteraction = typeof crmInteractions.$inferInsert;

export const crmCustomers = pgTable("crm_customers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 100 }),
  totalQueries: integer("totalQueries").default(0),
  totalBookings: integer("totalBookings").default(0),
  totalSpent: integer("totalSpent").default(0),
  preferredContact: crmPreferredContactEnum("preferredContact").default("email"),
  newsletter: integer("newsletter").default(0),
  isActive: integer("isActive").default(1),
  lastContactedAt: timestamp("lastContactedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CrmCustomer = typeof crmCustomers.$inferSelect;
export type InsertCrmCustomer = typeof crmCustomers.$inferInsert;

export const branding = pgTable("branding", {
  id: serial("id").primaryKey(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  logoMarkUrl: varchar("logoMarkUrl", { length: 500 }),
  faviconUrl: varchar("faviconUrl", { length: 500 }),
  logoWhiteUrl: varchar("logoWhiteUrl", { length: 500 }),
  logoColorUrl: varchar("logoColorUrl", { length: 500 }),
  primaryColor: varchar("primaryColor", { length: 7 }),
  accentColor: varchar("accentColor", { length: 7 }),
  companyName: varchar("companyName", { length: 255 }),
  tagline: varchar("tagline", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Branding = typeof branding.$inferSelect;
export type InsertBranding = typeof branding.$inferInsert;

export const atolls = pgTable("atolls", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  region: varchar("region", { length: 100 }).notNull(),
  description: text("description"),
  heroImage: varchar("heroImage", { length: 500 }),
  overview: text("overview"),
  bestFor: varchar("bestFor", { length: 500 }),
  highlights: text("highlights"),
  activities: text("activities"),
  accommodation: text("accommodation"),
  transportation: text("transportation"),
  bestSeason: varchar("bestSeason", { length: 255 }),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Atoll = typeof atolls.$inferSelect;
export type InsertAtoll = typeof atolls.$inferInsert;

export const places = pgTable("places", {
  id: serial("id").primaryKey(),
  atollId: integer("atollId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: placeTypeEnum("type").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  description: text("description"),
  highlights: text("highlights"),
  amenities: text("amenities"),
  image: varchar("image", { length: 500 }),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  difficulty: varchar("difficulty", { length: 50 }),
  depth: varchar("depth", { length: 50 }),
  waveHeight: varchar("waveHeight", { length: 50 }),
  rating: varchar("rating", { length: 10 }),
  reviews: integer("reviews").default(0),
  population: integer("population"),
  priceRange: varchar("priceRange", { length: 50 }),
  bestSeason: varchar("bestSeason", { length: 100 }),
  guideId: integer("guideId"),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Place = typeof places.$inferSelect;
export type InsertPlace = typeof places.$inferInsert;

export const activitySpots = pgTable("activity_spots", {
  id: serial("id").primaryKey(),
  placeId: integer("placeId"),
  islandGuideId: integer("islandGuideId").notNull(),
  atollId: integer("atollId"),
  primaryTypeId: integer("primaryTypeId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  spotType: spotTypeEnum("spotType").notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  difficulty: difficultyEnum("difficulty").default("intermediate"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  accessInfo: text("accessInfo"),
  bestSeason: varchar("bestSeason", { length: 255 }),
  bestTime: varchar("bestTime", { length: 100 }),
  waterConditions: text("waterConditions"),
  maxDepth: integer("maxDepth"),
  minDepth: integer("minDepth"),
  marineLife: text("marineLife"),
  waveHeight: varchar("waveHeight", { length: 100 }),
  waveType: varchar("waveType", { length: 100 }),
  coralCoverage: varchar("coralCoverage", { length: 100 }),
  fishSpecies: text("fishSpecies"),
  tips: text("tips"),
  facilities: text("facilities"),
  images: text("images"),
  rating: varchar("rating", { length: 10 }),
  reviewCount: integer("reviewCount").default(0),
  capacity: integer("capacity"),
  operatorInfo: text("operatorInfo"),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  published: integer("published").default(0).notNull(),
  featured: integer("featured").default(0).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ActivitySpot = typeof activitySpots.$inferSelect;
export type InsertActivitySpot = typeof activitySpots.$inferInsert;
export type ActivitySpotType = "surf_spot" | "dive_site" | "snorkeling_spot";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export const activityTypes = pgTable("activity_types", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  description: text("description"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ActivityType = typeof activityTypes.$inferSelect;
export type InsertActivityType = typeof activityTypes.$inferInsert;

export const islandSpotAccess = pgTable(
  "island_spot_access",
  {
    id: serial("id").primaryKey(),
    islandId: integer("islandId").notNull(),
    spotId: integer("spotId").notNull(),
    distanceKm: decimal("distanceKm", { precision: 6, scale: 2 }),
    travelTimeMin: integer("travelTimeMin"),
    transferType: transferTypeEnum("transferType"),
    priceFromUsd: decimal("priceFromUsd", { precision: 8, scale: 2 }),
    operatorNotes: text("operatorNotes"),
    recommended: integer("recommended").default(0).notNull(),
    sortOrder: integer("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_island_spot_access_island").on(table.islandId),
    index("idx_island_spot_access_spot").on(table.spotId),
    unique("unique_island_spot_access").on(table.islandId, table.spotId),
  ],
);

export type IslandSpotAccess = typeof islandSpotAccess.$inferSelect;
export type InsertIslandSpotAccess = typeof islandSpotAccess.$inferInsert;

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  activityTypeId: integer("activityTypeId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortIntro: varchar("shortIntro", { length: 500 }),
  description: text("description"),
  durationMin: integer("durationMin"),
  priceFromUsd: decimal("priceFromUsd", { precision: 8, scale: 2 }),
  includes: text("includes"),
  excludes: text("excludes"),
  requirements: text("requirements"),
  featuredImage: varchar("featuredImage", { length: 500 }),
  published: integer("published").default(0).notNull(),
  featured: integer("featured").default(0).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

export const islandExperiences = pgTable(
  "island_experiences",
  {
    islandId: integer("islandId").notNull(),
    experienceId: integer("experienceId").notNull(),
    sortOrder: integer("sortOrder").default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.islandId, table.experienceId] })],
);

export type IslandExperience = typeof islandExperiences.$inferSelect;
export type InsertIslandExperience = typeof islandExperiences.$inferInsert;

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("altText", { length: 255 }),
  caption: text("caption"),
  credit: varchar("credit", { length: 255 }),
  width: integer("width"),
  height: integer("height"),
  mimeType: varchar("mimeType", { length: 50 }),
  fileSize: integer("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: serial("id").primaryKey(),
    entityType: seoEntityTypeEnum("entityType").notNull(),
    entityId: integer("entityId").notNull(),
    metaTitle: varchar("metaTitle", { length: 255 }),
    metaDescription: varchar("metaDescription", { length: 500 }),
    metaKeywords: varchar("metaKeywords", { length: 500 }),
    ogImageId: integer("ogImageId"),
    twitterCard: varchar("twitterCard", { length: 50 }),
    canonicalUrl: varchar("canonicalUrl", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [unique("unique_seo_entity").on(table.entityType, table.entityId)],
);

export type SeoMetadata = typeof seoMetadata.$inferSelect;
export type InsertSeoMetadata = typeof seoMetadata.$inferInsert;

export const spotTypes = pgTable(
  "spot_types",
  {
    spotId: integer("spotId").notNull(),
    activityTypeId: integer("activityTypeId").notNull(),
  },
  (table) => [primaryKey({ columns: [table.spotId, table.activityTypeId] })],
);

export type SpotType = typeof spotTypes.$inferSelect;
export type InsertSpotType = typeof spotTypes.$inferInsert;

export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  iataCode: varchar("iataCode", { length: 10 }).notNull().unique(),
  icaoCode: varchar("icaoCode", { length: 10 }),
  description: text("description"),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  atoll: varchar("atoll", { length: 255 }),
  facilities: text("facilities"),
  airlines: text("airlines"),
  internationalFlights: integer("internationalFlights").default(1).notNull(),
  domesticFlights: integer("domesticFlights").default(0).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  isActive: integer("isActive").default(1).notNull(),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Airport = typeof airports.$inferSelect;
export type InsertAirport = typeof airports.$inferInsert;

export const airportRoutes = pgTable("airport_routes", {
  id: serial("id").primaryKey(),
  airportId: integer("airportId")
    .notNull()
    .references(() => airports.id, { onDelete: "cascade" }),
  islandGuideId: integer("islandGuideId")
    .notNull()
    .references(() => islandGuides.id, { onDelete: "cascade" }),
  transportType: airportTransportTypeEnum("transportType").notNull(),
  distance: varchar("distance", { length: 100 }),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: integer("price"),
  frequency: varchar("frequency", { length: 100 }),
  operatingDays: varchar("operatingDays", { length: 100 }),
  description: text("description"),
  notes: text("notes"),
  isPopular: integer("isPopular").default(0).notNull(),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AirportRoute = typeof airportRoutes.$inferSelect;
export type InsertAirportRoute = typeof airportRoutes.$inferInsert;

export const attractionGuides = pgTable("attraction_guides", {
  id: serial("id").primaryKey(),
  placeId: integer("placeId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  attractionType: attractionTypeEnum("attractionType").notNull(),
  overview: text("overview"),
  quickFacts: text("quickFacts"),
  difficulty: attractionDifficultyEnum("difficulty"),
  waterConditions: text("waterConditions"),
  bestSeason: varchar("bestSeason", { length: 255 }),
  seasonalInfo: text("seasonalInfo"),
  depthRange: varchar("depthRange", { length: 100 }),
  waveHeight: varchar("waveHeight", { length: 100 }),
  marineLife: text("marineLife"),
  accessInfo: text("accessInfo"),
  nearestIsland: varchar("nearestIsland", { length: 255 }),
  distanceFromIsland: varchar("distanceFromIsland", { length: 100 }),
  facilities: text("facilities"),
  amenities: text("amenities"),
  safetyTips: text("safetyTips"),
  localRules: text("localRules"),
  restrictions: text("restrictions"),
  typicalCost: varchar("typicalCost", { length: 100 }),
  bookingInfo: text("bookingInfo"),
  heroImage: varchar("heroImage", { length: 500 }),
  images: text("images"),
  videos: text("videos"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  seoScore: integer("seoScore"),
  published: integer("published").default(0).notNull(),
  featured: integer("featured").default(0).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AttractionGuide = typeof attractionGuides.$inferSelect;
export type InsertAttractionGuide = typeof attractionGuides.$inferInsert;

export const attractionIslandLinks = pgTable("attraction_island_links", {
  id: serial("id").primaryKey(),
  attractionGuideId: integer("attractionGuideId").notNull(),
  islandGuideId: integer("islandGuideId").notNull(),
  distance: varchar("distance", { length: 100 }),
  travelTime: varchar("travelTime", { length: 100 }),
  transportMethod: varchar("transportMethod", { length: 100 }),
  notes: text("notes"),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AttractionIslandLink = typeof attractionIslandLinks.$inferSelect;
export type InsertAttractionIslandLink = typeof attractionIslandLinks.$inferInsert;

export const cmsPages = pgTable("cms_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  sections: text("sections"),
  heroTitle: varchar("heroTitle", { length: 255 }),
  heroSubtitle: varchar("heroSubtitle", { length: 500 }),
  heroImage: varchar("heroImage", { length: 500 }),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 500 }),
  metaKeywords: varchar("metaKeywords", { length: 500 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: varchar("ogDescription", { length: 500 }),
  ogImage: varchar("ogImage", { length: 500 }),
  published: integer("published").default(0).notNull(),
  featured: integer("featured").default(0).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  authorId: integer("authorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type CMSPage = typeof cmsPages.$inferSelect;
export type InsertCMSPage = typeof cmsPages.$inferInsert;

export const heroSettings = pgTable("hero_settings", {
  id: serial("id").primaryKey(),
  pageSlug: varchar("pageSlug", { length: 255 }).notNull().unique(),
  heroTitle: varchar("heroTitle", { length: 255 }).notNull(),
  heroSubtitle: varchar("heroSubtitle", { length: 500 }),
  heroImageUrl: varchar("heroImageUrl", { length: 500 }).notNull(),
  overlayOpacity: integer("overlayOpacity").default(70).notNull(),
  gradientColorStart: varchar("gradientColorStart", { length: 50 })
    .default("primary")
    .notNull(),
  gradientColorEnd: varchar("gradientColorEnd", { length: 50 })
    .default("primary")
    .notNull(),
  gradientOpacityStart: integer("gradientOpacityStart").default(85).notNull(),
  gradientOpacityEnd: integer("gradientOpacityEnd").default(70).notNull(),
  textColor: varchar("textColor", { length: 50 })
    .default("primary-foreground")
    .notNull(),
  subtitleColor: varchar("subtitleColor", { length: 50 })
    .default("primary-foreground")
    .notNull(),
  minHeight: varchar("minHeight", { length: 50 }).default("min-h-96").notNull(),
  published: integer("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type HeroSettings = typeof heroSettings.$inferSelect;
export type InsertHeroSettings = typeof heroSettings.$inferInsert;
