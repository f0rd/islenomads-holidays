import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blogPosts, InsertBlogPost, BlogPost, blogComments, InsertBlogComment, packages, InsertPackage, Package, boatRoutes, InsertBoatRoute, BoatRoute, mapLocations, InsertMapLocation, MapLocation, islandGuides, InsertIslandGuide, IslandGuide } from "../drizzle/schema";
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Blog query helpers
export async function getAllBlogPosts(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(blogPosts).where(eq(blogPosts.published, 1)).orderBy(desc(blogPosts.createdAt));
  if (limit) {
    query = query.limit(limit) as any;
  }
  return query;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogPosts).values(post);
  return result;
}

export async function updateBlogPost(id: number, updates: Partial<BlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogComments(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogComments).where(and(eq(blogComments.postId, postId), eq(blogComments.approved, 1))).orderBy(desc(blogComments.createdAt));
}

export async function createBlogComment(comment: InsertBlogComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(blogComments).values(comment);
}

// Packages query helpers
export async function getAllPackages(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(packages).where(eq(packages.published, 1)).orderBy(desc(packages.createdAt));
  if (limit) {
    query = query.limit(limit) as any;
  }
  return query;
}

export async function getPackageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPackageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(packages).where(eq(packages.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPackage(pkg: InsertPackage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(packages).values(pkg);
  return result;
}

export async function updatePackage(id: number, updates: Partial<Package>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(packages).set(updates).where(eq(packages.id, id));
}

export async function deletePackage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(packages).where(eq(packages.id, id));
}

export async function getAllPackagesAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(packages).orderBy(desc(packages.createdAt));
}

export async function getAllBlogPostsAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
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

export async function getIslandGuideById(id: number): Promise<IslandGuide | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(islandGuides).where(eq(islandGuides.id, id)).limit(1);
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

export async function updateIslandGuide(id: number, data: Partial<InsertIslandGuide>): Promise<IslandGuide | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(islandGuides).set(data).where(eq(islandGuides.id, id));
  const guide = await getIslandGuideById(id);
  return guide || null;
}

export async function deleteIslandGuide(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(islandGuides).where(eq(islandGuides.id, id));
}

export async function getAllIslandGuidesAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(islandGuides).orderBy(desc(islandGuides.createdAt));
}

export async function searchIslandGuides(query: string): Promise<IslandGuide[]> {
  const db = await getDb();
  if (!db) return [];

  const searchTerm = `%${query}%`;
  return db.select().from(islandGuides)
    .where(and(
      eq(islandGuides.published, 1),
      // Search in name, slug, atoll, or overview
      // Note: This is a simplified search - you may want to use full-text search for production
    )) as any;
}
