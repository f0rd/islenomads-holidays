import { SPEEDBOAT_ROUTES, PUBLIC_FERRY_ROUTES } from "@/data/boatRoutes";

export interface Destination {
  id: string;
  name: string;
  type: "island" | "atoll" | "city";
  lat: number;
  lng: number;
}

export interface RouteSegment {
  id: string;
  routeName: string;
  routeType: "speedboat" | "ferry";
  from: string;
  to: string;
  duration: string;
  durationMinutes: number;
  distance: string;
  price: string;
  priceAmount: number;
  departureTime: string;
  capacity: number;
  speed: string;
  amenities: string[];
  operator: string;
}

export interface TripItinerary {
  id: string;
  destinations: Destination[];
  segments: RouteSegment[];
  totalDuration: string;
  totalDurationMinutes: number;
  totalCost: string;
  totalCostAmount: number;
  totalDistance: string;
  totalDistanceKm: number;
  startDate: string;
  endDate: string;
  isOptimal: boolean;
}

// Available destinations
export const AVAILABLE_DESTINATIONS: Destination[] = [
  {
    id: "male",
    name: "Malé City",
    type: "city",
    lat: 4.1748,
    lng: 73.5082,
  },
  {
    id: "north-male-atoll",
    name: "North Malé Atoll",
    type: "atoll",
    lat: 4.3,
    lng: 73.5,
  },
  {
    id: "south-male-atoll",
    name: "South Malé Atoll",
    type: "atoll",
    lat: 3.9,
    lng: 73.5,
  },
  {
    id: "ari-atoll",
    name: "Ari Atoll",
    type: "atoll",
    lat: 4.2,
    lng: 72.8,
  },
  {
    id: "baa-atoll",
    name: "Baa Atoll",
    type: "atoll",
    lat: 5.2,
    lng: 73.3,
  },
  {
    id: "vaavu-atoll",
    name: "Vaavu Atoll",
    type: "atoll",
    lat: 3.6,
    lng: 73.0,
  },
  {
    id: "meemu-atoll",
    name: "Meemu Atoll",
    type: "atoll",
    lat: 3.2,
    lng: 72.9,
  },
  {
    id: "addu-atoll",
    name: "Addu Atoll",
    type: "atoll",
    lat: 0.6,
    lng: 73.2,
  },
  {
    id: "hulhumale",
    name: "Hulhumalé",
    type: "island",
    lat: 4.2,
    lng: 73.52,
  },
  {
    id: "villingili",
    name: "Villingili",
    type: "island",
    lat: 4.15,
    lng: 73.52,
  },
  {
    id: "thilafushi",
    name: "Thilafushi",
    type: "island",
    lat: 4.18,
    lng: 73.45,
  },
  {
    id: "veligandu-island",
    name: "Veligandu Island",
    type: "island",
    lat: 4.2419,
    lng: 73.6486,
  },
  {
    id: "maafushi-island",
    name: "Maafushi Island",
    type: "island",
    lat: 3.82,
    lng: 73.35,
  },
  {
    id: "dhigurah-island",
    name: "Dhigurah Island",
    type: "island",
    lat: 3.7833,
    lng: 73.1833,
  },
  {
    id: "ukulhas-island",
    name: "Ukulhas Island",
    type: "island",
    lat: 3.9,
    lng: 73.25,
  },
  {
    id: "kandooma-island",
    name: "Kandooma Island",
    type: "island",
    lat: 4.05,
    lng: 73.52,
  },
  {
    id: "thulusdhoo-island",
    name: "Thulusdhoo Island",
    type: "island",
    lat: 4.0833,
    lng: 73.6167,
  },
  {
    id: "fihalhohi-island",
    name: "Fihalhohi Island",
    type: "island",
    lat: 3.95,
    lng: 73.3,
  },
  {
    id: "biyadhoo-island",
    name: "Biyadhoo Island",
    type: "island",
    lat: 3.8167,
    lng: 73.1667,
  },
  {
    id: "eydhafushi-island",
    name: "Eydhafushi Island",
    type: "island",
    lat: 5.1333,
    lng: 73.1667,
  },
  {
    id: "hangnaameedhoo-island",
    name: "Hangnaameedhoo Island",
    type: "island",
    lat: 0.5833,
    lng: 73.1667,
  },
  {
    id: "gan-island",
    name: "Gan Island",
    type: "island",
    lat: 0.65,
    lng: 73.15,
  },
  {
    id: "funadhoo-island",
    name: "Funadhoo Island",
    type: "island",
    lat: 5.0167,
    lng: 73.4167,
  },
  {
    id: "felidhoo-island",
    name: "Felidhoo Island",
    type: "island",
    lat: 3.8667,
    lng: 73.3167,
  },
  {
    id: "naifaru-island",
    name: "Naifaru Island",
    type: "island",
    lat: 5.3333,
    lng: 73.3667,
  },
  {
    id: "meedhoo-island",
    name: "Meedhoo Island",
    type: "island",
    lat: 3.6167,
    lng: 73.1333,
  },
  {
    id: "rasdhoo-island",
    name: "Rasdhoo Island",
    type: "island",
    lat: 4.3333,
    lng: 73.0833,
  },
  {
    id: "isdhoo-island",
    name: "Isdhoo Island",
    type: "island",
    lat: 3.5667,
    lng: 72.9667,
  },
  {
    id: "velidhoo-island",
    name: "Velidhoo Island",
    type: "island",
    lat: 3.9333,
    lng: 72.9333,
  },
  {
    id: "dhaalu-kudahuvadhoo",
    name: "Dhaalu Kudahuvadhoo",
    type: "island",
    lat: 3.4167,
    lng: 72.7667,
  },
  {
    id: "haa-alif-hanimadhoo",
    name: "Haa Alif Hanimadhoo",
    type: "island",
    lat: 6.3833,
    lng: 73.1833,
  },
  {
    id: "haa-dhaalu-kulhudhuffushi",
    name: "Haa Dhaalu Kulhudhuffushi",
    type: "island",
    lat: 6.6167,
    lng: 73.2833,
  },
  {
    id: "dharavandhoo-island",
    name: "Dharavandhoo Island",
    type: "island",
    lat: 5.2667,
    lng: 73.4167,
  },
  {
    id: "thoddoo-island",
    name: "Thoddoo Island",
    type: "island",
    lat: 4.3167,
    lng: 72.9167,
  },
  {
    id: "goidhoo-island",
    name: "Goidhoo Island",
    type: "island",
    lat: 5.0833,
    lng: 72.7833,
  },
  {
    id: "fulidhoo-island",
    name: "Fulidhoo Island",
    type: "island",
    lat: 4.9667,
    lng: 72.8833,
  },
  {
    id: "milandhoo-island",
    name: "Milandhoo Island",
    type: "island",
    lat: 5.3667,
    lng: 72.8167,
  },
  {
    id: "thinadhoo-island",
    name: "Thinadhoo Island",
    type: "island",
    lat: 4.8833,
    lng: 72.9667,
  },
  {
    id: "kamadhoo-island",
    name: "Kamadhoo Island",
    type: "island",
    lat: 3.5333,
    lng: 72.8167,
  },
];

// Parse duration string to minutes
function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*(mins?|hours?)/i);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith("hour")) {
    return value * 60;
  }
  return value;
}

// Parse price string to number
function parsePrice(price: string): number {
  const match = price.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Parse distance string to km
function parseDistance(distance: string): number {
  const match = distance.match(/(\d+)\s*km/i);
  return match ? parseInt(match[1]) : 0;
}

// Find direct routes between two destinations
export function findDirectRoutes(
  from: string,
  to: string
): RouteSegment[] {
  const routes: RouteSegment[] = [];
  const normalizedFrom = from.toLowerCase();
  const normalizedTo = to.toLowerCase();

  // Check speedboat routes for direct connection
  SPEEDBOAT_ROUTES.forEach((route) => {
    if (
      route.startPoint.toLowerCase().includes(normalizedFrom) &&
      route.endPoint.toLowerCase().includes(normalizedTo)
    ) {
      routes.push({
        id: route.id,
        routeName: route.name,
        routeType: "speedboat",
        from: route.startPoint,
        to: route.endPoint,
        duration: route.duration,
        durationMinutes: parseDuration(route.duration),
        distance: route.distance,
        price: route.price,
        priceAmount: parsePrice(route.price),
        departureTime: route.schedule[0] || "06:00",
        capacity: route.capacity,
        speed: route.speed,
        amenities: route.amenities,
        operator: route.operator,
      });
    }
  });

  // Check ferry routes for direct connection
  PUBLIC_FERRY_ROUTES.forEach((route) => {
    if (
      route.startPoint.toLowerCase().includes(normalizedFrom) &&
      route.endPoint.toLowerCase().includes(normalizedTo)
    ) {
      routes.push({
        id: route.id,
        routeName: route.name,
        routeType: "ferry",
        from: route.startPoint,
        to: route.endPoint,
        duration: route.duration,
        durationMinutes: parseDuration(route.duration),
        distance: route.distance,
        price: route.price,
        priceAmount: parsePrice(route.price),
        departureTime: route.schedule[0] || "06:00",
        capacity: route.capacity,
        speed: route.speed,
        amenities: route.amenities,
        operator: route.operator,
      });
    }
  });

  // If no direct routes found, try hub-based routing through Male City
  if (routes.length === 0 && normalizedFrom !== "male" && normalizedTo !== "male") {
    let fromToMaleRoute: RouteSegment | null = null;
    let maleToToRoute: RouteSegment | null = null;

    // Find route from source to Male
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      if (!fromToMaleRoute && route.startPoint.toLowerCase().includes(normalizedFrom) && route.endPoint.toLowerCase().includes("male")) {
        fromToMaleRoute = {
          id: route.id,
          routeName: route.name,
          routeType: "ferry",
          from: route.startPoint,
          to: route.endPoint,
          duration: route.duration,
          durationMinutes: parseDuration(route.duration),
          distance: route.distance,
          price: route.price,
          priceAmount: parsePrice(route.price),
          departureTime: route.schedule[0] || "06:00",
          capacity: route.capacity,
          speed: route.speed,
          amenities: route.amenities,
          operator: route.operator,
        };
      }
    });

    // Find route from Male to destination
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      if (!maleToToRoute && route.startPoint.toLowerCase().includes("male") && route.endPoint.toLowerCase().includes(normalizedTo)) {
        maleToToRoute = {
          id: route.id,
          routeName: route.name,
          routeType: "ferry",
          from: route.startPoint,
          to: route.endPoint,
          duration: route.duration,
          durationMinutes: parseDuration(route.duration),
          distance: route.distance,
          price: route.price,
          priceAmount: parsePrice(route.price),
          departureTime: route.schedule[0] || "06:00",
          capacity: route.capacity,
          speed: route.speed,
          amenities: route.amenities,
          operator: route.operator,
        };
      }
    });

    // Combine hub routes if both legs exist
    if (fromToMaleRoute && maleToToRoute) {
      const totalMinutes = fromToMaleRoute.durationMinutes + maleToToRoute.durationMinutes + 120;
      routes.push({
        id: `hub-${fromToMaleRoute.id}-${maleToToRoute.id}`,
        routeName: `${fromToMaleRoute.from} → Male → ${maleToToRoute.to}`,
        routeType: "ferry",
        from: fromToMaleRoute.from,
        to: maleToToRoute.to,
        duration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
        durationMinutes: totalMinutes,
        distance: "Multi-leg",
        price: `$${fromToMaleRoute.priceAmount + maleToToRoute.priceAmount}`,
        priceAmount: fromToMaleRoute.priceAmount + maleToToRoute.priceAmount,
        departureTime: fromToMaleRoute.departureTime,
        capacity: Math.min(fromToMaleRoute.capacity, maleToToRoute.capacity),
        speed: "Variable",
        amenities: [],
        operator: "Multi-leg Ferry (via Male)",
      });
    }
  }

  return routes;
}

// Calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find optimal route between destinations using Dijkstra-like algorithm
export function findOptimalItinerary(
  destinationIds: string[],
  startDate: string,
  preferences: {
    preferSpeed?: boolean;
    preferCost?: boolean;
    preferComfort?: boolean;
  } = {}
): TripItinerary | null {
  if (destinationIds.length < 2) return null;

  const destinations = destinationIds
    .map((id) => AVAILABLE_DESTINATIONS.find((d) => d.id === id))
    .filter((d) => d !== undefined) as Destination[];

  if (destinations.length < 2) return null;

  const segments: RouteSegment[] = [];
  let totalCost = 0;
  let totalDuration = 0;
  let totalDistance = 0;

  // Find routes between consecutive destinations
  for (let i = 0; i < destinations.length - 1; i++) {
    const from = destinations[i];
    const to = destinations[i + 1];

    const availableRoutes = findDirectRoutes(from.name, to.name);

    if (availableRoutes.length === 0) {
      // No direct route found
      return null;
    }

    // Select best route based on preferences
    let selectedRoute: RouteSegment;

    if (preferences.preferSpeed) {
      selectedRoute = availableRoutes.reduce((best, current) =>
        current.durationMinutes < best.durationMinutes ? current : best
      );
    } else if (preferences.preferCost) {
      selectedRoute = availableRoutes.reduce((best, current) =>
        current.priceAmount < best.priceAmount ? current : best
      );
    } else if (preferences.preferComfort) {
      selectedRoute = availableRoutes.reduce((best, current) =>
        current.capacity > best.capacity ? current : best
      );
    } else {
      // Default: balance between cost and speed
      selectedRoute = availableRoutes.reduce((best, current) => {
        const bestScore = best.priceAmount / 100 + best.durationMinutes / 60;
        const currentScore = current.priceAmount / 100 + current.durationMinutes / 60;
        return currentScore < bestScore ? current : best;
      });
    }

    segments.push(selectedRoute);
    totalCost += selectedRoute.priceAmount;
    totalDuration += selectedRoute.durationMinutes;
    totalDistance += parseDistance(selectedRoute.distance);
  }

  // Calculate end date (assuming 1 day per destination + travel time)
  const daysNeeded = destinations.length + Math.ceil(totalDuration / 1440);
  const endDate = new Date(new Date(startDate).getTime() + daysNeeded * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return {
    id: `trip-${Date.now()}`,
    destinations,
    segments,
    totalDuration: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
    totalDurationMinutes: totalDuration,
    totalCost: `$${totalCost}`,
    totalCostAmount: totalCost,
    totalDistance: `${totalDistance} km`,
    totalDistanceKm: totalDistance,
    startDate,
    endDate,
    isOptimal: true,
  };
}

// Generate multiple itinerary options
export function generateItineraryOptions(
  destinationIds: string[],
  startDate: string
): TripItinerary[] {
  const options: TripItinerary[] = [];

  // Speed-optimized option
  const speedOption = findOptimalItinerary(destinationIds, startDate, {
    preferSpeed: true,
  });
  if (speedOption) options.push(speedOption);

  // Cost-optimized option
  const costOption = findOptimalItinerary(destinationIds, startDate, {
    preferCost: true,
  });
  if (costOption) options.push(costOption);

  // Comfort-optimized option
  const comfortOption = findOptimalItinerary(destinationIds, startDate, {
    preferComfort: true,
  });
  if (comfortOption) options.push(comfortOption);

  // Balanced option
  const balancedOption = findOptimalItinerary(destinationIds, startDate);
  if (balancedOption) options.push(balancedOption);

  return options;
}

// Calculate trip statistics
export function calculateTripStats(itinerary: TripItinerary) {
  return {
    destinationCount: itinerary.destinations.length,
    segmentCount: itinerary.segments.length,
    averageCostPerDay: Math.round(
      itinerary.totalCostAmount / (itinerary.destinations.length - 1)
    ),
    averageDurationPerSegment: Math.round(
      itinerary.totalDurationMinutes / itinerary.segments.length
    ),
    fastestSegment: itinerary.segments.reduce((min, seg) =>
      seg.durationMinutes < min.durationMinutes ? seg : min
    ),
    cheapestSegment: itinerary.segments.reduce((min, seg) =>
      seg.priceAmount < min.priceAmount ? seg : min
    ),
    mostComfortableSegment: itinerary.segments.reduce((max, seg) =>
      seg.capacity > max.capacity ? seg : max
    ),
  };
}

// Validate trip itinerary
export function validateItinerary(itinerary: TripItinerary): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (itinerary.destinations.length < 2) {
    errors.push("Trip must include at least 2 destinations");
  }

  if (itinerary.segments.length === 0) {
    errors.push("Trip must have at least one route segment");
  }

  if (itinerary.segments.length !== itinerary.destinations.length - 1) {
    errors.push("Number of segments must be one less than destinations");
  }

  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);

  if (startDate >= endDate) {
    errors.push("End date must be after start date");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
