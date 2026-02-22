/**
 * User Management Database Functions
 * Handles user role assignment and management operations
 */

import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { TRPCError } from "@trpc/server";

/**
 * Get all users with their roles
 */
export async function getAllUsers() {
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
    lastSignedIn: users.lastSignedIn,
  }).from(users);
}

/**
 * Get a specific user by ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
}

/**
 * Get a specific user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

/**
 * Get a specific user by openId (Manus OAuth ID)
 */
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.openId, openId));
  return result[0] || null;
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    openId: users.openId,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.role, 'admin'));
}

/**
 * Get all regular users
 */
export async function getAllRegularUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    openId: users.openId,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.role, 'user'));
}

/**
 * Assign admin role to a user
 */
export async function assignAdminRole(userId: number) {
  const user = await getUserById(userId);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

  const result = await db
    .update(users)
    .set({ role: 'admin' })
    .where(eq(users.id, userId));

  return result;
}

/**
 * Remove admin role from a user (revert to regular user)
 */
export async function removeAdminRole(userId: number) {
  const user = await getUserById(userId);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  if (user.role !== 'admin') {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User is not an admin",
    });
  }

  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

  const result = await db
    .update(users)
    .set({ role: 'user' })
    .where(eq(users.id, userId));

  return result;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: number, role: 'user' | 'admin') {
  const user = await getUserById(userId);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

  const result = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId));

  return result;
}

/**
 * Get user role
 */
export async function getUserRole(userId: number): Promise<'user' | 'admin' | null> {
  const user = await getUserById(userId);
  return user?.role || null;
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(userId: number): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

/**
 * Count total users
 */
export async function getTotalUserCount() {
  const allUsers = await getAllUsers();
  return allUsers.length;
}

/**
 * Count admin users
 */
export async function getAdminUserCount() {
  const admins = await getAllAdminUsers();
  return admins.length;
}

/**
 * Get user statistics
 */
export async function getUserStatistics() {
  const allUsers = await getAllUsers();
  const adminUsers = await getAllAdminUsers();

  return {
    totalUsers: allUsers.length,
    adminUsers: adminUsers.length,
    regularUsers: allUsers.length - adminUsers.length,
    adminPercentage: allUsers.length > 0 
      ? ((adminUsers.length / allUsers.length) * 100).toFixed(2)
      : '0.00',
  };
}
