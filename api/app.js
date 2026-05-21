// server/_core/app.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { eq as eq5 } from "drizzle-orm";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, and, desc, asc, isNotNull, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// drizzle/schema.ts
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
  index
} from "drizzle-orm/pg-core";
var roleEnum = pgEnum("role", ["user", "admin"]);
var packageCategoryEnum = pgEnum("package_category", [
  "family-adventures",
  "solo-travel",
  "water-sports",
  "relaxation",
  "luxury",
  "adventure",
  "diving-snorkeling",
  "island-hopping"
]);
var transportTypeEnum = pgEnum("transport_type", [
  "ferry",
  "speedboat",
  "dhoni",
  "seaplane"
]);
var boatRouteTypeEnum = pgEnum("boat_route_type", [
  "speedboat",
  "ferry"
]);
var islandGuideContentTypeEnum = pgEnum("island_guide_content_type", [
  "island",
  "point_of_interest"
]);
var seoContentTypeEnum = pgEnum("seo_content_type", [
  "blog",
  "package",
  "island_guide",
  "boat_route",
  "map_location",
  "home",
  "about",
  "contact"
]);
var seoStatusEnum = pgEnum("seo_status", [
  "pending",
  "approved",
  "rejected",
  "modified"
]);
var crmQueryTypeEnum = pgEnum("crm_query_type", [
  "booking",
  "general",
  "complaint",
  "feedback",
  "support",
  "other"
]);
var crmQueryStatusEnum = pgEnum("crm_query_status", [
  "new",
  "in_progress",
  "waiting_customer",
  "resolved",
  "closed"
]);
var crmQueryPriorityEnum = pgEnum("crm_query_priority", [
  "low",
  "medium",
  "high",
  "urgent"
]);
var crmInteractionTypeEnum = pgEnum("crm_interaction_type", [
  "note",
  "email",
  "call",
  "meeting",
  "sms"
]);
var crmPreferredContactEnum = pgEnum("crm_preferred_contact", [
  "email",
  "phone",
  "sms"
]);
var placeTypeEnum = pgEnum("place_type", [
  "island",
  "dive_site",
  "surf_spot",
  "snorkeling_spot",
  "poi",
  "airport"
]);
var spotTypeEnum = pgEnum("spot_type", [
  "surf_spot",
  "dive_site",
  "snorkeling_spot"
]);
var difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced"
]);
var transferTypeEnum = pgEnum("transfer_type", [
  "dhoni",
  "speedboat",
  "public_ferry",
  "walk",
  "mixed"
]);
var seoEntityTypeEnum = pgEnum("seo_entity_type", [
  "island",
  "spot",
  "atoll",
  "experience",
  "blog"
]);
var attractionTypeEnum = pgEnum("attraction_type", [
  "dive_site",
  "surf_spot",
  "snorkeling_spot",
  "poi"
]);
var attractionDifficultyEnum = pgEnum("attraction_difficulty", [
  "beginner",
  "intermediate",
  "advanced",
  "expert"
]);
var airportTransportTypeEnum = pgEnum("airport_transport_type", [
  "speedboat",
  "ferry",
  "seaplane",
  "dhoni"
]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var blogPosts = pgTable("blog_posts", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  content: text("content").notNull(),
  approved: integer("approved").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var packages = pgTable("packages", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var transports = pgTable("transports", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var boatRoutes = pgTable("boat_routes", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var islandGuides = pgTable("island_guides", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var seoMetaTags = pgTable("seo_meta_tags", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var staffRoles = pgTable("staff_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("roleId").notNull().references(() => staffRoles.id, { onDelete: "cascade" }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  isActive: integer("isActive").default(1).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  staffId: integer("staffId").notNull().references(() => staff.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: integer("entityId"),
  changes: text("changes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var crmQueries = pgTable("crm_queries", {
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
    onDelete: "set null"
  }),
  packageId: integer("packageId").references(() => packages.id, {
    onDelete: "set null"
  }),
  islandGuideId: integer("islandGuideId").references(() => islandGuides.id, {
    onDelete: "set null"
  }),
  firstResponseAt: timestamp("firstResponseAt"),
  resolvedAt: timestamp("resolvedAt"),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var crmInteractions = pgTable("crm_interactions", {
  id: serial("id").primaryKey(),
  queryId: integer("queryId").notNull().references(() => crmQueries.id, { onDelete: "cascade" }),
  staffId: integer("staffId").notNull().references(() => staff.id, { onDelete: "cascade" }),
  type: crmInteractionTypeEnum("type").default("note").notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  isInternal: integer("isInternal").default(1).notNull(),
  attachments: text("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var crmCustomers = pgTable("crm_customers", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var branding = pgTable("branding", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var atolls = pgTable("atolls", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var places = pgTable("places", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var activitySpots = pgTable("activity_spots", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var activityTypes = pgTable("activity_types", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  description: text("description"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var islandSpotAccess = pgTable(
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
    updatedAt: timestamp("updatedAt").defaultNow().notNull()
  },
  (table) => [
    index("idx_island_spot_access_island").on(table.islandId),
    index("idx_island_spot_access_spot").on(table.spotId),
    unique("unique_island_spot_access").on(table.islandId, table.spotId)
  ]
);
var experiences = pgTable("experiences", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var islandExperiences = pgTable(
  "island_experiences",
  {
    islandId: integer("islandId").notNull(),
    experienceId: integer("experienceId").notNull(),
    sortOrder: integer("sortOrder").default(0).notNull()
  },
  (table) => [primaryKey({ columns: [table.islandId, table.experienceId] })]
);
var media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("altText", { length: 255 }),
  caption: text("caption"),
  credit: varchar("credit", { length: 255 }),
  width: integer("width"),
  height: integer("height"),
  mimeType: varchar("mimeType", { length: 50 }),
  fileSize: integer("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var seoMetadata = pgTable(
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
    updatedAt: timestamp("updatedAt").defaultNow().notNull()
  },
  (table) => [unique("unique_seo_entity").on(table.entityType, table.entityId)]
);
var spotTypes = pgTable(
  "spot_types",
  {
    spotId: integer("spotId").notNull(),
    activityTypeId: integer("activityTypeId").notNull()
  },
  (table) => [primaryKey({ columns: [table.spotId, table.activityTypeId] })]
);
var airports = pgTable("airports", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var airportRoutes = pgTable("airport_routes", {
  id: serial("id").primaryKey(),
  airportId: integer("airportId").notNull().references(() => airports.id, { onDelete: "cascade" }),
  islandGuideId: integer("islandGuideId").notNull().references(() => islandGuides.id, { onDelete: "cascade" }),
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var attractionGuides = pgTable("attraction_guides", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var attractionIslandLinks = pgTable("attraction_island_links", {
  id: serial("id").primaryKey(),
  attractionGuideId: integer("attractionGuideId").notNull(),
  islandGuideId: integer("islandGuideId").notNull(),
  distance: varchar("distance", { length: 100 }),
  travelTime: varchar("travelTime", { length: 100 }),
  transportMethod: varchar("transportMethod", { length: 100 }),
  notes: text("notes"),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var cmsPages = pgTable("cms_pages", {
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
  publishedAt: timestamp("publishedAt")
});
var heroSettings = pgTable("hero_settings", {
  id: serial("id").primaryKey(),
  pageSlug: varchar("pageSlug", { length: 255 }).notNull().unique(),
  heroTitle: varchar("heroTitle", { length: 255 }).notNull(),
  heroSubtitle: varchar("heroSubtitle", { length: 500 }),
  heroImageUrl: varchar("heroImageUrl", { length: 500 }).notNull(),
  overlayOpacity: integer("overlayOpacity").default(70).notNull(),
  gradientColorStart: varchar("gradientColorStart", { length: 50 }).default("primary").notNull(),
  gradientColorEnd: varchar("gradientColorEnd", { length: 50 }).default("primary").notNull(),
  gradientOpacityStart: integer("gradientOpacityStart").default(85).notNull(),
  gradientOpacityEnd: integer("gradientOpacityEnd").default(70).notNull(),
  textColor: varchar("textColor", { length: 50 }).default("primary-foreground").notNull(),
  subtitleColor: varchar("subtitleColor", { length: 50 }).default("primary-foreground").notNull(),
  minHeight: varchar("minHeight", { length: 50 }).default("min-h-96").notNull(),
  published: integer("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

// server/db.ts
var _db = null;
async function getAllTransports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transports).where(eq(transports.published, 1));
}
async function getAllTransportsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transports);
}
async function getTransportById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(transports).where(eq(transports.id, id)).limit(1);
  return result[0];
}
async function createTransport(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(transports).values(data).returning({ id: transports.id });
  const transport = await getTransportById(id);
  return transport || null;
}
async function updateTransport(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(transports).set(data).where(eq(transports.id, id));
  const transport = await getTransportById(id);
  return transport || null;
}
async function deleteTransport(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(transports).where(eq(transports.id, id));
  return true;
}
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function getSeoMetaTags(contentType, contentId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(seoMetaTags).where(
    and(
      eq(seoMetaTags.contentType, contentType),
      eq(seoMetaTags.contentId, contentId)
    )
  ).limit(1);
  return result[0];
}
async function getApprovedSeoMetaTags(contentType, contentId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(seoMetaTags).where(
    and(
      eq(seoMetaTags.contentType, contentType),
      eq(seoMetaTags.contentId, contentId),
      eq(seoMetaTags.status, "approved")
    )
  ).limit(1);
  return result[0];
}
async function createSeoMetaTags(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(seoMetaTags).values(data).returning({ id: seoMetaTags.id });
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}
async function getSeoMetaTagsById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(seoMetaTags).where(eq(seoMetaTags.id, id)).limit(1);
  return result[0];
}
async function updateSeoMetaTags(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(seoMetaTags).set(data).where(eq(seoMetaTags.id, id));
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}
async function approveSeoMetaTags(id, approvedBy) {
  const db = await getDb();
  if (!db) return null;
  await db.update(seoMetaTags).set({
    status: "approved",
    approvedBy,
    approvedAt: /* @__PURE__ */ new Date()
  }).where(eq(seoMetaTags.id, id));
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}
async function rejectSeoMetaTags(id, rejectionReason) {
  const db = await getDb();
  if (!db) return null;
  await db.update(seoMetaTags).set({
    status: "rejected",
    rejectionReason
  }).where(eq(seoMetaTags.id, id));
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}
async function getSeoMetaTagsByContentType(contentType, status) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(seoMetaTags).where(and(
      eq(seoMetaTags.contentType, contentType),
      eq(seoMetaTags.status, status)
    )).orderBy(desc(seoMetaTags.createdAt));
  }
  return db.select().from(seoMetaTags).where(eq(seoMetaTags.contentType, contentType)).orderBy(desc(seoMetaTags.createdAt));
}
async function deleteSeoMetaTags(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(seoMetaTags).where(eq(seoMetaTags.id, id));
  return true;
}
async function getBoatRoutes(published) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(boatRoutes);
  if (published !== void 0) {
    return query.where(eq(boatRoutes.published, published ? 1 : 0));
  }
  return query;
}
async function getBoatRouteBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(boatRoutes).where(eq(boatRoutes.slug, slug)).limit(1);
  return result[0];
}
async function createBoatRoute(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(boatRoutes).values(data).returning({ id: boatRoutes.id });
  const route = await getBoatRouteById(id);
  return route || null;
}
async function getBoatRouteById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(boatRoutes).where(eq(boatRoutes.id, id)).limit(1);
  return result[0];
}
async function updateBoatRoute(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(boatRoutes).set(data).where(eq(boatRoutes.id, id));
  const route = await getBoatRouteById(id);
  return route || null;
}
async function deleteBoatRoute(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(boatRoutes).where(eq(boatRoutes.id, id));
  return true;
}
async function getBoatRoutesWithIslands() {
  const db = await getDb();
  if (!db) return [];
  const routes = await db.select().from(boatRoutes).where(eq(boatRoutes.published, 1));
  const enriched = await Promise.all(
    routes.map(async (route) => {
      let fromIsland;
      let toIsland;
      if (route.fromIslandGuideId) {
        fromIsland = await getIslandGuideById(route.fromIslandGuideId);
      }
      if (route.toIslandGuideId) {
        toIsland = await getIslandGuideById(route.toIslandGuideId);
      }
      return { ...route, fromIsland, toIsland };
    })
  );
  return enriched;
}
async function getBoatRoutesFromIsland(islandGuideId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boatRoutes).where(
    and(
      eq(boatRoutes.fromIslandGuideId, islandGuideId),
      eq(boatRoutes.published, 1)
    )
  );
}
async function getBoatRoutesToIsland(islandGuideId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boatRoutes).where(
    and(
      eq(boatRoutes.toIslandGuideId, islandGuideId),
      eq(boatRoutes.published, 1)
    )
  );
}
async function getBoatRoutesFromLocation(location) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boatRoutes).where(
    and(
      eq(boatRoutes.fromLocation, location),
      eq(boatRoutes.published, 1)
    )
  );
}
async function getBoatRoutesToLocation(location) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boatRoutes).where(
    and(
      eq(boatRoutes.toLocation, location),
      eq(boatRoutes.published, 1)
    )
  );
}
async function getPlaces(published) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(places);
  if (published !== void 0) {
    return query.where(eq(places.published, published ? 1 : 0));
  }
  return query;
}
async function getPlaceBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
  return result[0];
}
async function createPlace(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(places).values(data).returning({ id: places.id });
  const place = await getPlaceById(id);
  return place || null;
}
async function getPlaceById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(places).where(eq(places.id, id)).limit(1);
  return result[0];
}
async function updatePlace(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(places).set(data).where(eq(places.id, id));
  const place = await getPlaceById(id);
  return place || null;
}
async function deletePlace(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(places).where(eq(places.id, id));
  return true;
}
async function getMapLocations(published) {
  return getPlaces(published);
}
async function getMapLocationBySlug(slug) {
  return getPlaceBySlug(slug);
}
async function createMapLocation(data) {
  return createPlace(data);
}
async function getMapLocationById(id) {
  return getPlaceById(id);
}
async function updateMapLocation(id, data) {
  return updatePlace(id, data);
}
async function deleteMapLocation(id) {
  return deletePlace(id);
}
async function getMapLocationWithGuide(id) {
  return getPlaceWithGuide(id);
}
async function getIslandGuides(published) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(islandGuides).leftJoin(places, eq(places.name, islandGuides.name));
  if (published !== void 0) {
    query = query.where(eq(islandGuides.published, published ? 1 : 0));
  }
  const results = await query;
  return results.map((row) => ({
    ...row.island_guides,
    placeId: row.places?.id
  }));
}
async function getFeaturedIslandGuides(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(islandGuides).where(eq(islandGuides.featured, 1)).orderBy(islandGuides.displayOrder).limit(limit);
  return result;
}
async function getIslandGuideBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(islandGuides).where(eq(islandGuides.slug, slug)).limit(1);
  return result[0];
}
async function getIslandGuideByIslandId(islandId) {
  const db = await getDb();
  if (!db) return void 0;
  const place = await db.select().from(places).where(eq(places.id, islandId)).limit(1);
  if (!place || !place[0]) return void 0;
  const placeData = place[0];
  const result = await db.select().from(islandGuides).where(eq(islandGuides.name, placeData.name)).limit(1);
  return result[0];
}
async function getPlaceWithGuide(placeId) {
  const db = await getDb();
  if (!db) return void 0;
  const place = await db.select().from(places).where(eq(places.id, placeId)).limit(1);
  if (!place || !place[0]) return void 0;
  let guide = null;
  const guideResult = await db.select().from(islandGuides).where(eq(islandGuides.name, place[0].name)).limit(1);
  guide = guideResult[0] || null;
  return {
    place: place[0],
    guide
  };
}
async function createIslandGuide(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(islandGuides).values(data).returning({ id: islandGuides.id });
  const guide = await getIslandGuideById(id);
  return guide || null;
}
async function getIslandGuideById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(islandGuides).where(eq(islandGuides.id, id)).limit(1);
  return result[0];
}
async function updateIslandGuide(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(islandGuides).set(data).where(eq(islandGuides.id, id));
  const guide = await getIslandGuideById(id);
  return guide || null;
}
async function updateDisplayOrder(updates) {
  const db = await getDb();
  if (!db) return false;
  try {
    for (const update of updates) {
      await db.update(islandGuides).set({ displayOrder: update.displayOrder }).where(eq(islandGuides.id, update.id));
    }
    return true;
  } catch (error) {
    console.error("Error updating display order:", error);
    return false;
  }
}
async function deleteIslandGuide(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(islandGuides).where(eq(islandGuides.id, id));
  return true;
}
async function getBlogPostBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}
async function createBlogPost(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(blogPosts).values(data).returning({ id: blogPosts.id });
  const post = await getBlogPostById(id);
  return post || null;
}
async function getBlogPostById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}
async function updateBlogPost(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  const post = await getBlogPostById(id);
  return post || null;
}
async function deleteBlogPost(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return true;
}
async function getPackageBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(packages).where(eq(packages.slug, slug)).limit(1);
  return result[0];
}
async function createPackage(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(packages).values(data).returning({ id: packages.id });
  const pkg = await getPackageById(id);
  return pkg || null;
}
async function getPackageById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  return result[0];
}
async function updatePackage(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(packages).set(data).where(eq(packages.id, id));
  const pkg = await getPackageById(id);
  return pkg || null;
}
async function deletePackage(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(packages).where(eq(packages.id, id));
  return true;
}
async function getStaffById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  return result[0];
}
async function createStaff(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(staff).values(data).returning({ id: staff.id });
  const staffMember = await getStaffById(id);
  return staffMember || null;
}
async function updateStaff(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(staff).set(data).where(eq(staff.id, id));
  const staffMember = await getStaffById(id);
  return staffMember || null;
}
async function getAllBlogPosts(limit) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(blogPosts).where(eq(blogPosts.published, 1));
  if (limit) {
    query = query.limit(limit);
  }
  return query;
}
async function getAllBlogPostsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}
async function getAllPackages(limit) {
  try {
    const db = await getDb();
    if (!db) return [];
    let query = db.select().from(packages).where(eq(packages.published, 1));
    if (limit) {
      query = query.limit(limit);
    }
    const result = await query;
    return result;
  } catch (error) {
    console.error("[getAllPackages] Error fetching packages:", error);
    return [];
  }
}
async function getAllPackagesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(packages).orderBy(desc(packages.createdAt));
}
async function getAllIslandGuidesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(islandGuides).orderBy(desc(islandGuides.createdAt));
}
async function getBlogComments(postId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogComments).where(eq(blogComments.postId, postId));
}
async function createBlogComment(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(blogComments).values(data).returning({ id: blogComments.id });
  const comment = await db.select().from(blogComments).where(eq(blogComments.id, id)).limit(1);
  return comment[0] || null;
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}
async function upsertUser(data) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getUserByOpenId(data.openId);
  if (existing) {
    await db.update(users).set({
      ...data,
      lastSignedIn: /* @__PURE__ */ new Date()
    }).where(eq(users.openId, data.openId));
    const updated = await getUserByOpenId(data.openId);
    return updated || null;
  } else {
    const [{ id }] = await db.insert(users).values(data).returning({ id: users.id });
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user[0] || null;
  }
}
async function getCrmQueries(status) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(crmQueries).orderBy(desc(crmQueries.createdAt));
  if (status) {
    return query.where(eq(crmQueries.status, status));
  }
  return query;
}
async function getCrmQueryById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(crmQueries).where(eq(crmQueries.id, id)).limit(1);
  return result[0];
}
async function createCrmQuery(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(crmQueries).values(data).returning({ id: crmQueries.id });
  const query = await getCrmQueryById(id);
  return query || null;
}
async function updateCrmQuery(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(crmQueries).set(data).where(eq(crmQueries.id, id));
  const query = await getCrmQueryById(id);
  return query || null;
}
async function deleteCrmQuery(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(crmQueries).where(eq(crmQueries.id, id));
  return true;
}
async function getCrmInteractions(queryId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmInteractions).where(eq(crmInteractions.queryId, queryId)).orderBy(desc(crmInteractions.createdAt));
}
async function createCrmInteraction(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(crmInteractions).values(data).returning({ id: crmInteractions.id });
  const interaction = await db.select().from(crmInteractions).where(eq(crmInteractions.id, id)).limit(1);
  return interaction[0] || null;
}
async function getCrmCustomerByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(crmCustomers).where(eq(crmCustomers.email, email)).limit(1);
  return result[0];
}
async function createCrmCustomer(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(crmCustomers).values(data).returning({ id: crmCustomers.id });
  const customer = await db.select().from(crmCustomers).where(eq(crmCustomers.id, id)).limit(1);
  return customer[0] || null;
}
async function updateCrmCustomer(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(crmCustomers).set(data).where(eq(crmCustomers.id, id));
  const customer = await db.select().from(crmCustomers).where(eq(crmCustomers.id, id)).limit(1);
  return customer[0] || null;
}
async function getStaffByUserId(userId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(staff).innerJoin(staffRoles, eq(staff.roleId, staffRoles.id)).where(eq(staff.userId, userId)).limit(1);
  if (!result[0]) return null;
  return {
    ...result[0].staff,
    role: result[0].staff_roles
  };
}
async function getStaffRoleByName(roleName) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(staffRoles).where(eq(staffRoles.name, roleName)).limit(1);
  return result[0] || null;
}
async function createStaffRole(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(staffRoles).values(data).returning({ id: staffRoles.id });
  const role = await db.select().from(staffRoles).where(eq(staffRoles.id, id)).limit(1);
  return role[0] || null;
}
async function getAllStaff() {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(staff).innerJoin(staffRoles, eq(staff.roleId, staffRoles.id));
  return results.map((r) => ({
    ...r.staff,
    role: r.staff_roles
  }));
}
async function logActivity(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(activityLog).values(data).returning({ id: activityLog.id });
  const log = await db.select().from(activityLog).where(eq(activityLog.id, id)).limit(1);
  return log[0] || null;
}
async function getAllAtolls() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(atolls).where(eq(atolls.published, 1)).orderBy(atolls.name);
}
async function getAllAtollsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(atolls).orderBy(atolls.name);
}
async function getAtollBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(atolls).where(eq(atolls.slug, slug)).limit(1);
  return result[0];
}
async function getAtollById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(atolls).where(eq(atolls.id, id)).limit(1);
  return result[0];
}
async function createAtoll(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(atolls).values(data).returning({ id: atolls.id });
  const atoll = await getAtollById(id);
  return atoll || null;
}
async function updateAtoll(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(atolls).set(data).where(eq(atolls.id, id));
  const atoll = await getAtollById(id);
  return atoll || null;
}
async function deleteAtoll(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(atolls).where(eq(atolls.id, id));
  return true;
}
async function getAtollsByRegion(region) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(atolls).where(and(eq(atolls.region, region), eq(atolls.published, 1))).orderBy(atolls.name);
}
async function getIslandsByAtollId(atollId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(places).leftJoin(islandGuides, eq(places.name, islandGuides.name)).where(and(
    eq(places.atollId, atollId),
    eq(places.type, "island")
  )).orderBy(places.name);
  return result.map((row) => ({
    ...row.places,
    ...row.island_guides,
    id: row.island_guides?.id || row.places.id
  }));
}
async function getFeaturedIslandsByAtollId(atollId, limit = 5) {
  const db = await getDb();
  if (!db) return [];
  const atoll = await getAtollById(atollId);
  if (!atoll) return [];
  const result = await db.select().from(islandGuides).where(and(
    eq(islandGuides.atoll, atoll.name),
    eq(islandGuides.featured, 1),
    eq(islandGuides.published, 1)
  )).orderBy(islandGuides.displayOrder).limit(limit);
  return result;
}
async function getIslandGuidesWithActivitySpots() {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(islandGuides).leftJoin(places, eq(places.name, islandGuides.name)).where(eq(islandGuides.published, 1));
  const islandsWithSpots = await Promise.all(
    results.map(async (row) => {
      const island = row.island_guides;
      const spots = await db.select().from(activitySpots).where(eq(activitySpots.islandGuideId, island.id));
      return {
        ...island,
        placeId: row.places?.id,
        activitySpots: spots
      };
    })
  );
  return islandsWithSpots;
}
async function getAllActivityTypes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activityTypes).orderBy(activityTypes.sortOrder);
}
async function getActivityTypeByKey(key) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(activityTypes).where(eq(activityTypes.key, key)).limit(1);
  return result[0];
}
async function getSpotsByIsland(islandId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    spot: activitySpots,
    access: islandSpotAccess,
    activityType: activityTypes
  }).from(islandSpotAccess).innerJoin(activitySpots, eq(islandSpotAccess.spotId, activitySpots.id)).leftJoin(activityTypes, eq(activitySpots.primaryTypeId, activityTypes.id)).where(eq(islandSpotAccess.islandId, islandId)).orderBy(islandSpotAccess.sortOrder);
  return result;
}
async function getExperiencesByIsland(islandId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    experience: experiences,
    activityType: activityTypes
  }).from(islandExperiences).innerJoin(experiences, eq(islandExperiences.experienceId, experiences.id)).leftJoin(activityTypes, eq(experiences.activityTypeId, activityTypes.id)).where(eq(islandExperiences.islandId, islandId)).orderBy(islandExperiences.sortOrder);
  return result;
}
async function getExperiencesByActivityType(activityTypeId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(experiences).where(eq(experiences.activityTypeId, activityTypeId)).orderBy(experiences.displayOrder);
  return result;
}
async function getIslandWithSpots(islandId) {
  const db = await getDb();
  if (!db) return null;
  const island = await db.select().from(islandGuides).where(eq(islandGuides.id, islandId)).limit(1);
  if (!island || !island[0]) return null;
  const spots = await getSpotsByIsland(islandId);
  const experienceData = await getExperiencesByIsland(islandId);
  const routes = await getBoatRoutesFromLocation(island[0].name);
  return {
    island: island[0],
    spots,
    experiences: experienceData,
    boatRoutes: routes
  };
}
async function getRegularIslandsByAtollId(atollId) {
  const db = await getDb();
  if (!db) return [];
  const atoll = await getAtollById(atollId);
  if (!atoll) return [];
  const result = await db.select().from(islandGuides).where(and(
    eq(islandGuides.atoll, atoll.name),
    eq(islandGuides.featured, 0),
    eq(islandGuides.published, 1)
  )).orderBy(islandGuides.name);
  return result;
}
async function getIslandBySlug(slug) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(islandGuides).leftJoin(places, eq(islandGuides.name, places.name)).where(eq(islandGuides.slug, slug)).limit(1);
  if (result && result[0]) {
    const row2 = result[0];
    return {
      ...row2.places,
      ...row2.island_guides,
      id: row2.island_guides?.id || row2.places?.id
    };
  }
  const placesResult = await db.select().from(places).leftJoin(islandGuides, eq(places.name, islandGuides.name)).where(and(
    eq(places.slug, slug),
    eq(places.type, "island")
  )).limit(1);
  if (!placesResult || !placesResult[0]) return null;
  const row = placesResult[0];
  return {
    ...row.places,
    ...row.island_guides,
    id: row.island_guides?.id || row.places.id
  };
}
async function getAttractionGuideBySlug(slug) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(attractionGuides).where(eq(attractionGuides.slug, slug)).limit(1);
  return result[0] || null;
}
async function getAttractionGuidesByType(attractionType, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(attractionGuides).where(and(
    eq(attractionGuides.attractionType, attractionType),
    eq(attractionGuides.published, 1)
  )).limit(limit);
}
async function getAllAttractionGuides(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(attractionGuides).where(eq(attractionGuides.published, 1)).limit(limit);
}
async function getFeaturedAttractionGuides(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(attractionGuides).where(and(
    eq(attractionGuides.published, 1),
    eq(attractionGuides.featured, 1)
  )).limit(limit);
}
async function createAttractionGuide(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(attractionGuides).values(data).returning({ id: attractionGuides.id });
  return getAttractionGuideById(id);
}
async function getAttractionGuideById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(attractionGuides).where(eq(attractionGuides.id, id)).limit(1);
  return result[0];
}
async function updateAttractionGuide(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(attractionGuides).set(data).where(eq(attractionGuides.id, id));
  return getAttractionGuideById(id);
}
async function deleteAttractionGuide(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(attractionGuides).where(eq(attractionGuides.id, id));
  return true;
}
async function getAttractionIslandLinks(attractionGuideId) {
  const db = await getDb();
  if (!db) return [];
  const links = await db.select({
    id: attractionIslandLinks.id,
    attractionGuideId: attractionIslandLinks.attractionGuideId,
    islandGuideId: attractionIslandLinks.islandGuideId,
    distance: attractionIslandLinks.distance,
    travelTime: attractionIslandLinks.travelTime,
    transportMethod: attractionIslandLinks.transportMethod,
    notes: attractionIslandLinks.notes,
    displayOrder: attractionIslandLinks.displayOrder,
    island: islandGuides
  }).from(attractionIslandLinks).leftJoin(islandGuides, eq(attractionIslandLinks.islandGuideId, islandGuides.id)).where(eq(attractionIslandLinks.attractionGuideId, attractionGuideId)).orderBy(asc(attractionIslandLinks.displayOrder));
  return links;
}
async function linkAttractionToIsland(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(attractionIslandLinks).values(data).returning({ id: attractionIslandLinks.id });
  const link = await db.select().from(attractionIslandLinks).where(eq(attractionIslandLinks.id, id)).limit(1);
  return link[0] || null;
}
async function unlinkAttractionFromIsland(attractionGuideId, islandGuideId) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(attractionIslandLinks).where(
    and(
      eq(attractionIslandLinks.attractionGuideId, attractionGuideId),
      eq(attractionIslandLinks.islandGuideId, islandGuideId)
    )
  );
  return true;
}
async function getAttractionsNearIsland(islandGuideId) {
  const db = await getDb();
  if (!db) return [];
  const attractions = await db.select({
    id: attractionGuides.id,
    name: attractionGuides.name,
    slug: attractionGuides.slug,
    attractionType: attractionGuides.attractionType,
    heroImage: attractionGuides.heroImage,
    overview: attractionGuides.overview,
    distance: attractionIslandLinks.distance,
    travelTime: attractionIslandLinks.travelTime,
    transportMethod: attractionIslandLinks.transportMethod
  }).from(attractionIslandLinks).innerJoin(attractionGuides, eq(attractionIslandLinks.attractionGuideId, attractionGuides.id)).where(eq(attractionIslandLinks.islandGuideId, islandGuideId)).orderBy(asc(attractionIslandLinks.displayOrder));
  return attractions;
}
async function getAnalyticsDashboardData() {
  const db = await getDb();
  if (!db) return null;
  try {
    const totalPackages = await db.select().from(packages);
    const totalIslandGuides = await db.select().from(islandGuides);
    const totalBlogPosts = await db.select().from(blogPosts);
    const totalActivitySpots = await db.select().from(activitySpots);
    const totalCrmQueries = await db.select().from(crmQueries);
    const featuredPackages = await db.select().from(packages).where(eq(packages.featured, 1));
    const publishedBlogPosts = await db.select().from(blogPosts).where(eq(blogPosts.published, 1));
    const publishedIslandGuides = await db.select().from(islandGuides).where(eq(islandGuides.published, 1));
    const crmQueryStats = await db.select().from(crmQueries);
    const topPackages = featuredPackages.slice(0, 5);
    const destinationCounts = {};
    totalPackages.forEach((pkg) => {
      destinationCounts[pkg.destination] = (destinationCounts[pkg.destination] || 0) + 1;
    });
    const topDestinations = Object.entries(destinationCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, count]) => ({ name, count }));
    const categoryDistribution = {};
    totalPackages.forEach((pkg) => {
      categoryDistribution[pkg.category] = (categoryDistribution[pkg.category] || 0) + 1;
    });
    const blogCategoryDistribution = {};
    totalBlogPosts.forEach((post) => {
      if (post.category) {
        blogCategoryDistribution[post.category] = (blogCategoryDistribution[post.category] || 0) + 1;
      }
    });
    const totalBlogViews = totalBlogPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const avgBlogViews = totalBlogPosts.length > 0 ? Math.round(totalBlogViews / totalBlogPosts.length) : 0;
    const crmStatusBreakdown = {};
    crmQueryStats.forEach((query) => {
      const status = query.status || "pending";
      crmStatusBreakdown[status] = (crmStatusBreakdown[status] || 0) + 1;
    });
    return {
      summary: {
        totalPackages: totalPackages.length,
        totalIslandGuides: totalIslandGuides.length,
        totalBlogPosts: totalBlogPosts.length,
        totalActivitySpots: totalActivitySpots.length,
        totalCrmQueries: totalCrmQueries.length,
        publishedBlogPosts: publishedBlogPosts.length,
        publishedIslandGuides: publishedIslandGuides.length,
        featuredPackages: featuredPackages.length
      },
      engagement: {
        totalBlogViews,
        avgBlogViews,
        blogPostsWithViews: totalBlogPosts.filter((p) => p.viewCount > 0).length
      },
      distribution: {
        packageCategories: categoryDistribution,
        blogCategories: blogCategoryDistribution,
        crmStatus: crmStatusBreakdown
      },
      topData: {
        topPackages,
        topDestinations
      },
      recentActivity: {
        recentCrmQueries: crmQueryStats.slice(-10).reverse(),
        recentBlogPosts: publishedBlogPosts.slice(-5).reverse()
      }
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return null;
  }
}
async function getPackagePerformanceMetrics() {
  const db = await getDb();
  if (!db) return null;
  try {
    const allPackages = await db.select().from(packages);
    return allPackages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      destination: pkg.destination,
      category: pkg.category,
      price: pkg.price,
      featured: pkg.featured,
      createdAt: pkg.createdAt
    }));
  } catch (error) {
    console.error("Error fetching package performance metrics:", error);
    return null;
  }
}
async function getConversionMetrics() {
  const db = await getDb();
  if (!db) return null;
  try {
    const totalCrmQueries = await db.select().from(crmQueries);
    const totalPackages = await db.select().from(packages);
    const conversionRate = totalPackages.length > 0 ? Math.round(totalCrmQueries.length / totalPackages.length * 100) : 0;
    const inquiriesByDate = {};
    totalCrmQueries.forEach((query) => {
      const date = new Date(query.createdAt).toISOString().split("T")[0];
      inquiriesByDate[date] = (inquiriesByDate[date] || 0) + 1;
    });
    return {
      totalInquiries: totalCrmQueries.length,
      totalPackages: totalPackages.length,
      conversionRate,
      inquiriesByDate,
      recentInquiries: totalCrmQueries.slice(-20).reverse()
    };
  } catch (error) {
    console.error("Error fetching conversion metrics:", error);
    return null;
  }
}
async function getDestinationMetrics() {
  const db = await getDb();
  if (!db) return null;
  try {
    const allIslandGuides = await db.select().from(islandGuides);
    const allAtolls = await db.select().from(atolls);
    const islandsByAtoll = {};
    allIslandGuides.forEach((guide) => {
      const atoll = guide.atoll || "Unknown";
      islandsByAtoll[atoll] = (islandsByAtoll[atoll] || 0) + 1;
    });
    return {
      totalIslands: allIslandGuides.length,
      totalAtolls: allAtolls.length,
      publishedIslands: allIslandGuides.filter((g) => g.published).length,
      publishedAtolls: allAtolls.filter((a) => a.published).length,
      islandsByAtoll
    };
  } catch (error) {
    console.error("Error fetching destination metrics:", error);
    return null;
  }
}
async function getUserEngagementMetrics() {
  const db = await getDb();
  if (!db) return null;
  try {
    const allBlogPosts = await db.select().from(blogPosts);
    const allActivitySpots = await db.select().from(activitySpots);
    const totalViews = allBlogPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const mostViewedPosts = allBlogPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
    const activitySpotsByType = {};
    allActivitySpots.forEach((spot) => {
      const type = spot.type || "other";
      activitySpotsByType[type] = (activitySpotsByType[type] || 0) + 1;
    });
    return {
      totalBlogViews: totalViews,
      avgBlogViews: allBlogPosts.length > 0 ? Math.round(totalViews / allBlogPosts.length) : 0,
      mostViewedPosts,
      activitySpotsByType,
      totalActivitySpots: allActivitySpots.length
    };
  } catch (error) {
    console.error("Error fetching user engagement metrics:", error);
    return null;
  }
}
async function getHeroSettings(pageSlug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(heroSettings).where(eq(heroSettings.pageSlug, pageSlug)).limit(1);
  return result[0];
}
async function getAllHeroSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSettings).orderBy(heroSettings.pageSlug);
}
async function updateHeroSettings(pageSlug, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(heroSettings).set({
    ...data,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(heroSettings.pageSlug, pageSlug));
  return getHeroSettings(pageSlug);
}
async function createHeroSettings(data) {
  const db = await getDb();
  if (!db) return null;
  const [{ id }] = await db.insert(heroSettings).values(data).returning({ id: heroSettings.id });
  const created = await db.select().from(heroSettings).where(eq(heroSettings.id, id)).limit(1);
  return created[0];
}
async function getIslandsForMap() {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(islandGuides).where(
    and(
      eq(islandGuides.published, 1),
      // Only include islands that have both latitude and longitude
      isNotNull(islandGuides.latitude),
      isNotNull(islandGuides.longitude),
      // Exclude empty string coordinates
      ne(islandGuides.latitude, ""),
      ne(islandGuides.longitude, "")
    )
  ).orderBy(asc(islandGuides.displayOrder), desc(islandGuides.featured));
  return results;
}
async function getFeaturedIslandsForMap(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(islandGuides).where(
    and(
      eq(islandGuides.published, 1),
      eq(islandGuides.featured, 1),
      isNotNull(islandGuides.latitude),
      isNotNull(islandGuides.longitude),
      ne(islandGuides.latitude, ""),
      ne(islandGuides.longitude, "")
    )
  ).orderBy(asc(islandGuides.displayOrder)).limit(limit);
  return results;
}
async function getDiveSitesByAtoll(atollId) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(places).where(
    and(
      eq(places.atollId, atollId),
      eq(places.type, "dive_site"),
      eq(places.published, 1)
    )
  ).orderBy(asc(places.name));
  return results;
}
async function getSurfingSpotsByAtoll(atollId) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(places).where(
    and(
      eq(places.atollId, atollId),
      eq(places.type, "surf_spot"),
      eq(places.published, 1)
    )
  ).orderBy(asc(places.name));
  return results;
}
async function getAttractionGuidesByAtoll(atollId, attractionType) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [
    eq(places.atollId, atollId),
    eq(attractionGuides.published, 1)
  ];
  if (attractionType) {
    conditions.push(eq(attractionGuides.attractionType, attractionType));
  }
  return db.select().from(attractionGuides).innerJoin(places, eq(attractionGuides.placeId, places.id)).where(and(...conditions)).orderBy(asc(attractionGuides.name));
}
async function getAttractionGuidesByAtollGrouped(atollId) {
  const db = await getDb();
  if (!db) return { dives: [], surfs: [], snorkeling: [] };
  const dives = await db.select().from(attractionGuides).innerJoin(places, eq(attractionGuides.placeId, places.id)).where(and(
    eq(places.atollId, atollId),
    eq(attractionGuides.attractionType, "dive_site"),
    eq(attractionGuides.published, 1)
  )).orderBy(asc(attractionGuides.name));
  const surfs = await db.select().from(attractionGuides).innerJoin(places, eq(attractionGuides.placeId, places.id)).where(and(
    eq(places.atollId, atollId),
    eq(attractionGuides.attractionType, "surf_spot"),
    eq(attractionGuides.published, 1)
  )).orderBy(asc(attractionGuides.name));
  const snorkeling = await db.select().from(attractionGuides).innerJoin(places, eq(attractionGuides.placeId, places.id)).where(and(
    eq(places.atollId, atollId),
    eq(attractionGuides.attractionType, "snorkeling_spot"),
    eq(attractionGuides.published, 1)
  )).orderBy(asc(attractionGuides.name));
  return { dives, surfs, snorkeling };
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? ""
};

// server/_core/sdk.ts
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      const user = await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      if (!user) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }
      const redirectUrl = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      res.redirect(302, redirectUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn(
      "[Notification] Notification service is not configured. Contact form will still succeed."
    );
    return false;
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  }),
  getDashboardStats: adminProcedure.query(async () => {
    const data = await getAnalyticsDashboardData();
    return data;
  }),
  uploadImage: adminProcedure.input(
    z.object({
      fileName: z.string().min(1, "fileName is required"),
      fileSize: z.number().min(1, "file must not be empty"),
      mimeType: z.string().min(1, "mimeType is required")
    })
  ).mutation(async ({ input }) => {
    const fileKey = `cms-uploads/${Date.now()}-${Math.random().toString(36).substring(7)}-${input.fileName}`;
    try {
      const url = `https://d2xsxph8kpxj0f.cloudfront.net/${fileKey}`;
      return {
        url,
        fileKey,
        success: true
      };
    } catch (error) {
      throw new Error("Failed to generate upload URL");
    }
  })
});

// server/sitemapRouter.ts
var sitemapRouter = router({
  xml: publicProcedure.query(async () => {
    const blogs = await getAllBlogPosts();
    const packages2 = await getAllPackages();
    const guides = await getIslandGuides();
    const atolls2 = await getAllAtolls();
    const attractions = await getAllAttractionGuides();
    const domain = process.env.VITE_SITE_URL || "https://holidays.islenomads.com";
    const entries = [
      {
        loc: `${domain}/`,
        priority: 1,
        changefreq: "weekly"
      },
      {
        loc: `${domain}/about`,
        priority: 0.8,
        changefreq: "monthly"
      },
      {
        loc: `${domain}/contact`,
        priority: 0.8,
        changefreq: "monthly"
      },
      {
        loc: `${domain}/blog`,
        priority: 0.9,
        changefreq: "daily"
      },
      {
        loc: `${domain}/packages`,
        priority: 0.9,
        changefreq: "weekly"
      },
      {
        loc: `${domain}/explore-maldives`,
        priority: 0.9,
        changefreq: "weekly"
      },
      {
        loc: `${domain}/island-guides`,
        priority: 0.8,
        changefreq: "weekly"
      },
      {
        loc: `${domain}/atolls`,
        priority: 0.8,
        changefreq: "weekly"
      },
      {
        loc: `${domain}/map`,
        priority: 0.7,
        changefreq: "monthly"
      },
      {
        loc: `${domain}/trip-planner`,
        priority: 0.7,
        changefreq: "monthly"
      },
      ...blogs.map((b) => ({
        loc: `${domain}/blog/${b.slug}`,
        lastmod: b.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "monthly"
      })),
      ...guides.map((g) => ({
        loc: `${domain}/island/${g.slug || g.id}`,
        lastmod: g.updatedAt?.toISOString().split("T")[0],
        priority: 0.8,
        changefreq: "monthly"
      })),
      ...atolls2.map((a) => ({
        loc: `${domain}/atoll/${a.slug}`,
        lastmod: a.updatedAt?.toISOString().split("T")[0],
        priority: 0.7,
        changefreq: "monthly"
      })),
      ...attractions.map((a) => ({
        loc: `${domain}/attraction/${a.slug}`,
        lastmod: a.updatedAt?.toISOString().split("T")[0],
        priority: 0.7,
        changefreq: "monthly"
      }))
    ];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries.map((entry) => [
        "  <url>",
        `    <loc>${entry.loc}</loc>`,
        ...entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : [],
        ...entry.changefreq ? [`    <changefreq>${entry.changefreq}</changefreq>`] : [],
        ...entry.priority !== void 0 ? [`    <priority>${entry.priority}</priority>`] : [],
        "  </url>"
      ]).flat(),
      "</urlset>"
    ].join("\n");
    return xml;
  })
});

// server/routers.ts
import { z as z3 } from "zod";
import { TRPCError as TRPCError5 } from "@trpc/server";
import { and as and3, eq as eq4, like, or } from "drizzle-orm";

// server/routing.ts
import { eq as eq2, and as and2 } from "drizzle-orm";
function parseDurationToMinutes(duration) {
  const hourMatch = duration.match(/(\d+)\s*hour/i);
  const minMatch = duration.match(/(\d+)\s*min/i);
  let minutes = 0;
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);
  return minutes || 45;
}
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${hours}h ${mins}m`;
}
async function findDirectRoutes(fromLocation, toLocation) {
  const db = await getDb();
  if (!db) return [];
  const routes = await db.select().from(boatRoutes).where(
    and2(
      eq2(boatRoutes.fromLocation, fromLocation),
      eq2(boatRoutes.toLocation, toLocation),
      eq2(boatRoutes.published, 1)
    )
  );
  return routes.map((route) => ({
    id: route.id,
    fromLocation: route.fromLocation,
    toLocation: route.toLocation,
    type: route.type,
    duration: route.duration,
    durationMinutes: parseDurationToMinutes(route.duration),
    price: route.price,
    name: route.name,
    schedule: route.schedule,
    amenities: route.amenities,
    boatInfo: route.boatInfo
  }));
}
async function findOneStopRoutes(fromLocation, toLocation, maxLayoverMinutes = 120) {
  const db = await getDb();
  if (!db) return [];
  const outgoingRoutes = await db.select().from(boatRoutes).where(
    and2(
      eq2(boatRoutes.fromLocation, fromLocation),
      eq2(boatRoutes.published, 1)
    )
  );
  const routes = [];
  for (const outgoing of outgoingRoutes) {
    const connectingRoutes = await db.select().from(boatRoutes).where(
      and2(
        eq2(boatRoutes.fromLocation, outgoing.toLocation),
        eq2(boatRoutes.toLocation, toLocation),
        eq2(boatRoutes.published, 1)
      )
    );
    for (const connecting of connectingRoutes) {
      const outgoingDuration = parseDurationToMinutes(outgoing.duration);
      const connectingDuration = parseDurationToMinutes(connecting.duration);
      const totalMinutes = outgoingDuration + connectingDuration + maxLayoverMinutes;
      routes.push({
        id: `${outgoing.id}-${connecting.id}`,
        segments: [
          {
            id: outgoing.id,
            fromLocation: outgoing.fromLocation,
            toLocation: outgoing.toLocation,
            type: outgoing.type,
            duration: outgoing.duration,
            durationMinutes: outgoingDuration,
            price: outgoing.price,
            name: outgoing.name,
            schedule: outgoing.schedule,
            amenities: outgoing.amenities,
            boatInfo: outgoing.boatInfo
          },
          {
            id: connecting.id,
            fromLocation: connecting.fromLocation,
            toLocation: connecting.toLocation,
            type: connecting.type,
            duration: connecting.duration,
            durationMinutes: connectingDuration,
            price: connecting.price,
            name: connecting.name,
            schedule: connecting.schedule,
            amenities: connecting.amenities,
            boatInfo: connecting.boatInfo
          }
        ],
        totalDuration: formatDuration(totalMinutes),
        totalDurationMinutes: totalMinutes,
        totalCost: outgoing.price + connecting.price,
        totalStops: 2,
        isDirectRoute: false,
        layoverTime: maxLayoverMinutes,
        description: `${fromLocation} \u2192 ${outgoing.toLocation} \u2192 ${toLocation}`
      });
    }
  }
  return routes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
}
async function findAllRoutes(fromLocation, toLocation) {
  const allRoutes = [];
  const directRoutes = await findDirectRoutes(fromLocation, toLocation);
  directRoutes.forEach((segment) => {
    allRoutes.push({
      id: `direct-${segment.id}`,
      segments: [segment],
      totalDuration: segment.duration,
      totalDurationMinutes: segment.durationMinutes,
      totalCost: segment.price,
      totalStops: 1,
      isDirectRoute: true,
      description: `Direct: ${fromLocation} \u2192 ${toLocation}`
    });
  });
  const connectingRoutes = await findOneStopRoutes(fromLocation, toLocation);
  allRoutes.push(...connectingRoutes);
  return allRoutes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
}
async function findOptimizedRoutes(fromLocation, toLocation, optimization = "balanced") {
  const allRoutes = await findAllRoutes(fromLocation, toLocation);
  if (allRoutes.length === 0) {
    return [];
  }
  switch (optimization) {
    case "speed":
      return allRoutes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    case "cost":
      return allRoutes.sort((a, b) => a.totalCost - b.totalCost);
    case "comfort":
      return allRoutes.sort((a, b) => {
        const aComfort = a.isDirectRoute ? 0 : 1;
        const bComfort = b.isDirectRoute ? 0 : 1;
        if (aComfort !== bComfort) return aComfort - bComfort;
        const aSpeedboat = a.segments.filter((s) => s.type === "speedboat").length;
        const bSpeedboat = b.segments.filter((s) => s.type === "speedboat").length;
        return bSpeedboat - aSpeedboat;
      });
    case "balanced":
    default:
      return allRoutes.sort((a, b) => {
        const aScore = a.totalDurationMinutes * 0.6 + a.totalCost / 100 * 0.4;
        const bScore = b.totalDurationMinutes * 0.6 + b.totalCost / 100 * 0.4;
        return aScore - bScore;
      });
  }
}
async function getRouteSuggestions(fromLocation, toLocation, optimization = "balanced") {
  const routes = await findOptimizedRoutes(fromLocation, toLocation, optimization);
  if (routes.length === 0) {
    return {
      routes: [],
      hasDirectRoute: false,
      message: `No transportation routes found between ${fromLocation} and ${toLocation}. Please try different islands.`
    };
  }
  const hasDirectRoute = routes.some((r) => r.isDirectRoute);
  const message = hasDirectRoute ? `Found ${routes.length} route(s) between ${fromLocation} and ${toLocation}` : `No direct routes available. Showing ${routes.length} connecting route(s) with transfers.`;
  return {
    routes: routes.slice(0, 5),
    // Return top 5 options
    hasDirectRoute,
    message
  };
}

// server/staffManagement.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";
var staffManagementRouter = router({
  create: adminProcedure.input(z2.object({
    userId: z2.number(),
    roleId: z2.number(),
    department: z2.string().optional(),
    position: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) throw new TRPCError3({ code: "UNAUTHORIZED" });
    const newStaff = await createStaff({
      userId: input.userId,
      roleId: input.roleId,
      department: input.department,
      position: input.position,
      isActive: 1
    });
    return newStaff;
  }),
  update: adminProcedure.input(z2.object({
    id: z2.number(),
    name: z2.string().optional(),
    roleId: z2.number().optional(),
    department: z2.string().optional(),
    position: z2.string().optional(),
    isActive: z2.number().optional()
  })).mutation(async ({ input, ctx }) => {
    if (input.name && input.id) {
    }
    const updated = await updateStaff(input.id, {
      roleId: input.roleId,
      department: input.department,
      position: input.position,
      isActive: input.isActive
    });
    return updated;
  }),
  delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
    return { success: true };
  })
});

// server/userManagement.ts
import { eq as eq3 } from "drizzle-orm";
import { TRPCError as TRPCError4 } from "@trpc/server";
async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    openId: users.openId,
    role: users.role,
    loginMethod: users.loginMethod,
    createdAt: users.createdAt,
    lastSignedIn: users.lastSignedIn
  }).from(users);
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq3(users.id, id));
  return result[0] || null;
}
async function getAllAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    openId: users.openId,
    role: users.role,
    createdAt: users.createdAt
  }).from(users).where(eq3(users.role, "admin"));
}
async function assignAdminRole(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new TRPCError4({
      code: "NOT_FOUND",
      message: "User not found"
    });
  }
  const db = await getDb();
  if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });
  const result = await db.update(users).set({ role: "admin" }).where(eq3(users.id, userId));
  return result;
}
async function removeAdminRole(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new TRPCError4({
      code: "NOT_FOUND",
      message: "User not found"
    });
  }
  if (user.role !== "admin") {
    throw new TRPCError4({
      code: "BAD_REQUEST",
      message: "User is not an admin"
    });
  }
  const db = await getDb();
  if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });
  const result = await db.update(users).set({ role: "user" }).where(eq3(users.id, userId));
  return result;
}
async function updateUserRole(userId, role) {
  const user = await getUserById(userId);
  if (!user) {
    throw new TRPCError4({
      code: "NOT_FOUND",
      message: "User not found"
    });
  }
  const db = await getDb();
  if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });
  const result = await db.update(users).set({ role }).where(eq3(users.id, userId));
  return result;
}
async function getUserStatistics() {
  const allUsers = await getAllUsers();
  const adminUsers = await getAllAdminUsers();
  return {
    totalUsers: allUsers.length,
    adminUsers: adminUsers.length,
    regularUsers: allUsers.length - adminUsers.length,
    adminPercentage: allUsers.length > 0 ? (adminUsers.length / allUsers.length * 100).toFixed(2) : "0.00"
  };
}

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    }),
    loginWithPassword: publicProcedure.input(z3.object({
      email: z3.string().email(),
      password: z3.string().min(1)
    })).mutation(async ({ ctx, input }) => {
      if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Supabase auth is not configured on the server"
        });
      }
      const response = await fetch(
        `${ENV.supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: ENV.supabaseAnonKey
          },
          body: JSON.stringify({ email: input.email, password: input.password })
        }
      );
      if (!response.ok) {
        throw new TRPCError5({
          code: "UNAUTHORIZED",
          message: "Invalid email or password"
        });
      }
      const responseText = await response.text();
      if (!responseText) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Supabase auth returned an empty response body"
        });
      }
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse Supabase auth response"
        });
      }
      const supabaseUser = data.user;
      if (!supabaseUser?.id) {
        throw new TRPCError5({
          code: "UNAUTHORIZED",
          message: "Supabase did not return a user"
        });
      }
      const signedInAt = /* @__PURE__ */ new Date();
      const displayName = supabaseUser.user_metadata?.name ?? supabaseUser.email ?? "";
      let upserted;
      try {
        upserted = await upsertUser({
          openId: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name: displayName || null,
          loginMethod: "password",
          lastSignedIn: signedInAt
        });
      } catch (err) {
        console.error("[signin] upsertUser threw:", err);
        const cause = err?.cause ?? err;
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: `DB upsert failed: ${cause?.message ?? String(cause)} | code=${cause?.code ?? "?"} | severity=${cause?.severity ?? "?"} | errno=${cause?.errno ?? "?"} | address=${cause?.address ?? "?"}`
        });
      }
      let user;
      try {
        user = upserted ?? await getUserByOpenId(supabaseUser.id);
      } catch (err) {
        console.error("[signin] getUserByOpenId threw:", err);
        const cause = err?.cause ?? err;
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: `DB lookup failed: ${cause?.message ?? String(cause)} | code=${cause?.code ?? "?"} | severity=${cause?.severity ?? "?"} | errno=${cause?.errno ?? "?"} | address=${cause?.address ?? "?"}`
        });
      }
      if (!user) {
        const dbConfigured = Boolean(process.env.DATABASE_URL);
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: dbConfigured ? "Failed to create local user record (DB query returned no row)" : "Database is not configured on the server (DATABASE_URL missing)"
        });
      }
      const sessionToken = await sdk.createSessionToken(supabaseUser.id, {
        name: displayName,
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS
      });
      return { user };
    }),
    registerWithPassword: publicProcedure.input(
      z3.object({
        email: z3.string().email(),
        password: z3.string().min(6),
        name: z3.string().optional()
      })
    ).mutation(async ({ ctx, input }) => {
      if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Supabase auth is not configured on the server"
        });
      }
      const response = await fetch(`${ENV.supabaseUrl}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ENV.supabaseAnonKey
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
          data: { name: input.name }
        })
      });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse Supabase sign-up response"
        });
      }
      if (!response.ok) {
        throw new TRPCError5({
          code: "BAD_REQUEST",
          message: data?.error_description || data?.error?.message || data?.message || "Registration failed"
        });
      }
      const supabaseUser = data.user;
      if (supabaseUser?.id) {
        const displayName = input.name ?? supabaseUser.user_metadata?.name ?? supabaseUser.email ?? "";
        const upserted = await upsertUser({
          openId: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name: displayName || null,
          loginMethod: "password",
          lastSignedIn: /* @__PURE__ */ new Date()
        });
        const user = upserted ?? await getUserByOpenId(supabaseUser.id);
        if (!user) {
          const dbConfigured = Boolean(process.env.DATABASE_URL);
          throw new TRPCError5({
            code: "INTERNAL_SERVER_ERROR",
            message: dbConfigured ? "Failed to create local user record (DB query returned no row)" : "Database is not configured on the server (DATABASE_URL missing)"
          });
        }
        const sessionToken = await sdk.createSessionToken(supabaseUser.id, {
          name: displayName,
          expiresInMs: ONE_YEAR_MS
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS
        });
        return {
          user,
          message: "Registration completed. You are now signed in."
        };
      }
      return {
        success: true,
        message: "Registration successful. Check your email to confirm your account if required."
      };
    }),
    sendPasswordResetEmail: publicProcedure.input(z3.object({
      email: z3.string().email()
    })).mutation(async ({ ctx, input }) => {
      if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Supabase auth is not configured on the server"
        });
      }
      const host = ctx.req.headers.host;
      const forwardedProto = ctx.req.headers["x-forwarded-proto"];
      const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0].trim() : ctx.req.protocol || "http";
      const redirectTo = host ? `${protocol}://${host}/staff-reset-password` : void 0;
      const body = { email: input.email };
      if (redirectTo) {
        body.redirect_to = redirectTo;
      }
      const response = await fetch(`${ENV.supabaseUrl}/auth/v1/recover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ENV.supabaseAnonKey
        },
        body: JSON.stringify(body)
      });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse Supabase password reset response"
        });
      }
      if (!response.ok) {
        console.error("[sendPasswordResetEmail] Supabase error", {
          status: response.status,
          body: responseText,
          redirectTo
        });
        const detail = data?.error_description || data?.error?.message || data?.msg || data?.message || responseText || `Supabase returned ${response.status}`;
        throw new TRPCError5({
          code: "BAD_REQUEST",
          message: `Password reset request failed: ${detail}`
        });
      }
      return {
        success: true,
        message: "Password reset instructions have been sent if that email exists."
      };
    }),
    updatePasswordWithRecoveryToken: publicProcedure.input(z3.object({
      accessToken: z3.string().min(1),
      password: z3.string().min(6)
    })).mutation(async ({ input }) => {
      if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
        throw new TRPCError5({
          code: "INTERNAL_SERVER_ERROR",
          message: "Supabase auth is not configured on the server"
        });
      }
      const response = await fetch(`${ENV.supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: ENV.supabaseAnonKey,
          Authorization: `Bearer ${input.accessToken}`
        },
        body: JSON.stringify({ password: input.password })
      });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
      }
      if (!response.ok) {
        throw new TRPCError5({
          code: response.status === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
          message: data?.error_description || data?.error?.message || data?.msg || data?.message || "Failed to update password. The reset link may have expired \u2014 request a new one."
        });
      }
      return {
        success: true,
        message: "Password updated. You can now sign in with your new password."
      };
    })
  }),
  users: router({
    list: adminProcedure.query(async () => {
      return getAllUsers();
    }),
    getById: adminProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getUserById(input.id);
    }),
    listAdmins: adminProcedure.query(async () => {
      return getAllAdminUsers();
    }),
    assignAdmin: adminProcedure.input(z3.object({ userId: z3.number() })).mutation(async ({ input }) => {
      await assignAdminRole(input.userId);
      return { success: true, message: "User promoted to admin" };
    }),
    removeAdmin: adminProcedure.input(z3.object({ userId: z3.number() })).mutation(async ({ input }) => {
      await removeAdminRole(input.userId);
      return { success: true, message: "User demoted to regular user" };
    }),
    updateRole: adminProcedure.input(z3.object({ userId: z3.number(), role: z3.enum(["user", "admin"]) })).mutation(async ({ input }) => {
      await updateUserRole(input.userId, input.role);
      return { success: true, message: "User role updated" };
    }),
    getStatistics: adminProcedure.query(async () => {
      return getUserStatistics();
    })
  }),
  contact: router({
    submit: publicProcedure.input(
      z3.object({
        name: z3.string().min(1, "Name is required"),
        email: z3.string().email("Invalid email address"),
        phone: z3.string().min(1, "Phone is required"),
        subject: z3.string().min(1, "Subject is required"),
        message: z3.string().min(10, "Message must be at least 10 characters"),
        packageType: z3.string().optional()
      })
    ).mutation(async ({ input }) => {
      try {
        await notifyOwner({
          title: `New Inquiry from ${input.name}`,
          content: `Email: ${input.email}
Phone: ${input.phone}
Package: ${input.packageType || "Not specified"}

Subject: ${input.subject}

Message:
${input.message}`
        });
        return {
          success: true,
          message: "Thank you for your inquiry. We will respond within 24 hours."
        };
      } catch (error) {
        console.error("[Contact Form] Error:", error);
        throw new Error("Failed to submit contact form. Please try again.");
      }
    })
  }),
  transports: router({
    list: publicProcedure.query(async () => {
      return getAllTransports();
    }),
    listAdmin: protectedProcedure.query(async (opts) => {
      if (opts.ctx.user?.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Only admins can access this" });
      }
      return getAllTransportsAdmin();
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getTransportById(input.id);
    }),
    create: protectedProcedure.input(
      z3.object({
        name: z3.string().min(1, "Name is required"),
        fromLocation: z3.string().min(1, "From location is required"),
        toLocation: z3.string().min(1, "To location is required"),
        transportType: z3.enum(["ferry", "speedboat", "dhoni", "seaplane"]),
        durationMinutes: z3.number().min(1, "Duration must be at least 1 minute"),
        priceUSD: z3.number().min(0, "Price must be non-negative"),
        capacity: z3.number().min(1, "Capacity must be at least 1"),
        operator: z3.string().min(1, "Operator is required"),
        departureTime: z3.string().optional(),
        schedule: z3.string().optional(),
        amenities: z3.string().optional(),
        description: z3.string().optional(),
        image: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Only admins can create transports" });
      }
      return createTransport(input);
    }),
    update: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        fromLocation: z3.string().optional(),
        toLocation: z3.string().optional(),
        transportType: z3.enum(["ferry", "speedboat", "dhoni", "seaplane"]).optional(),
        durationMinutes: z3.number().optional(),
        priceUSD: z3.number().optional(),
        capacity: z3.number().optional(),
        operator: z3.string().optional(),
        departureTime: z3.string().optional(),
        schedule: z3.string().optional(),
        amenities: z3.string().optional(),
        description: z3.string().optional(),
        image: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Only admins can update transports" });
      }
      const { id, ...data } = input;
      return updateTransport(id, data);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Only admins can delete transports" });
      }
      return deleteTransport(input.id);
    })
  }),
  blog: router({
    list: publicProcedure.query(async () => {
      return getAllBlogPosts();
    }),
    listAdmin: protectedProcedure.query(async () => {
      return getAllBlogPostsAdmin();
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getBlogPostBySlug(input.slug);
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getBlogPostById(input.id);
    }),
    create: protectedProcedure.input(
      z3.object({
        title: z3.string(),
        slug: z3.string(),
        content: z3.string(),
        excerpt: z3.string().optional(),
        featuredImage: z3.string().optional(),
        author: z3.string(),
        category: z3.string().optional(),
        tags: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      return createBlogPost(input);
    }),
    update: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        title: z3.string().optional(),
        slug: z3.string().optional(),
        content: z3.string().optional(),
        excerpt: z3.string().optional(),
        featuredImage: z3.string().optional(),
        author: z3.string().optional(),
        category: z3.string().optional(),
        tags: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateBlogPost(id, data);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deleteBlogPost(input.id);
    }),
    comments: router({
      list: publicProcedure.input(z3.object({ postId: z3.number() })).query(async ({ input }) => {
        return getBlogComments(input.postId);
      }),
      create: publicProcedure.input(
        z3.object({
          postId: z3.number(),
          name: z3.string(),
          email: z3.string().email(),
          content: z3.string()
        })
      ).mutation(async ({ input }) => {
        return createBlogComment(input);
      })
    })
  }),
  packages: router({
    list: publicProcedure.query(async () => {
      return getAllPackages();
    }),
    listAdmin: protectedProcedure.query(async () => {
      return getAllPackagesAdmin();
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getPackageBySlug(input.slug);
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getPackageById(input.id);
    }),
    getByCategory: publicProcedure.input(z3.object({ category: z3.string() })).query(async ({ input }) => {
      const allPackages = await getAllPackages();
      return allPackages.filter((pkg) => pkg.category === input.category);
    }),
    getCategories: publicProcedure.query(async () => {
      return [
        { id: "family-adventures", label: "Family Adventures", icon: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}" },
        { id: "solo-travel", label: "Solo Travel", icon: "\u{1F9D1}\u200D\u{1F680}" },
        { id: "water-sports", label: "Water Sports", icon: "\u{1F3C4}" },
        { id: "relaxation", label: "Relaxation", icon: "\u{1F9D8}" },
        { id: "luxury", label: "Luxury", icon: "\u{1F451}" },
        { id: "adventure", label: "Adventure", icon: "\u{1F3D4}\uFE0F" },
        { id: "diving-snorkeling", label: "Diving & Snorkeling", icon: "\u{1F93F}" },
        { id: "island-hopping", label: "Island Hopping", icon: "\u{1F3DD}\uFE0F" }
      ];
    }),
    create: protectedProcedure.input(
      z3.object({
        name: z3.string(),
        slug: z3.string(),
        description: z3.string(),
        price: z3.number(),
        duration: z3.string(),
        destination: z3.string(),
        category: z3.enum(["family-adventures", "solo-travel", "water-sports", "relaxation", "luxury", "adventure", "diving-snorkeling", "island-hopping"]).optional(),
        highlights: z3.string().optional(),
        amenities: z3.string().optional(),
        image: z3.string().optional(),
        featured: z3.number().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      return createPackage(input);
    }),
    update: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        slug: z3.string().optional(),
        description: z3.string().optional(),
        price: z3.number().optional(),
        duration: z3.string().optional(),
        destination: z3.string().optional(),
        highlights: z3.string().optional(),
        amenities: z3.string().optional(),
        image: z3.string().optional(),
        featured: z3.number().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updatePackage(id, data);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deletePackage(input.id);
    })
  }),
  boatRoutes: router({
    list: publicProcedure.query(async () => {
      return getBoatRoutes();
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getBoatRouteBySlug(input.slug);
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getBoatRouteById(input.id);
    }),
    create: adminProcedure.input(
      z3.object({
        name: z3.string(),
        slug: z3.string(),
        description: z3.string(),
        startPoint: z3.string(),
        endPoint: z3.string(),
        distance: z3.number().optional(),
        duration: z3.string(),
        boatType: z3.string(),
        capacity: z3.number(),
        speed: z3.number().optional(),
        price: z3.number(),
        schedule: z3.string().optional(),
        amenities: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { distance, ...rest } = input;
      return createBoatRoute({
        ...rest,
        distance: distance ? distance.toString() : void 0
      });
    }),
    update: adminProcedure.input(
      z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        slug: z3.string().optional(),
        description: z3.string().optional(),
        startPoint: z3.string().optional(),
        endPoint: z3.string().optional(),
        distance: z3.number().optional(),
        duration: z3.string().optional(),
        boatType: z3.string().optional(),
        capacity: z3.number().optional(),
        speed: z3.number().optional(),
        price: z3.number().optional(),
        schedule: z3.string().optional(),
        amenities: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, distance, ...rest } = input;
      const updateData = { ...rest };
      if (distance !== void 0) updateData.distance = distance.toString();
      return updateBoatRoute(id, updateData);
    }),
    delete: adminProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deleteBoatRoute(input.id);
    }),
    listWithIslands: publicProcedure.query(async () => {
      return getBoatRoutesWithIslands();
    }),
    fromIsland: publicProcedure.input(z3.object({ islandGuideId: z3.number() })).query(async ({ input }) => {
      return getBoatRoutesFromIsland(input.islandGuideId);
    }),
    toIsland: publicProcedure.input(z3.object({ islandGuideId: z3.number() })).query(async ({ input }) => {
      return getBoatRoutesToIsland(input.islandGuideId);
    }),
    fromLocation: publicProcedure.input(z3.object({ location: z3.string() })).query(async ({ input }) => {
      return getBoatRoutesFromLocation(input.location);
    }),
    toLocation: publicProcedure.input(z3.object({ location: z3.string() })).query(async ({ input }) => {
      return getBoatRoutesToLocation(input.location);
    }),
    findRoute: publicProcedure.input(z3.object({ from: z3.string(), to: z3.string() })).query(async ({ input }) => {
      return findAllRoutes(input.from, input.to);
    }),
    findOptimized: publicProcedure.input(z3.object({
      from: z3.string(),
      to: z3.string(),
      optimization: z3.enum(["speed", "cost", "comfort", "balanced"]).optional()
    })).query(async ({ input }) => {
      return findOptimizedRoutes(input.from, input.to, input.optimization);
    }),
    suggestions: publicProcedure.input(z3.object({
      from: z3.string(),
      to: z3.string(),
      optimization: z3.enum(["speed", "cost", "comfort", "balanced"]).optional()
    })).query(async ({ input }) => {
      return getRouteSuggestions(input.from, input.to, input.optimization);
    })
  }),
  places: router({
    list: publicProcedure.query(async () => {
      return getMapLocations();
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getMapLocationBySlug(input.slug);
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getMapLocationById(input.id);
    }),
    create: protectedProcedure.input(
      z3.object({
        name: z3.string(),
        slug: z3.string(),
        description: z3.string(),
        latitude: z3.number(),
        longitude: z3.number(),
        locationType: z3.string(),
        image: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { latitude, longitude, ...rest } = input;
      return createMapLocation({
        ...rest,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      });
    }),
    update: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        slug: z3.string().optional(),
        description: z3.string().optional(),
        latitude: z3.number().optional(),
        longitude: z3.number().optional(),
        locationType: z3.string().optional(),
        image: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, latitude, longitude, ...rest } = input;
      const updateData = { ...rest };
      if (latitude !== void 0) updateData.latitude = latitude.toString();
      if (longitude !== void 0) updateData.longitude = longitude.toString();
      return updateMapLocation(id, updateData);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deleteMapLocation(input.id);
    }),
    getWithGuide: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getMapLocationWithGuide(input.id);
    })
  }),
  islandGuides: router({
    list: publicProcedure.query(async () => {
      return getIslandGuides();
    }),
    featured: publicProcedure.input(z3.object({ limit: z3.number().optional() })).query(async ({ input }) => {
      return getFeaturedIslandGuides(input.limit || 3);
    }),
    search: publicProcedure.input(z3.object({ query: z3.string().min(1), limit: z3.number().optional() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const searchTerm = `%${input.query}%`;
      const results = await db.select().from(islandGuides).where(
        and3(
          or(
            like(islandGuides.name, searchTerm),
            like(islandGuides.overview, searchTerm),
            like(islandGuides.atoll, searchTerm),
            like(islandGuides.quickFacts, searchTerm),
            like(islandGuides.topThingsToDo, searchTerm)
          ),
          eq4(islandGuides.published, 1)
        )
      ).limit(input.limit || 20);
      return results;
    }),
    listAdmin: protectedProcedure.query(async () => {
      return getAllIslandGuidesAdmin();
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getIslandGuideBySlug(input.slug);
    }),
    /**
     * @deprecated Use getByIslandId instead for consistent island ID-based linking
     */
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getIslandGuideById(input.id);
    }),
    getByIslandId: publicProcedure.input(z3.object({ islandId: z3.number() })).query(async ({ input }) => {
      const guide = await getIslandGuideByIslandId(input.islandId);
      return guide || null;
    }),
    getByPlaceSlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getIslandBySlug(input.slug);
    }),
    getPlaceWithGuide: publicProcedure.input(z3.object({ placeId: z3.number() })).query(async ({ input }) => {
      return getPlaceWithGuide(input.placeId);
    }),
    create: protectedProcedure.input(
      z3.object({
        name: z3.string(),
        slug: z3.string(),
        description: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      return createIslandGuide(input);
    }),
    update: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        slug: z3.string().optional(),
        description: z3.string().optional(),
        published: z3.number().optional(),
        quickFacts: z3.any().optional(),
        topThingsToDo: z3.any().optional(),
        foodCafes: z3.any().optional(),
        faq: z3.any().optional(),
        howToGetThere: z3.string().optional(),
        practicalInfo: z3.string().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateIslandGuide(id, data);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deleteIslandGuide(input.id);
    }),
    updateDisplayOrder: protectedProcedure.input(z3.object({
      updates: z3.array(z3.object({
        id: z3.number(),
        displayOrder: z3.number()
      }))
    })).mutation(async ({ input }) => {
      return updateDisplayOrder(input.updates);
    }),
    listWithActivitySpots: publicProcedure.query(async () => {
      return getIslandGuidesWithActivitySpots();
    }),
    getExperiences: publicProcedure.input(z3.object({ islandId: z3.number() })).query(async ({ input }) => {
      return getExperiencesByIsland(input.islandId);
    }),
    mapData: publicProcedure.query(async () => {
      return getIslandsForMap();
    }),
    mapFeatured: publicProcedure.input(z3.object({ limit: z3.number().optional() })).query(async ({ input }) => {
      return getFeaturedIslandsForMap(input.limit || 10);
    })
  }),
  seo: router({
    get: protectedProcedure.input(z3.object({
      contentType: z3.string(),
      contentId: z3.number()
    })).query(async ({ input }) => {
      return getSeoMetaTags(input.contentType, input.contentId);
    }),
    getApproved: publicProcedure.input(z3.object({
      contentType: z3.string(),
      contentId: z3.number()
    })).query(async ({ input }) => {
      return getApprovedSeoMetaTags(input.contentType, input.contentId);
    }),
    create: protectedProcedure.input(z3.object({
      contentType: z3.string(),
      contentId: z3.number(),
      title: z3.string(),
      description: z3.string(),
      keywords: z3.array(z3.string()).optional(),
      ogTitle: z3.string().optional(),
      ogDescription: z3.string().optional(),
      ogImage: z3.string().optional()
    })).mutation(async ({ input }) => {
      const data = { ...input };
      if (data.keywords) {
        data.keywords = JSON.stringify(data.keywords);
      }
      return createSeoMetaTags(data);
    }),
    approve: protectedProcedure.input(z3.object({
      id: z3.number()
    })).mutation(async ({ input, ctx }) => {
      const staffId = ctx.user?.id || 1;
      return approveSeoMetaTags(input.id, staffId);
    }),
    reject: protectedProcedure.input(z3.object({
      id: z3.number(),
      reason: z3.string()
    })).mutation(async ({ input }) => {
      return rejectSeoMetaTags(input.id, input.reason);
    }),
    update: protectedProcedure.input(z3.object({
      id: z3.number(),
      title: z3.string().optional(),
      description: z3.string().optional(),
      keywords: z3.array(z3.string()).optional(),
      ogTitle: z3.string().optional(),
      ogDescription: z3.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData = { ...data };
      if (data.keywords) {
        updateData.keywords = JSON.stringify(data.keywords);
      }
      return updateSeoMetaTags(id, updateData);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deleteSeoMetaTags(input.id);
    }),
    getByContentType: protectedProcedure.input(z3.object({
      contentType: z3.string(),
      status: z3.string().optional()
    })).query(async ({ input }) => {
      return getSeoMetaTagsByContentType(input.contentType, input.status);
    })
  }),
  crm: router({
    queries: router({
      list: protectedProcedure.input(z3.object({
        status: z3.string().optional()
      })).query(async ({ input }) => {
        return getCrmQueries(input.status);
      }),
      get: protectedProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
        return getCrmQueryById(input.id);
      }),
      create: protectedProcedure.input(z3.object({
        customerName: z3.string(),
        customerEmail: z3.string().email(),
        customerPhone: z3.string().optional(),
        customerCountry: z3.string().optional(),
        subject: z3.string(),
        message: z3.string(),
        queryType: z3.enum(["booking", "general", "complaint", "feedback", "support", "other"]).optional(),
        priority: z3.enum(["low", "medium", "high", "urgent"]).optional(),
        packageId: z3.number().optional(),
        islandGuideId: z3.number().optional()
      })).mutation(async ({ input }) => {
        return createCrmQuery(input);
      }),
      update: protectedProcedure.input(z3.object({
        id: z3.number(),
        status: z3.enum(["new", "in_progress", "waiting_customer", "resolved", "closed"]).optional(),
        priority: z3.enum(["low", "medium", "high", "urgent"]).optional(),
        assignedTo: z3.number().optional(),
        firstResponseAt: z3.date().optional(),
        resolvedAt: z3.date().optional(),
        closedAt: z3.date().optional()
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateCrmQuery(id, data);
      }),
      delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
        return deleteCrmQuery(input.id);
      })
    }),
    interactions: router({
      list: protectedProcedure.input(z3.object({ queryId: z3.number() })).query(async ({ input }) => {
        return getCrmInteractions(input.queryId);
      }),
      create: protectedProcedure.input(z3.object({
        queryId: z3.number(),
        type: z3.enum(["note", "email", "call", "meeting", "sms"]),
        subject: z3.string().optional(),
        content: z3.string(),
        isInternal: z3.boolean().optional(),
        attachments: z3.array(z3.string()).optional()
      })).mutation(async ({ input, ctx }) => {
        const staffId = ctx.user?.id || 1;
        return createCrmInteraction({
          ...input,
          staffId,
          isInternal: input.isInternal ? 1 : 0,
          attachments: input.attachments ? JSON.stringify(input.attachments) : void 0
        });
      })
    }),
    customers: router({
      getByEmail: protectedProcedure.input(z3.object({ email: z3.string().email() })).query(async ({ input }) => {
        return getCrmCustomerByEmail(input.email);
      }),
      create: protectedProcedure.input(z3.object({
        email: z3.string().email(),
        name: z3.string(),
        phone: z3.string().optional(),
        country: z3.string().optional(),
        preferredContact: z3.enum(["email", "phone", "sms"]).optional(),
        newsletter: z3.boolean().optional()
      })).mutation(async ({ input }) => {
        return createCrmCustomer({
          ...input,
          newsletter: input.newsletter ? 1 : 0
        });
      }),
      update: protectedProcedure.input(z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        phone: z3.string().optional(),
        country: z3.string().optional(),
        preferredContact: z3.enum(["email", "phone", "sms"]).optional(),
        newsletter: z3.boolean().optional(),
        lastContactedAt: z3.date().optional()
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateCrmCustomer(id, {
          ...data,
          newsletter: data.newsletter !== void 0 ? data.newsletter ? 1 : 0 : void 0
        });
      })
    })
  }),
  // Staff and RBAC management
  staff: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      return getStaffByUserId(ctx.user.id);
    }),
    list: protectedProcedure.query(async () => {
      return getAllStaff();
    }),
    getById: protectedProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getStaffById(input.id);
    }),
    updateProfile: protectedProcedure.input(z3.object({
      department: z3.string().optional(),
      position: z3.string().optional()
    })).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError5({ code: "UNAUTHORIZED" });
      const staffMember = await getStaffByUserId(ctx.user.id);
      if (!staffMember) throw new TRPCError5({ code: "NOT_FOUND" });
      await updateStaff(staffMember.id, input);
      await logActivity({
        staffId: staffMember.id,
        action: "update_profile",
        entityType: "staff",
        entityId: staffMember.id,
        changes: JSON.stringify(input)
      });
      return getStaffById(staffMember.id);
    }),
    // Admin CRUD operations
    create: staffManagementRouter._def.procedures.create,
    update: staffManagementRouter._def.procedures.update,
    delete: staffManagementRouter._def.procedures.delete,
    roles: router({
      list: protectedProcedure.query(async () => {
        return [];
      }),
      getByName: protectedProcedure.input(z3.object({ name: z3.string() })).query(async ({ input }) => {
        return getStaffRoleByName(input.name);
      }),
      create: protectedProcedure.input(z3.object({
        name: z3.string().min(1),
        description: z3.string().optional(),
        permissions: z3.array(z3.string())
      })).mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError5({ code: "UNAUTHORIZED" });
        const staffMember = await getStaffByUserId(ctx.user.id);
        if (!staffMember || staffMember.role.name !== "admin") {
          throw new TRPCError5({ code: "FORBIDDEN" });
        }
        const role = await createStaffRole({
          name: input.name,
          description: input.description,
          permissions: JSON.stringify(input.permissions)
        });
        if (staffMember) {
          await logActivity({
            staffId: staffMember.id,
            action: "create_role",
            entityType: "staff_role",
            entityId: role?.id || 0,
            changes: JSON.stringify(input)
          });
        }
        return role;
      })
    })
  }),
  atolls: router({
    list: publicProcedure.query(async () => {
      return getAllAtolls();
    }),
    listAdmin: protectedProcedure.query(async () => {
      return getAllAtollsAdmin();
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      return getAtollBySlug(input.slug);
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getAtollById(input.id);
    }),
    getByRegion: publicProcedure.input(z3.object({ region: z3.string() })).query(async ({ input }) => {
      return getAtollsByRegion(input.region);
    }),
    create: protectedProcedure.input(
      z3.object({
        name: z3.string(),
        slug: z3.string(),
        region: z3.string(),
        description: z3.string().optional(),
        heroImage: z3.string().optional(),
        overview: z3.string().optional(),
        bestFor: z3.string().optional(),
        highlights: z3.string().optional(),
        activities: z3.string().optional(),
        accommodation: z3.string().optional(),
        transportation: z3.string().optional(),
        bestSeason: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      return createAtoll(input);
    }),
    update: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        name: z3.string().optional(),
        slug: z3.string().optional(),
        region: z3.string().optional(),
        description: z3.string().optional(),
        heroImage: z3.string().optional(),
        overview: z3.string().optional(),
        bestFor: z3.string().optional(),
        highlights: z3.string().optional(),
        activities: z3.string().optional(),
        accommodation: z3.string().optional(),
        transportation: z3.string().optional(),
        bestSeason: z3.string().optional(),
        published: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateAtoll(id, data);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      return deleteAtoll(input.id);
    }),
    getIslands: publicProcedure.input(z3.object({ atollId: z3.number() })).query(async ({ input }) => {
      return getIslandsByAtollId(input.atollId);
    }),
    getFeaturedIslands: publicProcedure.input(z3.object({ atollId: z3.number(), limit: z3.number().optional() })).query(async ({ input }) => {
      return getFeaturedIslandsByAtollId(input.atollId, input.limit || 5);
    }),
    getRegularIslands: publicProcedure.input(z3.object({ atollId: z3.number() })).query(async ({ input }) => {
      return getRegularIslandsByAtollId(input.atollId);
    }),
    getDiveSites: publicProcedure.input(z3.object({ atollId: z3.number() })).query(async ({ input }) => {
      return getDiveSitesByAtoll(input.atollId);
    }),
    getSurfingSpots: publicProcedure.input(z3.object({ atollId: z3.number() })).query(async ({ input }) => {
      return getSurfingSpotsByAtoll(input.atollId);
    })
  }),
  // DEPRECATED: activitySpots router removed - use attractionGuides instead for unified attractions management
  activityTypes: router({
    list: publicProcedure.query(async () => {
      return getAllActivityTypes();
    }),
    getByKey: publicProcedure.input(z3.object({ key: z3.string() })).query(async ({ input }) => {
      return getActivityTypeByKey(input.key);
    })
  }),
  experiences: router({
    getByIsland: publicProcedure.input(z3.object({ islandId: z3.number() })).query(async ({ input }) => {
      return getExperiencesByIsland(input.islandId);
    }),
    getByActivityType: publicProcedure.input(z3.object({ activityTypeId: z3.number() })).query(async ({ input }) => {
      return getExperiencesByActivityType(input.activityTypeId);
    })
  }),
  // DEPRECATED: transportRoutes router removed - use boatRoutes instead
  islandData: router({
    getWithSpots: publicProcedure.input(z3.object({ islandId: z3.number() })).query(async ({ input }) => {
      return getIslandWithSpots(input.islandId);
    })
  }),
  attractionGuides: router({
    list: publicProcedure.query(async () => {
      const guides = await getAllAttractionGuides();
      return guides || [];
    }),
    featured: publicProcedure.input(z3.object({ limit: z3.number().optional() })).query(async ({ input }) => {
      const guides = await getFeaturedAttractionGuides(input.limit || 6);
      return guides || [];
    }),
    getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
      const guide = await getAttractionGuideBySlug(input.slug);
      if (!guide) {
        throw new TRPCError5({
          code: "NOT_FOUND",
          message: `Attraction guide with slug "${input.slug}" not found`
        });
      }
      return guide;
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      const guide = await getAttractionGuideById(input.id);
      if (!guide) {
        throw new TRPCError5({
          code: "NOT_FOUND",
          message: `Attraction guide with ID ${input.id} not found`
        });
      }
      return guide;
    }),
    getByType: publicProcedure.input(z3.object({ type: z3.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]), limit: z3.number().optional() })).query(async ({ input }) => {
      const guides = await getAttractionGuidesByType(input.type, input.limit || 50);
      return guides || [];
    }),
    getByAtoll: publicProcedure.input(z3.object({ atollId: z3.number(), type: z3.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]).optional() })).query(async ({ input }) => {
      const guides = await getAttractionGuidesByAtoll(input.atollId, input.type);
      return guides || [];
    }),
    getByAtollGrouped: publicProcedure.input(z3.object({ atollId: z3.number() })).query(async ({ input }) => {
      const guides = await getAttractionGuidesByAtollGrouped(input.atollId);
      return guides;
    }),
    listAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can access this"
        });
      }
      const guides = await getAllAttractionGuides();
      return guides || [];
    }),
    create: protectedProcedure.input(z3.object({
      name: z3.string().min(1),
      slug: z3.string().min(1),
      attractionType: z3.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]),
      overview: z3.string().min(1),
      difficulty: z3.string().optional(),
      bestSeason: z3.string().optional(),
      depthRange: z3.string().optional(),
      waveHeight: z3.string().optional(),
      marineLife: z3.string().optional(),
      facilities: z3.string().optional(),
      safetyTips: z3.string().optional(),
      localRules: z3.string().optional(),
      accessInfo: z3.string().optional(),
      typicalCost: z3.string().optional(),
      heroImage: z3.string().optional(),
      nearestIsland: z3.string().optional(),
      distanceFromIsland: z3.string().optional(),
      published: z3.number().default(1),
      featured: z3.number().default(0)
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can create attractions"
        });
      }
      return await createAttractionGuide(input);
    }),
    update: protectedProcedure.input(z3.object({
      id: z3.number(),
      name: z3.string().min(1).optional(),
      slug: z3.string().min(1).optional(),
      attractionType: z3.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]).optional(),
      overview: z3.string().min(1).optional(),
      difficulty: z3.string().optional(),
      bestSeason: z3.string().optional(),
      depthRange: z3.string().optional(),
      waveHeight: z3.string().optional(),
      marineLife: z3.string().optional(),
      facilities: z3.string().optional(),
      safetyTips: z3.string().optional(),
      localRules: z3.string().optional(),
      accessInfo: z3.string().optional(),
      typicalCost: z3.string().optional(),
      heroImage: z3.string().optional(),
      nearestIsland: z3.string().optional(),
      distanceFromIsland: z3.string().optional(),
      published: z3.number().optional(),
      featured: z3.number().optional()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can update attractions"
        });
      }
      const { id, ...data } = input;
      return await updateAttractionGuide(id, data);
    }),
    delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can delete attractions"
        });
      }
      return await deleteAttractionGuide(input.id);
    }),
    togglePublish: protectedProcedure.input(z3.object({ id: z3.number(), published: z3.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can publish attractions"
        });
      }
      return await updateAttractionGuide(input.id, { published: input.published });
    }),
    toggleFeature: protectedProcedure.input(z3.object({ id: z3.number(), featured: z3.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can feature attractions"
        });
      }
      return await updateAttractionGuide(input.id, { featured: input.featured });
    }),
    getRelatedIslands: publicProcedure.input(z3.object({ attractionGuideId: z3.number() })).query(async ({ input }) => {
      return await getAttractionIslandLinks(input.attractionGuideId);
    }),
    linkToIsland: protectedProcedure.input(z3.object({
      attractionGuideId: z3.number(),
      islandGuideId: z3.number(),
      distance: z3.string().optional(),
      travelTime: z3.string().optional(),
      transportMethod: z3.string().optional(),
      notes: z3.string().optional()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can link attractions to islands"
        });
      }
      return await linkAttractionToIsland(input);
    }),
    unlinkFromIsland: protectedProcedure.input(z3.object({
      attractionGuideId: z3.number(),
      islandGuideId: z3.number()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can unlink attractions from islands"
        });
      }
      return await unlinkAttractionFromIsland(input.attractionGuideId, input.islandGuideId);
    }),
    getNearbyAttractions: publicProcedure.input(z3.object({ islandGuideId: z3.number() })).query(async ({ input }) => {
      return await getAttractionsNearIsland(input.islandGuideId);
    })
  }),
  analytics: router({
    dashboard: publicProcedure.query(async () => {
      return await getAnalyticsDashboardData();
    }),
    packagePerformance: publicProcedure.query(async () => {
      return await getPackagePerformanceMetrics();
    }),
    conversions: publicProcedure.query(async () => {
      return await getConversionMetrics();
    }),
    destinations: publicProcedure.query(async () => {
      return await getDestinationMetrics();
    }),
    engagement: publicProcedure.query(async () => {
      return await getUserEngagementMetrics();
    })
  }),
  heroSettings: router({
    getByPageSlug: publicProcedure.input(z3.object({ pageSlug: z3.string() })).query(async ({ input }) => {
      return getHeroSettings(input.pageSlug);
    }),
    getAll: protectedProcedure.query(async () => {
      return getAllHeroSettings();
    }),
    update: protectedProcedure.input(z3.object({
      pageSlug: z3.string(),
      heroTitle: z3.string().optional(),
      heroSubtitle: z3.string().optional(),
      heroImageUrl: z3.string().optional(),
      overlayOpacity: z3.number().min(0).max(100).optional(),
      gradientColorStart: z3.string().optional(),
      gradientColorEnd: z3.string().optional(),
      gradientOpacityStart: z3.number().min(0).max(100).optional(),
      gradientOpacityEnd: z3.number().min(0).max(100).optional(),
      textColor: z3.string().optional(),
      subtitleColor: z3.string().optional(),
      minHeight: z3.string().optional(),
      published: z3.number().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Only admins can update hero settings" });
      }
      const { pageSlug, ...data } = input;
      return updateHeroSettings(pageSlug, data);
    }),
    create: protectedProcedure.input(z3.object({
      pageSlug: z3.string(),
      heroTitle: z3.string(),
      heroSubtitle: z3.string().optional(),
      heroImageUrl: z3.string(),
      overlayOpacity: z3.number().min(0).max(100).default(70),
      gradientColorStart: z3.string().default("primary"),
      gradientColorEnd: z3.string().default("primary"),
      gradientOpacityStart: z3.number().min(0).max(100).default(85),
      gradientOpacityEnd: z3.number().min(0).max(100).default(70),
      textColor: z3.string().default("primary-foreground"),
      subtitleColor: z3.string().default("primary-foreground"),
      minHeight: z3.string().default("min-h-96")
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Only admins can create hero settings" });
      }
      return createHeroSettings(input);
    })
  }),
  sitemap: sitemapRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/app.ts
function createApp() {
  const app2 = express();
  app2.use(express.json({ limit: "50mb" }));
  app2.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app2);
  app2.get("/api/airport-routes", async (_req, res) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }
      const airports2 = await db.select().from(places).where(eq5(places.type, "airport"));
      res.json(airports2);
    } catch (error) {
      console.error("Error fetching airports:", error);
      res.status(500).json({ error: "Failed to fetch airports" });
    }
  });
  app2.get("/api/boat-routes", async (req, res) => {
    try {
      const { islandGuideId } = req.query;
      if (!islandGuideId) {
        return res.status(400).json({ error: "islandGuideId is required" });
      }
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }
      const routes = await db.select().from(boatRoutes).where(
        eq5(boatRoutes.toIslandGuideId, parseInt(islandGuideId))
      );
      res.json(routes);
    } catch (error) {
      console.error("Error fetching boat routes:", error);
      res.status(500).json({ error: "Failed to fetch boat routes" });
    }
  });
  app2.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  return app2;
}

// tools/api-bundle-entry.ts
var app = createApp();
function handler(req, res) {
  const raw = req.query._p;
  if (raw) {
    const path = Array.isArray(raw) ? raw.join("/") : raw;
    const original = new URL(req.url ?? "/", "http://x");
    original.searchParams.delete("_p");
    const search = original.search || "";
    req.url = `/api/${path}${search}`;
  }
  return app(
    req,
    res
  );
}
export {
  handler as default
};
