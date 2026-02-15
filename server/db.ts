import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, User, users, blogPosts, InsertBlogPost, BlogPost, blogComments, InsertBlogComment, BlogComment, packages, InsertPackage, Package, boatRoutes, InsertBoatRoute, BoatRoute, mapLocations, InsertMapLocation, MapLocation, islandGuides, InsertIslandGuide, IslandGuide, staff, InsertStaff, Staff, staffRoles, InsertStaffRole, StaffRole, activityLog, InsertActivityLog, ActivityLog, seoMetaTags, InsertSeoMetaTags, SeoMetaTags, crmQueries, InsertCrmQuery, CrmQuery, crmInteractions, InsertCrmInteraction, CrmInteraction, crmCustomers, InsertCrmCustomer, CrmCustomer, transports, InsertTransport, Transport, atolls, InsertAtoll, Atoll, activitySpots, InsertActivitySpot, ActivitySpot, activityTypes, ActivityType, islandSpotAccess, IslandSpotAccess, experiences, Experience, islandExperiences, InsertIslandExperience, transportRoutes, TransportRoute, media, Media, seoMetadata, SeoMetadata, places, Place, InsertPlace } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Transport helpers (centralized transport/ferry data)
export async function getAllTransports(): Promise<Transport[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transports).where(eq(transports.published, 1));
}

export async function getAllTransportsAdmin(): Promise<Transport[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transports);
}

export async function getTransportById(id: number): Promise<Transport | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transports).where(eq(transports.id, id)).limit(1);
  return result[0];
}

export async function createTransport(data: InsertTransport): Promise<Transport | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(transports).values(data);
  const id = (result as any).insertId;
  const transport = await getTransportById(id);
  return transport || null;
}

export async function updateTransport(id: number, data: Partial<InsertTransport>): Promise<Transport | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(transports).set(data).where(eq(transports.id, id));
  const transport = await getTransportById(id);
  return transport || null;
}

export async function deleteTransport(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(transports).where(eq(transports.id, id));
  return true;
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// SEO Meta Tags helpers
export async function getSeoMetaTags(contentType: string, contentId: number): Promise<SeoMetaTags | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(seoMetaTags).where(
    and(
      eq(seoMetaTags.contentType, contentType as any),
      eq(seoMetaTags.contentId, contentId)
    )
  ).limit(1);
  return result[0];
}

export async function getApprovedSeoMetaTags(contentType: string, contentId: number): Promise<SeoMetaTags | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(seoMetaTags).where(
    and(
      eq(seoMetaTags.contentType, contentType as any),
      eq(seoMetaTags.contentId, contentId),
      eq(seoMetaTags.status, "approved")
    )
  ).limit(1);
  return result[0];
}

export async function createSeoMetaTags(data: InsertSeoMetaTags): Promise<SeoMetaTags | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(seoMetaTags).values(data);
  const id = (result as any).insertId;
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}

export async function getSeoMetaTagsById(id: number): Promise<SeoMetaTags | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(seoMetaTags).where(eq(seoMetaTags.id, id)).limit(1);
  return result[0];
}

export async function updateSeoMetaTags(id: number, data: Partial<InsertSeoMetaTags>): Promise<SeoMetaTags | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(seoMetaTags).set(data).where(eq(seoMetaTags.id, id));
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}

export async function approveSeoMetaTags(id: number, approvedBy: number): Promise<SeoMetaTags | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(seoMetaTags).set({
    status: "approved",
    approvedBy,
    approvedAt: new Date(),
  }).where(eq(seoMetaTags.id, id));
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}

export async function rejectSeoMetaTags(id: number, rejectionReason: string): Promise<SeoMetaTags | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(seoMetaTags).set({
    status: "rejected",
    rejectionReason,
  }).where(eq(seoMetaTags.id, id));
  const tags = await getSeoMetaTagsById(id);
  return tags || null;
}

export async function getPendingSeoMetaTags(limit: number = 50): Promise<SeoMetaTags[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(seoMetaTags)
    .where(eq(seoMetaTags.status, "pending"))
    .orderBy(desc(seoMetaTags.createdAt))
    .limit(limit) as any;
}

export async function getSeoMetaTagsByContentType(contentType: string, status?: string): Promise<SeoMetaTags[]> {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return db.select().from(seoMetaTags)
      .where(and(
        eq(seoMetaTags.contentType, contentType as any),
        eq(seoMetaTags.status, status as any)
      ))
      .orderBy(desc(seoMetaTags.createdAt)) as any;
  }
  
  return db.select().from(seoMetaTags)
    .where(eq(seoMetaTags.contentType, contentType as any))
    .orderBy(desc(seoMetaTags.createdAt)) as any;
}

export async function deleteSeoMetaTags(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(seoMetaTags).where(eq(seoMetaTags.id, id));
  return true;
}

// Boat Routes helpers
export async function getBoatRoutes(published?: boolean): Promise<BoatRoute[]> {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(boatRoutes);
  if (published !== undefined) {
    return query.where(eq(boatRoutes.published, published ? 1 : 0)) as any;
  }
  return query as any;
}

export async function getBoatRouteBySlug(slug: string): Promise<BoatRoute | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(boatRoutes).where(eq(boatRoutes.slug, slug)).limit(1);
  return result[0];
}

export async function createBoatRoute(data: InsertBoatRoute): Promise<BoatRoute | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(boatRoutes).values(data);
  const id = (result as any).insertId;
  const route = await getBoatRouteById(id);
  return route || null;
}

export async function getBoatRouteById(id: number): Promise<BoatRoute | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(boatRoutes).where(eq(boatRoutes.id, id)).limit(1);
  return result[0];
}

export async function updateBoatRoute(id: number, data: Partial<InsertBoatRoute>): Promise<BoatRoute | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(boatRoutes).set(data).where(eq(boatRoutes.id, id));
  const route = await getBoatRouteById(id);
  return route || null;
}

export async function deleteBoatRoute(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(boatRoutes).where(eq(boatRoutes.id, id));
  return true;
}

// Get boat routes with island guide references
export async function getBoatRoutesWithIslands(): Promise<(BoatRoute & { fromIsland?: IslandGuide; toIsland?: IslandGuide })[]> {
  const db = await getDb();
  if (!db) return [];

  const routes = await db.select().from(boatRoutes).where(eq(boatRoutes.published, 1));
  
  // Enrich with island guide data
  const enriched = await Promise.all(
    routes.map(async (route) => {
      let fromIsland: IslandGuide | undefined;
      let toIsland: IslandGuide | undefined;
      
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

// Get boat routes from a specific island
export async function getBoatRoutesFromIsland(islandGuideId: number): Promise<BoatRoute[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(boatRoutes).where(
    and(
      eq(boatRoutes.fromIslandGuideId, islandGuideId),
      eq(boatRoutes.published, 1)
    )
  ) as any;
}

// Get boat routes to a specific island
export async function getBoatRoutesToIsland(islandGuideId: number): Promise<BoatRoute[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(boatRoutes).where(
    and(
      eq(boatRoutes.toIslandGuideId, islandGuideId),
      eq(boatRoutes.published, 1)
    )
  ) as any;
}

// Map Locations helpers
export async function getMapLocations(published?: boolean): Promise<MapLocation[]> {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(mapLocations);
  if (published !== undefined) {
    return query.where(eq(mapLocations.published, published ? 1 : 0)) as any;
  }
  return query as any;
}

export async function getMapLocationBySlug(slug: string): Promise<MapLocation | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(mapLocations).where(eq(mapLocations.slug, slug)).limit(1);
  return result[0];
}

export async function createMapLocation(data: InsertMapLocation): Promise<MapLocation | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(mapLocations).values(data);
  const id = (result as any).insertId;
  const location = await getMapLocationById(id);
  return location || null;
}

export async function getMapLocationById(id: number): Promise<MapLocation | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(mapLocations).where(eq(mapLocations.id, id)).limit(1);
  return result[0];
}

export async function updateMapLocation(id: number, data: Partial<InsertMapLocation>): Promise<MapLocation | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(mapLocations).set(data).where(eq(mapLocations.id, id));
  const location = await getMapLocationById(id);
  return location || null;
}

export async function deleteMapLocation(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(mapLocations).where(eq(mapLocations.id, id));
  return true;
}

export async function getMapLocationWithGuide(id: number): Promise<any> {
  const location = await getMapLocationById(id);
  if (!location || !location.guideId) return location;

  const guide = await getIslandGuideById(location.guideId);
  return { ...location, guide };
}

// Island Guides helpers
export async function getIslandGuides(published?: boolean): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(islandGuides)
    .leftJoin(places, eq(places.name, islandGuides.name));
  
  if (published !== undefined) {
    query = query.where(eq(islandGuides.published, published ? 1 : 0)) as any;
  }
  
  const results = await query;
  return results.map((row: any) => ({
    ...row.island_guides,
    placeId: row.places?.id,
  }));
}

export async function getFeaturedIslandGuides(limit: number = 3): Promise<IslandGuide[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(islandGuides)
    .where(eq(islandGuides.featured, 1))
    .orderBy(islandGuides.displayOrder)
    .limit(limit);
  return result;
}

export async function getIslandGuideBySlug(slug: string): Promise<IslandGuide | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(islandGuides).where(eq(islandGuides.slug, slug)).limit(1);
  return result[0];
}

/**
 * Get island guide by island ID (from places table)
 * This is the preferred method for linking island guides
 * Fetches the place by ID, then finds the matching island guide by name
 */
export async function getIslandGuideByIslandId(islandId: number): Promise<IslandGuide | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  // First, get the place by ID
  const place = await db.select().from(places).where(eq(places.id, islandId)).limit(1);
  if (!place || !place[0]) return undefined;

  const placeData = place[0];
  
  // Find the island guide by matching the place name
  const result = await db
    .select()
    .from(islandGuides)
    .where(eq(islandGuides.name, placeData.name))
    .limit(1);
  
  return result[0];
}

/**
 * Get place with its associated island guide
 * Returns both place and guide data together
 * Matches by place name to island guide name
 */
export async function getPlaceWithGuide(placeId: number): Promise<{ place: Place; guide: IslandGuide | null } | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const place = await db.select().from(places).where(eq(places.id, placeId)).limit(1);
  if (!place || !place[0]) return undefined;

  let guide: IslandGuide | null = null;
  
  // Find guide by matching place name
  const guideResult = await db
    .select()
    .from(islandGuides)
    .where(eq(islandGuides.name, place[0].name))
    .limit(1);
  guide = guideResult[0] || null;

  return {
    place: place[0],
    guide,
  };
}

export async function createIslandGuide(data: InsertIslandGuide): Promise<IslandGuide | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(islandGuides).values(data);
  const id = (result as any).insertId;
  const guide = await getIslandGuideById(id);
  return guide || null;
}

export async function getIslandGuideById(id: number): Promise<IslandGuide | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(islandGuides).where(eq(islandGuides.id, id)).limit(1);
  return result[0];
}

export async function updateIslandGuide(id: number, data: Partial<InsertIslandGuide>): Promise<IslandGuide | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(islandGuides).set(data).where(eq(islandGuides.id, id));
  const guide = await getIslandGuideById(id);
  return guide || null;
}

export async function updateDisplayOrder(updates: Array<{ id: number; displayOrder: number }>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    for (const update of updates) {
      await db.update(islandGuides).set({ displayOrder: update.displayOrder }).where(eq(islandGuides.id, update.id));
    }
    return true;
  } catch (error) {
    console.error('Error updating display order:', error);
    return false;
  }
}

export async function deleteIslandGuide(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(islandGuides).where(eq(islandGuides.id, id));
  return true;
}

// Blog Posts helpers
export async function getBlogPosts(published?: boolean): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(blogPosts);
  if (published !== undefined) {
    return query.where(eq(blogPosts.published, published ? 1 : 0)) as any;
  }
  return query as any;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function createBlogPost(data: InsertBlogPost): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(blogPosts).values(data);
  const id = (result as any).insertId;
  const post = await getBlogPostById(id);
  return post || null;
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  const post = await getBlogPostById(id);
  return post || null;
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return true;
}

// Packages helpers
export async function getPackages(published?: boolean): Promise<Package[]> {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(packages);
  if (published !== undefined) {
    return query.where(eq(packages.published, published ? 1 : 0)) as any;
  }
  return query as any;
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(packages).where(eq(packages.slug, slug)).limit(1);
  return result[0];
}

export async function createPackage(data: InsertPackage): Promise<Package | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(packages).values(data);
  const id = (result as any).insertId;
  const pkg = await getPackageById(id);
  return pkg || null;
}

export async function getPackageById(id: number): Promise<Package | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  return result[0];
}

export async function updatePackage(id: number, data: Partial<InsertPackage>): Promise<Package | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(packages).set(data).where(eq(packages.id, id));
  const pkg = await getPackageById(id);
  return pkg || null;
}

export async function deletePackage(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(packages).where(eq(packages.id, id));
  return true;
}

// Staff helpers
export async function getStaff(): Promise<Staff[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(staff) as any;
}

export async function getStaffById(id: number): Promise<Staff | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  return result[0];
}

export async function createStaff(data: InsertStaff): Promise<Staff | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(staff).values(data);
  const id = (result as any).insertId;
  const staffMember = await getStaffById(id);
  return staffMember || null;
}

export async function updateStaff(id: number, data: Partial<InsertStaff>): Promise<Staff | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(staff).set(data).where(eq(staff.id, id));
  const staffMember = await getStaffById(id);
  return staffMember || null;
}

export async function deleteStaff(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(staff).where(eq(staff.id, id));
  return true;
}

// Activity Log helpers
export async function createActivityLog(data: InsertActivityLog): Promise<ActivityLog | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(activityLog).values(data);
  const id = (result as any).insertId;
  const log = await getActivityLogById(id);
  return log || null;
}

export async function getActivityLogById(id: number): Promise<ActivityLog | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(activityLog).where(eq(activityLog.id, id)).limit(1);
  return result[0];
}

export async function getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(limit) as any;
}


// Additional helpers for admin and public views
export async function getAllBlogPosts(limit?: number): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(blogPosts).where(eq(blogPosts.published, 1));
  if (limit) {
    query = query.limit(limit) as any;
  }
  return query as any;
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)) as any;
}

export async function getAllPackages(limit?: number): Promise<Package[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    let query = db.select().from(packages).where(eq(packages.published, 1));
    if (limit) {
      query = query.limit(limit) as any;
    }
    const result = await query;
    return result as any;
  } catch (error) {
    console.error('[getAllPackages] Error fetching packages:', error);
    return [];
  }
}

export async function getAllPackagesAdmin(): Promise<Package[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(packages).orderBy(desc(packages.createdAt)) as any;
}

export async function getAllIslandGuidesAdmin(): Promise<IslandGuide[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(islandGuides).orderBy(desc(islandGuides.createdAt)) as any;
}

export async function getBlogComments(postId: number): Promise<BlogComment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogComments).where(eq(blogComments.postId, postId)) as any;
}

export async function createBlogComment(data: InsertBlogComment): Promise<BlogComment | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(blogComments).values(data);
  const id = (result as any).insertId;
  const comment = await db.select().from(blogComments).where(eq(blogComments.id, id)).limit(1);
  return comment[0] || null;
}


// User management helpers
export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function upsertUser(data: Partial<InsertUser> & { openId: string }): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  const existing = await getUserByOpenId(data.openId);
  if (existing) {
    await db.update(users).set({
      ...data,
      lastSignedIn: new Date(),
    }).where(eq(users.openId, data.openId));
    const updated = await getUserByOpenId(data.openId);
    return updated || null;
  } else {
    const result = await db.insert(users).values(data as InsertUser);
    const id = (result as any).insertId;
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user[0] || null;
  }
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}


// CRM Query helpers
export async function getCrmQueries(status?: string): Promise<CrmQuery[]> {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(crmQueries).orderBy(desc(crmQueries.createdAt));
  if (status) {
    return query.where(eq(crmQueries.status, status as any)) as any;
  }
  return query as any;
}

export async function getCrmQueryById(id: number): Promise<CrmQuery | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(crmQueries).where(eq(crmQueries.id, id)).limit(1);
  return result[0];
}

export async function createCrmQuery(data: InsertCrmQuery): Promise<CrmQuery | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(crmQueries).values(data);
  const id = (result as any).insertId;
  const query = await getCrmQueryById(id);
  return query || null;
}

export async function updateCrmQuery(id: number, data: Partial<InsertCrmQuery>): Promise<CrmQuery | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(crmQueries).set(data).where(eq(crmQueries.id, id));
  const query = await getCrmQueryById(id);
  return query || null;
}

export async function deleteCrmQuery(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(crmQueries).where(eq(crmQueries.id, id));
  return true;
}

// CRM Interaction helpers
export async function getCrmInteractions(queryId: number): Promise<CrmInteraction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(crmInteractions).where(eq(crmInteractions.queryId, queryId)).orderBy(desc(crmInteractions.createdAt)) as any;
}

export async function createCrmInteraction(data: InsertCrmInteraction): Promise<CrmInteraction | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(crmInteractions).values(data);
  const id = (result as any).insertId;
  const interaction = await db.select().from(crmInteractions).where(eq(crmInteractions.id, id)).limit(1);
  return interaction[0] || null;
}

// CRM Customer helpers
export async function getCrmCustomerByEmail(email: string): Promise<CrmCustomer | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(crmCustomers).where(eq(crmCustomers.email, email)).limit(1);
  return result[0];
}

export async function createCrmCustomer(data: InsertCrmCustomer): Promise<CrmCustomer | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(crmCustomers).values(data);
  const id = (result as any).insertId;
  const customer = await db.select().from(crmCustomers).where(eq(crmCustomers.id, id)).limit(1);
  return customer[0] || null;
}

export async function updateCrmCustomer(id: number, data: Partial<InsertCrmCustomer>): Promise<CrmCustomer | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(crmCustomers).set(data).where(eq(crmCustomers.id, id));
  const customer = await db.select().from(crmCustomers).where(eq(crmCustomers.id, id)).limit(1);
  return customer[0] || null;
}


// Staff and RBAC helpers
export async function getStaffByUserId(userId: number): Promise<(Staff & { role: StaffRole }) | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(staff)
    .innerJoin(staffRoles, eq(staff.roleId, staffRoles.id))
    .where(eq(staff.userId, userId))
    .limit(1);
  
  if (!result[0]) return null;
  
  return {
    ...result[0].staff,
    role: result[0].staff_roles,
  } as any;
}

export async function getStaffRole(roleId: number): Promise<StaffRole | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(staffRoles).where(eq(staffRoles.id, roleId)).limit(1);
  return result[0] || null;
}

export async function getStaffRoleByName(roleName: string): Promise<StaffRole | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(staffRoles).where(eq(staffRoles.name, roleName)).limit(1);
  return result[0] || null;
}

export async function createStaffRole(data: InsertStaffRole): Promise<StaffRole | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(staffRoles).values(data);
  const id = (result as any).insertId;
  const role = await db.select().from(staffRoles).where(eq(staffRoles.id, id)).limit(1);
  return role[0] || null;
}

export async function getAllStaff(): Promise<(Staff & { role: StaffRole })[]> {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(staff)
    .innerJoin(staffRoles, eq(staff.roleId, staffRoles.id));
  
  return results.map(r => ({
    ...r.staff,
    role: r.staff_roles,
  })) as any;
}

export async function logActivity(data: InsertActivityLog): Promise<ActivityLog | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(activityLog).values(data);
  const id = (result as any).insertId;
  const log = await db.select().from(activityLog).where(eq(activityLog.id, id)).limit(1);
  return log[0] || null;
}


// Atoll helpers
export async function getAllAtolls(): Promise<Atoll[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(atolls).where(eq(atolls.published, 1)).orderBy(atolls.name);
}

export async function getAllAtollsAdmin(): Promise<Atoll[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(atolls).orderBy(atolls.name);
}

export async function getAtollBySlug(slug: string): Promise<Atoll | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(atolls).where(eq(atolls.slug, slug)).limit(1);
  return result[0];
}

export async function getAtollById(id: number): Promise<Atoll | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(atolls).where(eq(atolls.id, id)).limit(1);
  return result[0];
}

export async function createAtoll(data: InsertAtoll): Promise<Atoll | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(atolls).values(data);
  const id = (result as any).insertId;
  const atoll = await getAtollById(id);
  return atoll || null;
}

export async function updateAtoll(id: number, data: Partial<InsertAtoll>): Promise<Atoll | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(atolls).set(data).where(eq(atolls.id, id));
  const atoll = await getAtollById(id);
  return atoll || null;
}

export async function deleteAtoll(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(atolls).where(eq(atolls.id, id));
  return true;
}

export async function getAtollsByRegion(region: string): Promise<Atoll[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(atolls).where(and(eq(atolls.region, region), eq(atolls.published, 1))).orderBy(atolls.name);
}


// Activity Spots helpers
export async function getActivitySpotsByIslandId(islandGuideId: number): Promise<ActivitySpot[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activitySpots).where(and(eq(activitySpots.islandGuideId, islandGuideId), eq(activitySpots.published, 1))).orderBy(activitySpots.displayOrder);
}

export async function getActivitySpotsByIslandIdAndType(islandGuideId: number, spotType: string): Promise<ActivitySpot[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activitySpots).where(and(eq(activitySpots.islandGuideId, islandGuideId), eq(activitySpots.spotType, spotType as any), eq(activitySpots.published, 1))).orderBy(activitySpots.displayOrder);
}

export async function getActivitySpotBySlug(slug: string): Promise<ActivitySpot | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(activitySpots).where(eq(activitySpots.slug, slug)).limit(1);
  return result[0];
}

export async function getActivitySpotById(id: number): Promise<ActivitySpot | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(activitySpots).where(eq(activitySpots.id, id)).limit(1);
  return result[0];
}

export async function createActivitySpot(data: InsertActivitySpot): Promise<ActivitySpot | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(activitySpots).values(data);
  const id = (result as any).insertId;
  const spot = await getActivitySpotById(id);
  return spot || null;
}

export async function updateActivitySpot(id: number, data: Partial<InsertActivitySpot>): Promise<ActivitySpot | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(activitySpots).set(data).where(eq(activitySpots.id, id));
  const spot = await getActivitySpotById(id);
  return spot || null;
}

export async function deleteActivitySpot(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(activitySpots).where(eq(activitySpots.id, id));
  return true;
}

export async function getAllActivitySpots(): Promise<ActivitySpot[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activitySpots).where(eq(activitySpots.published, 1)).orderBy(activitySpots.displayOrder);
}

export async function getAllActivitySpotsAdmin(): Promise<ActivitySpot[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activitySpots).orderBy(activitySpots.displayOrder);
}

export async function getIslandGuidesWithActivitySpots(): Promise<(IslandGuide & { activitySpots: ActivitySpot[]; placeId?: number })[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Get all published islands with their place IDs
  const results = await db
    .select()
    .from(islandGuides)
    .leftJoin(places, eq(places.name, islandGuides.name))
    .where(eq(islandGuides.published, 1));
  
  // For each island, fetch its activity spots
  const islandsWithSpots = await Promise.all(
    results.map(async (row: any) => {
      const island = row.island_guides;
      const spots = await db
        .select()
        .from(activitySpots)
        .where(eq(activitySpots.islandGuideId, island.id));
      return {
        ...island,
        placeId: row.places?.id,
        activitySpots: spots,
      };
    })
  );
  
  return islandsWithSpots;
}


/**
 * Get nearby activity spots within a specified radius of an island
 * Uses Haversine formula to calculate distance between coordinates
 * @param latitude Island latitude
 * @param longitude Island longitude
 * @param radiusKm Search radius in kilometers (default 10 km)
 * @returns Array of nearby activity spots
 */
export async function getNearbyActivitySpots(latitude: string | number, longitude: string | number, radiusKm: number = 10): Promise<ActivitySpot[]> {
  const db = await getDb();
  if (!db) return [];
  
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lon = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  // Get all published activity spots with coordinates
  const allSpots = await db
    .select()
    .from(activitySpots)
    .where(eq(activitySpots.published, 1));
  
  // Filter spots within radius using Haversine formula
  const nearbySpots = allSpots.filter((spot) => {
    if (!spot.latitude || !spot.longitude) return false;
    
    const spotLat = parseFloat(spot.latitude);
    const spotLon = parseFloat(spot.longitude);
    
    // Haversine formula to calculate distance
    const R = 6371; // Earth's radius in km
    const dLat = (spotLat - lat) * (Math.PI / 180);
    const dLon = (spotLon - lon) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(spotLat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance <= radiusKm;
  });
  
  return nearbySpots.sort((a, b) => {
    // Sort by display order
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });
}


// ============================================================================
// NEW SCHEMA HELPERS: Activity Types, Island-Spot Access, Experiences
// ============================================================================

/**
 * Get all activity types
 */
export async function getAllActivityTypes(): Promise<ActivityType[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activityTypes).orderBy(activityTypes.sortOrder);
}

/**
 * Get activity type by key
 */
export async function getActivityTypeByKey(key: string): Promise<ActivityType | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(activityTypes).where(eq(activityTypes.key, key)).limit(1);
  return result[0];
}

/**
 * Get all spots accessible from an island (many-to-many via islandSpotAccess)
 * Returns spots with their access metadata (distance, time, price, etc.)
 */
export async function getSpotsByIsland(islandId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      spot: activitySpots,
      access: islandSpotAccess,
      activityType: activityTypes,
    })
    .from(islandSpotAccess)
    .innerJoin(activitySpots, eq(islandSpotAccess.spotId, activitySpots.id))
    .leftJoin(activityTypes, eq(activitySpots.primaryTypeId, activityTypes.id))
    .where(eq(islandSpotAccess.islandId, islandId))
    .orderBy(islandSpotAccess.sortOrder);
  
  return result;
}

/**
 * Get all islands that can access a specific spot
 */
export async function getIslandsBySpot(spotId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      island: {
        id: islandGuides.id,
        name: islandGuides.name,
        slug: islandGuides.slug,
      },
    })
    .from(islandSpotAccess)
    .innerJoin(islandGuides, eq(islandSpotAccess.islandId, islandGuides.id))
    .where(eq(islandSpotAccess.spotId, spotId))
    .orderBy(islandSpotAccess.sortOrder);
  
  return result;
}

/**
 * Get all spots by activity type
 */
export async function getSpotsByActivityType(activityTypeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(activitySpots)
    .where(eq(activitySpots.primaryTypeId, activityTypeId))
    .orderBy(activitySpots.displayOrder);
  
  return result;
}

/**
 * Get transport routes between two islands
 */
export async function getTransportRoutesBetweenIslands(fromIslandId: number, toIslandId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(transportRoutes)
    .where(
      and(
        eq(transportRoutes.fromIslandId, fromIslandId),
        eq(transportRoutes.toIslandId, toIslandId),
        eq(transportRoutes.isActive, 1)
      )
    );
  
  return result;
}

/**
 * Get all experiences for an island
 */
export async function getExperiencesByIsland(islandId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      experience: experiences,
      activityType: activityTypes,
    })
    .from(islandExperiences)
    .innerJoin(experiences, eq(islandExperiences.experienceId, experiences.id))
    .leftJoin(activityTypes, eq(experiences.activityTypeId, activityTypes.id))
    .where(eq(islandExperiences.islandId, islandId))
    .orderBy(islandExperiences.sortOrder);
  
  return result;
}

/**
 * Get all experiences by activity type
 */
export async function getExperiencesByActivityType(activityTypeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(experiences)
    .where(eq(experiences.activityTypeId, activityTypeId))
    .orderBy(experiences.displayOrder);
  
  return result;
}

/**
 * Get SEO metadata for an entity
 */
export async function getSeoMetadata(entityType: string, entityId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(seoMetadata)
    .where(
      and(
        eq(seoMetadata.entityType, entityType as any),
        eq(seoMetadata.entityId, entityId)
      )
    )
    .limit(1);
  
  return result[0];
}

/**
 * Create or update SEO metadata
 */
export async function upsertSeoMetadata(data: {
  entityType: string;
  entityId: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageId?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  // Check if exists
  const existing = await getSeoMetadata(data.entityType, data.entityId);
  
  if (existing) {
    // Update
    await db
      .update(seoMetadata)
      .set({
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        ogImageId: data.ogImageId,
      })
      .where(
        and(
          eq(seoMetadata.entityType, data.entityType as any),
          eq(seoMetadata.entityId, data.entityId)
        )
      );
    return existing;
  } else {
    // Insert
    const result = await db.insert(seoMetadata).values(data as any);
    const id = (result as any).insertId;
    return getSeoMetadata(data.entityType, data.entityId);
  }
}

/**
 * Get island spots with full details including access metadata
 * This is the main query for island detail pages
 */
export async function getIslandWithSpots(islandId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Get island
  const island = await db
    .select()
    .from(islandGuides)
    .where(eq(islandGuides.id, islandId))
    .limit(1);
  
  if (!island || !island[0]) return null;
  
  // Get spots accessible from this island
  const spots = await getSpotsByIsland(islandId);
  
  // Get experiences available on this island
  const experienceData = await getExperiencesByIsland(islandId);
  
  // Get transport routes from this island
  const routes = await db
    .select()
    .from(transportRoutes)
    .where(eq(transportRoutes.fromIslandId, islandId));
  
  return {
    island: island[0],
    spots,
    experiences: experienceData,
    transportRoutes: routes,
  };
}


// ============================================================================
// UNIFIED SCHEMA HELPERS (New)
// These functions query the new consolidated geographical_entities schema
// ============================================================================

