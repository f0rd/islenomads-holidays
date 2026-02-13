import { trpc } from "@/lib/trpc";

export interface Destination {
  id: string;
  name: string;
  type: "island" | "atoll" | "city";
  lat: number;
  lng: number;
  islandGuideId?: number; // Database island_guides table ID for islands
}

export interface RouteSegment {
  id: string;
  routeName: string;
  routeType: "speedboat" | "ferry" | "dhoni" | "seaplane";
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
    id: "maafushi-island",
    name: "Maafushi Island",
    type: "island",
    lat: 4.4,
    lng: 73.4,
    islandGuideId: 2,
  },
  {
    id: "dharavandhoo-island",
    name: "Dharavandhoo Island",
    type: "island",
    lat: 5.1,
    lng: 73.2,
  },
  {
    id: "eydhafushi-island",
    name: "Eydhafushi Island",
    type: "island",
    lat: 5.1,
    lng: 73.2,
  },
  {
    id: "dhigurah-island",
    name: "Dhigurah Island",
    type: "island",
    lat: 3.8,
    lng: 72.8,
  },
  {
    id: "ukulhas-island",
    name: "Ukulhas Island",
    type: "island",
    lat: 4.3,
    lng: 72.8,
  },
  {
    id: "kandooma-island",
    name: "Kandooma Island",
    type: "island",
    lat: 4.1,
    lng: 73.3,
    islandGuideId: 1,
  },
  {
    id: "thulusdhoo-island",
    name: "Thulusdhoo Island",
    type: "island",
    lat: 4.5,
    lng: 73.3,
    islandGuideId: 3,
  },
  {
    id: "hangnaameedhoo-island",
    name: "Hangnaameedhoo Island",
    type: "island",
    lat: 3.7,
    lng: 73.0,
  },
  {
    id: "gan-island",
    name: "Gan Island",
    type: "island",
    lat: 0.7,
    lng: 73.2,
  },
  {
    id: "funadhoo-island",
    name: "Funadhoo Island",
    type: "island",
    lat: 3.0,
    lng: 72.8,
  },
  {
    id: "felidhoo-island",
    name: "Felidhoo Island",
    type: "island",
    lat: 2.8,
    lng: 72.8,
  },
  {
    id: "naifaru-island",
    name: "Naifaru Island",
    type: "island",
    lat: 5.3,
    lng: 73.4,
  },
  {
    id: "meedhoo-island",
    name: "Meedhoo Island",
    type: "island",
    lat: 2.8,
    lng: 72.9,
  },
  {
    id: "rasdhoo-island",
    name: "Rasdhoo Island",
    type: "island",
    lat: 4.2,
    lng: 72.8,
  },
  {
    id: "isdhoo-island",
    name: "Isdhoo Island",
    type: "island",
    lat: 3.0,
    lng: 72.8,
  },
  {
    id: "velidhoo-island",
    name: "Velidhoo Island",
    type: "island",
    lat: 3.6,
    lng: 72.8,
  },
  {
    id: "dhaalu-kudahuvadhoo",
    name: "Kudahuvadhoo Island",
    type: "island",
    lat: 2.8,
    lng: 72.8,
  },
  {
    id: "haa-alif-hanimadhoo",
    name: "Hanimadhoo Island",
    type: "island",
    lat: 6.0,
    lng: 73.2,
  },
  {
    id: "haa-dhaalu-kulhudhuffushi",
    name: "Kulhudhuffushi Island",
    type: "island",
    lat: 6.3,
    lng: 73.1,
  },
];

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*(?:h|hour)?s?\s*(?:(\d+)\s*m)?/i);
  if (match) {
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
  }
  return 0;
}

function parsePrice(price: string): number {
  const match = price.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function parseDistance(distance: string): number {
  const match = distance.match(/(\d+)/);
  return match ? parseInt(match[0]) : 0;
}

// Async function to find direct routes using database transports
export async function findDirectRoutesAsync(
  transports: any[],
  from: string,
  to: string
): Promise<RouteSegment[]> {
  const routes: RouteSegment[] = [];
  const normalizedFrom = from.toLowerCase().replace(/\s+/g, '-');
  const normalizedTo = to.toLowerCase().replace(/\s+/g, '-');

  // Check transports for direct connection
  transports.forEach((transport: any) => {
    const routeFromNorm = transport.fromLocation.toLowerCase().replace(/\s+/g, '-');
    const routeToNorm = transport.toLocation.toLowerCase().replace(/\s+/g, '-');
    
    if (
      (routeFromNorm.includes(normalizedFrom) || normalizedFrom.includes(routeFromNorm)) &&
      (routeToNorm.includes(normalizedTo) || normalizedTo.includes(routeToNorm))
    ) {
      routes.push({
        id: `transport-${transport.id}`,
        routeName: `${transport.fromLocation} to ${transport.toLocation}`,
        routeType: transport.transportType,
        from: transport.fromLocation,
        to: transport.toLocation,
        duration: `${transport.durationMinutes} mins`,
        durationMinutes: transport.durationMinutes,
        distance: "N/A",
        price: `$${transport.priceUSD}`,
        priceAmount: transport.priceUSD,
        departureTime: transport.departureTime || "06:00",
        capacity: transport.capacity,
        speed: "N/A",
        amenities: transport.amenities ? JSON.parse(transport.amenities) : [],
        operator: transport.operator,
      });
    }
  });

  // If no direct routes found, try hub-based routing through Male City
  if (routes.length === 0 && normalizedFrom !== "male" && normalizedTo !== "male") {
    let fromToMaleRoute: RouteSegment | undefined;
    let maleToToRoute: RouteSegment | undefined;

    // Find route from source to Male
    transports.forEach((transport) => {
      const routeFromNorm = transport.fromLocation.toLowerCase().replace(/\s+/g, '-');
      const routeToNorm = transport.toLocation.toLowerCase().replace(/\s+/g, '-');
      if (!fromToMaleRoute && (routeFromNorm.includes(normalizedFrom) || normalizedFrom.includes(routeFromNorm)) && (routeToNorm.includes("male") || "male".includes(routeToNorm))) {
        fromToMaleRoute = {
          id: `transport-${transport.id}`,
          routeName: `${transport.fromLocation} to ${transport.toLocation}`,
          routeType: transport.transportType,
          from: transport.fromLocation,
          to: transport.toLocation,
          duration: `${transport.durationMinutes} mins`,
          durationMinutes: transport.durationMinutes,
          distance: "N/A",
          price: `$${transport.priceUSD}`,
          priceAmount: transport.priceUSD,
          departureTime: transport.departureTime || "06:00",
          capacity: transport.capacity,
          speed: "N/A",
          amenities: transport.amenities ? JSON.parse(transport.amenities) : [],
          operator: transport.operator,
        };
      }
    });

    // Find route from Male to destination (or reverse route if available)
    transports.forEach((transport) => {
      const routeFromNorm = transport.fromLocation.toLowerCase().replace(/\s+/g, '-');
      const routeToNorm = transport.toLocation.toLowerCase().replace(/\s+/g, '-');
      // Check for Male → Destination OR Destination → Male (reverse)
      if (!maleToToRoute && ((routeFromNorm.includes("male") && (routeToNorm.includes(normalizedTo) || normalizedTo.includes(routeToNorm))) || (routeToNorm.includes("male") && (routeFromNorm.includes(normalizedTo) || normalizedTo.includes(routeFromNorm))))) {
        maleToToRoute = {
          id: `transport-${transport.id}`,
          routeName: `${transport.fromLocation} to ${transport.toLocation}`,
          routeType: transport.transportType,
          from: transport.fromLocation,
          to: transport.toLocation,
          duration: `${transport.durationMinutes} mins`,
          durationMinutes: transport.durationMinutes,
          distance: "N/A",
          price: `$${transport.priceUSD}`,
          priceAmount: transport.priceUSD,
          departureTime: transport.departureTime || "06:00",
          capacity: transport.capacity,
          speed: "N/A",
          amenities: transport.amenities ? JSON.parse(transport.amenities) : [],
          operator: transport.operator,
        };
      }
    });

    // Combine hub routes if both legs exist
    if (fromToMaleRoute !== undefined && maleToToRoute !== undefined) {
      const totalMinutes = fromToMaleRoute.durationMinutes + maleToToRoute.durationMinutes + 120;
      const totalPrice = fromToMaleRoute.priceAmount + maleToToRoute.priceAmount;
      routes.push({
        id: `hub-${fromToMaleRoute.id}-${maleToToRoute.id}`,
        routeName: `${fromToMaleRoute.from} → Male → ${maleToToRoute.to}`,
        routeType: "ferry",
        from: fromToMaleRoute.from,
        to: maleToToRoute.to,
        duration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
        durationMinutes: totalMinutes,
        distance: "Multi-leg",
        price: `$${totalPrice}`,
        priceAmount: totalPrice,
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

function calculateDistance(
  from: Destination,
  to: Destination
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findOptimalItineraryAsync(
  transports: any[],
  destinationIds: string[],
  startDate: string,
  preferences?: {
    preferSpeed?: boolean;
    preferCost?: boolean;
    preferComfort?: boolean;
  }
): Promise<TripItinerary | null> {
  const destinations = destinationIds
    .map((id) => AVAILABLE_DESTINATIONS.find((d) => d.id === id))
    .filter((d) => d !== undefined) as Destination[];

  if (destinations.length < 2) return null;

  const segments: RouteSegment[] = [];
  let totalDurationMinutes = 0;
  let totalCostAmount = 0;

  // Find routes between consecutive destinations
  for (let i = 0; i < destinations.length - 1; i++) {
    const from = destinations[i];
    const to = destinations[i + 1];
    const availableRoutes = await findDirectRoutesAsync(transports, from.id, to.id);

    if (availableRoutes.length === 0) {
      return null; // No route available
    }

    // Select route based on preferences
    let selectedRoute = availableRoutes[0];

    if (preferences?.preferSpeed) {
      selectedRoute = availableRoutes.reduce((prev, curr) =>
        curr.durationMinutes < prev.durationMinutes ? curr : prev
      );
    } else if (preferences?.preferCost) {
      selectedRoute = availableRoutes.reduce((prev, curr) =>
        curr.priceAmount < prev.priceAmount ? curr : prev
      );
    } else if (preferences?.preferComfort) {
      selectedRoute = availableRoutes.reduce((prev, curr) =>
        curr.capacity > prev.capacity ? curr : prev
      );
    }

    segments.push(selectedRoute);
    totalDurationMinutes += selectedRoute.durationMinutes;
    totalCostAmount += selectedRoute.priceAmount;
  }

  if (segments.length === 0) return null;

  // Calculate end date
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(startDateObj.getTime() + totalDurationMinutes * 60000);

  const totalDurationHours = Math.floor(totalDurationMinutes / 60);
  const totalDurationMins = totalDurationMinutes % 60;

  return {
    id: `itinerary-${Date.now()}`,
    destinations,
    segments,
    totalDuration: `${totalDurationHours}h ${totalDurationMins}m`,
    totalDurationMinutes,
    totalCost: `$${totalCostAmount}`,
    totalCostAmount,
    totalDistance: "N/A",
    totalDistanceKm: 0,
    startDate,
    endDate: endDateObj.toISOString().split("T")[0],
    isOptimal: true,
  };
}

export async function generateItineraryOptionsAsync(
  transports: any[],
  destinationIds: string[],
  startDate: string
): Promise<TripItinerary[]> {
  const options: TripItinerary[] = [];
  const baseId = Date.now();
  let optionIndex = 0;

  // Speed-optimized option
  const speedOption = await findOptimalItineraryAsync(transports, destinationIds, startDate, {
    preferSpeed: true,
  });
  if (speedOption) {
    speedOption.id = `itinerary-${baseId}-${optionIndex++}`;
    options.push(speedOption);
  }

  // Cost-optimized option
  const costOption = await findOptimalItineraryAsync(transports, destinationIds, startDate, {
    preferCost: true,
  });
  if (costOption) {
    costOption.id = `itinerary-${baseId}-${optionIndex++}`;
    options.push(costOption);
  }

  // Comfort-optimized option
  const comfortOption = await findOptimalItineraryAsync(transports, destinationIds, startDate, {
    preferComfort: true,
  });
  if (comfortOption) {
    comfortOption.id = `itinerary-${baseId}-${optionIndex++}`;
    options.push(comfortOption);
  }

  // Balanced option
  const balancedOption = await findOptimalItineraryAsync(transports, destinationIds, startDate);
  if (balancedOption) {
    balancedOption.id = `itinerary-${baseId}-${optionIndex++}`;
    options.push(balancedOption);
  }

  return options;
}

// Calculate trip statistics
export function calculateTripStats(itinerary: TripItinerary) {
  return {
    totalDuration: itinerary.totalDuration,
    totalCost: itinerary.totalCost,
    averageDailyDistance: itinerary.totalDistanceKm / 1,
    segmentCount: itinerary.segments.length,
    transportTypes: Array.from(new Set(itinerary.segments.map((s) => s.routeType))),
  };
}

// Validate itinerary
export function validateItinerary(itinerary: TripItinerary): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!itinerary.destinations || itinerary.destinations.length < 2) {
    errors.push("Itinerary must have at least 2 destinations");
  }

  if (!itinerary.segments || itinerary.segments.length === 0) {
    errors.push("Itinerary must have at least one route segment");
  }

  if (itinerary.totalDurationMinutes <= 0) {
    errors.push("Total duration must be greater than 0");
  }

  if (itinerary.totalCostAmount < 0) {
    errors.push("Total cost cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
