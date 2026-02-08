/**
 * Role-Based Access Control (RBAC) Helper
 * Provides utilities for checking staff permissions
 */

import { TRPCError } from "@trpc/server";
import { Staff, StaffRole } from "../../drizzle/schema";

export type Permission = 
  | "manage_blog"
  | "manage_packages"
  | "manage_boat_routes"
  | "manage_map_locations"
  | "manage_island_guides"
  | "manage_seo"
  | "manage_staff"
  | "manage_roles"
  | "view_analytics"
  | "view_activity_log";

/**
 * Check if a staff member has a specific permission
 */
export function hasPermission(
  staffMember: Staff & { role: StaffRole } | null,
  permission: Permission
): boolean {
  if (!staffMember) return false;

  try {
    const permissions = JSON.parse(staffMember.role.permissions) as string[];
    return permissions.includes(permission) || permissions.includes("*");
  } catch {
    return false;
  }
}

/**
 * Check if a staff member has any of the specified permissions
 */
export function hasAnyPermission(
  staffMember: Staff & { role: StaffRole } | null,
  permissions: Permission[]
): boolean {
  if (!staffMember) return false;

  try {
    const staffPermissions = JSON.parse(staffMember.role.permissions) as string[];
    const hasWildcard = staffPermissions.includes("*");
    
    return hasWildcard || permissions.some(p => staffPermissions.includes(p));
  } catch {
    return false;
  }
}

/**
 * Check if a staff member has all of the specified permissions
 */
export function hasAllPermissions(
  staffMember: Staff & { role: StaffRole } | null,
  permissions: Permission[]
): boolean {
  if (!staffMember) return false;

  try {
    const staffPermissions = JSON.parse(staffMember.role.permissions) as string[];
    const hasWildcard = staffPermissions.includes("*");
    
    return hasWildcard || permissions.every(p => staffPermissions.includes(p));
  } catch {
    return false;
  }
}

/**
 * Throw an error if staff member doesn't have permission
 */
export function requirePermission(
  staffMember: Staff & { role: StaffRole } | null,
  permission: Permission
): void {
  if (!hasPermission(staffMember, permission)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to ${permission.replace(/_/g, " ")}`,
    });
  }
}

/**
 * Throw an error if staff member doesn't have any of the permissions
 */
export function requireAnyPermission(
  staffMember: Staff & { role: StaffRole } | null,
  permissions: Permission[]
): void {
  if (!hasAnyPermission(staffMember, permissions)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to perform this action`,
    });
  }
}

/**
 * Throw an error if staff member doesn't have all permissions
 */
export function requireAllPermissions(
  staffMember: Staff & { role: StaffRole } | null,
  permissions: Permission[]
): void {
  if (!hasAllPermissions(staffMember, permissions)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have all required permissions`,
    });
  }
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissions(roleName: string): Permission[] {
  const rolePermissions: Record<string, Permission[]> = {
    admin: [
      "manage_blog",
      "manage_packages",
      "manage_boat_routes",
      "manage_map_locations",
      "manage_island_guides",
      "manage_seo",
      "manage_staff",
      "manage_roles",
      "view_analytics",
      "view_activity_log",
    ],
    editor: [
      "manage_blog",
      "manage_packages",
      "manage_island_guides",
      "manage_seo",
      "view_analytics",
    ],
    content_manager: [
      "manage_blog",
      "manage_island_guides",
      "view_analytics",
    ],
    viewer: [
      "view_analytics",
      "view_activity_log",
    ],
  };

  return rolePermissions[roleName] || [];
}
