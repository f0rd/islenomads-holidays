import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, User, users, blogPosts, InsertBlogPost, BlogPost, blogComments, InsertBlogComment, BlogComment, packages, InsertPackage, Package, boatRoutes, InsertBoatRoute, BoatRoute, mapLocations, InsertMapLocation, MapLocation, islandGuides, InsertIslandGuide, IslandGuide, staff, InsertStaff, Staff, staffRoles, InsertStaffRole, StaffRole, activityLog, InsertActivityLog, ActivityLog, seoMetaTags, InsertSeoMetaTags, SeoMetaTags, crmQueries, InsertCrmQuery, CrmQuery, crmInteractions, InsertCrmInteraction, CrmInteraction, crmCustomers, InsertCrmCustomer, CrmCustomer } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// Island Guides helpers
export async function getIslandGuides(published?: boolean): Promise<IslandGuide[]> {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(islandGuides);
  if (published !== undefined) {
    return query.where(eq(islandGuides.published, published ? 1 : 0)) as any;
  }
  return query as any;
}

export async function getIslandGuideBySlug(slug: string): Promise<IslandGuide | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(islandGuides).where(eq(islandGuides.slug, slug)).limit(1);
  return result[0];
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
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(packages).where(eq(packages.published, 1));
  if (limit) {
    query = query.limit(limit) as any;
  }
  return query as any;
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
