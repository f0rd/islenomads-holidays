/**
 * Transportation Routing System
 * Handles finding direct and multi-leg ferry routes between islands
 */

import { getDb } from "./db";
import { boatRoutes } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export interface RouteSegment {
  id: number;
  fromLocation: string;
  toLocation: string;
  type: "ferry" | "speedboat";
  duration: string;
  durationMinutes: number;
  price: number;
  name: string;
  schedule?: string | null;
  amenities?: string | null;
  boatInfo?: string | null;
}

export interface TransportationRoute {
  id: string;
  segments: RouteSegment[];
  totalDuration: string;
  totalDurationMinutes: number;
  totalCost: number;
  totalStops: number;
  isDirectRoute: boolean;
  layoverTime?: number; // minutes between segments
  description: string;
}

/**
 * Parse duration string to minutes
 * Handles formats like "45 min", "1 hour 30 min", "90 min"
 */
function parseDurationToMinutes(duration: string): number {
  const hourMatch = duration.match(/(\d+)\s*hour/i);
  const minMatch = duration.match(/(\d+)\s*min/i);

  let minutes = 0;
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);

  return minutes || 45; // default to 45 min if parsing fails
}

/**
 * Format minutes to readable duration string
 */
function formatDuration(minutes: number): string {
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

/**
 * Find direct ferry routes between two locations
 */
export async function findDirectRoutes(
  fromLocation: string,
  toLocation: string
): Promise<RouteSegment[]> {
  const db = await getDb();
  if (!db) return [];
  
  const routes = await db
    .select()
    .from(boatRoutes)
    .where(
      and(
        eq(boatRoutes.fromLocation, fromLocation),
        eq(boatRoutes.toLocation, toLocation),
        eq(boatRoutes.published, 1)
      )
    );

  return routes.map((route: typeof boatRoutes.$inferSelect) => ({
    id: route.id,
    fromLocation: route.fromLocation,
    toLocation: route.toLocation,
    type: route.type as "ferry" | "speedboat",
    duration: route.duration,
    durationMinutes: parseDurationToMinutes(route.duration),
    price: route.price,
    name: route.name,
    schedule: route.schedule,
    amenities: route.amenities,
    boatInfo: route.boatInfo,
  }));
}

/**
 * Get all unique locations from boat_routes
 */
export async function getAllLocations(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  
  const fromLocations = await db
    .selectDistinct({ location: boatRoutes.fromLocation })
    .from(boatRoutes)
    .where(eq(boatRoutes.published, 1));

  const toLocations = await db
    .selectDistinct({ location: boatRoutes.toLocation })
    .from(boatRoutes)
    .where(eq(boatRoutes.published, 1));

  const allLocations = new Set<string>();
  fromLocations.forEach((r: any) => allLocations.add(r.location));
  toLocations.forEach((r: any) => allLocations.add(r.location));

  return Array.from(allLocations).sort();
}

/**
 * Find connecting routes (one-stop) between two locations
 */
export async function findOneStopRoutes(
  fromLocation: string,
  toLocation: string,
  maxLayoverMinutes: number = 120
): Promise<TransportationRoute[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Get all routes from the starting location
  const outgoingRoutes = await db
    .select()
    .from(boatRoutes)
    .where(
      and(
        eq(boatRoutes.fromLocation, fromLocation),
        eq(boatRoutes.published, 1)
      )
    );

  const routes: TransportationRoute[] = [];

  // For each outgoing route, check if we can connect to the destination
  for (const outgoing of outgoingRoutes) {
    const connectingRoutes = await db
      .select()
      .from(boatRoutes)
      .where(
        and(
          eq(boatRoutes.fromLocation, outgoing.toLocation),
          eq(boatRoutes.toLocation, toLocation),
          eq(boatRoutes.published, 1)
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
            type: outgoing.type as "ferry" | "speedboat",
            duration: outgoing.duration,
            durationMinutes: outgoingDuration,
            price: outgoing.price,
            name: outgoing.name,
            schedule: outgoing.schedule,
            amenities: outgoing.amenities,
            boatInfo: outgoing.boatInfo,
          },
          {
            id: connecting.id,
            fromLocation: connecting.fromLocation,
            toLocation: connecting.toLocation,
            type: connecting.type as "ferry" | "speedboat",
            duration: connecting.duration,
            durationMinutes: connectingDuration,
            price: connecting.price,
            name: connecting.name,
            schedule: connecting.schedule,
            amenities: connecting.amenities,
            boatInfo: connecting.boatInfo,
          },
        ],
        totalDuration: formatDuration(totalMinutes),
        totalDurationMinutes: totalMinutes,
        totalCost: outgoing.price + connecting.price,
        totalStops: 2,
        isDirectRoute: false,
        layoverTime: maxLayoverMinutes,
        description: `${fromLocation} → ${outgoing.toLocation} → ${toLocation}`,
      });
    }
  }

  return routes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
}

/**
 * Find all available routes (direct + connecting) between two locations
 */
export async function findAllRoutes(
  fromLocation: string,
  toLocation: string
): Promise<TransportationRoute[]> {
  const allRoutes: TransportationRoute[] = [];

  // Find direct routes
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
      description: `Direct: ${fromLocation} → ${toLocation}`,
    });
  });

  // Find one-stop connecting routes
  const connectingRoutes = await findOneStopRoutes(fromLocation, toLocation);
  allRoutes.push(...connectingRoutes);

  // Sort by total duration (fastest first)
  return allRoutes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
}

/**
 * Find routes optimized by criteria
 */
export async function findOptimizedRoutes(
  fromLocation: string,
  toLocation: string,
  optimization: "speed" | "cost" | "comfort" | "balanced" = "balanced"
): Promise<TransportationRoute[]> {
  const allRoutes = await findAllRoutes(fromLocation, toLocation);

  if (allRoutes.length === 0) {
    return [];
  }

  // Sort based on optimization criteria
  switch (optimization) {
    case "speed":
      return allRoutes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);

    case "cost":
      return allRoutes.sort((a, b) => a.totalCost - b.totalCost);

    case "comfort":
      // Prefer speedboats and direct routes
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
      // Balance between speed and cost
      return allRoutes.sort((a, b) => {
        const aScore = a.totalDurationMinutes * 0.6 + (a.totalCost / 100) * 0.4;
        const bScore = b.totalDurationMinutes * 0.6 + (b.totalCost / 100) * 0.4;
        return aScore - bScore;
      });
  }
}

/**
 * Get route suggestions with fallback options
 */
export async function getRouteSuggestions(
  fromLocation: string,
  toLocation: string,
  optimization: "speed" | "cost" | "comfort" | "balanced" = "balanced"
): Promise<{
  routes: TransportationRoute[];
  hasDirectRoute: boolean;
  message: string;
}> {
  const routes = await findOptimizedRoutes(fromLocation, toLocation, optimization);

  if (routes.length === 0) {
    return {
      routes: [],
      hasDirectRoute: false,
      message: `No transportation routes found between ${fromLocation} and ${toLocation}. Please try different islands.`,
    };
  }

  const hasDirectRoute = routes.some((r) => r.isDirectRoute);
  const message = hasDirectRoute
    ? `Found ${routes.length} route(s) between ${fromLocation} and ${toLocation}`
    : `No direct routes available. Showing ${routes.length} connecting route(s) with transfers.`;

  return {
    routes: routes.slice(0, 5), // Return top 5 options
    hasDirectRoute,
    message,
  };
}
