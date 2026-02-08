/**
 * Ferry Schedules Data
 * Detailed departure times and frequency information for all ferry routes
 */

export interface FerrySchedule {
  id: string;
  routeId: string;
  from: string;
  to: string;
  departureTime: string; // HH:MM format
  arrivalTime: string; // HH:MM format
  duration: string;
  daysOfOperation: string[]; // e.g., ["Monday", "Tuesday", ...]
  frequency: string; // e.g., "Daily", "Weekdays", "Weekends"
  capacity: number;
  currentOccupancy: number;
  price: number;
  boatType: string;
  amenities: string[];
  status: "on-time" | "delayed" | "cancelled";
  notes: string;
}

export interface BoatInfo {
  id: string;
  name: string;
  type: "speedboat" | "ferry" | "catamaran" | "dhoni";
  capacity: number;
  speed: string; // knots
  amenities: string[];
  safetyFeatures: string[];
  operator: string;
  yearBuilt: number;
  lastMaintenance: string;
  rating: number;
  reviews: number;
}

// Ferry Schedules Data
export const FERRY_SCHEDULES: FerrySchedule[] = [
  // Malé to Ari Atoll Routes
  {
    id: "ferry-001",
    routeId: "male-ari",
    from: "Malé City",
    to: "Ari Atoll",
    departureTime: "06:00",
    arrivalTime: "07:30",
    duration: "1 hour 30 mins",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    frequency: "Daily",
    capacity: 150,
    currentOccupancy: 85,
    price: 45,
    boatType: "catamaran",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Comfortable seating"],
    status: "on-time",
    notes: "Most popular route. Book in advance during peak season.",
  },
  {
    id: "ferry-002",
    routeId: "male-ari",
    from: "Malé City",
    to: "Ari Atoll",
    departureTime: "08:30",
    arrivalTime: "10:00",
    duration: "1 hour 30 mins",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    frequency: "Daily",
    capacity: 150,
    currentOccupancy: 120,
    price: 45,
    boatType: "catamaran",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Comfortable seating"],
    status: "on-time",
    notes: "Morning departure. High occupancy during tourist season.",
  },
  {
    id: "ferry-003",
    routeId: "male-ari",
    from: "Malé City",
    to: "Ari Atoll",
    departureTime: "15:00",
    arrivalTime: "16:30",
    duration: "1 hour 30 mins",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    frequency: "Daily",
    capacity: 150,
    currentOccupancy: 65,
    price: 45,
    boatType: "catamaran",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Comfortable seating"],
    status: "on-time",
    notes: "Afternoon departure. Good for late arrivals.",
  },

  // Malé to Baa Atoll Routes
  {
    id: "ferry-004",
    routeId: "male-baa",
    from: "Malé City",
    to: "Baa Atoll",
    departureTime: "07:00",
    arrivalTime: "09:00",
    duration: "2 hours",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    frequency: "6 days a week",
    capacity: 120,
    currentOccupancy: 95,
    price: 55,
    boatType: "ferry",
    amenities: ["Air conditioning", "Refreshments", "Life jackets", "Deck seating"],
    status: "on-time",
    notes: "Scenic route. Departs early morning.",
  },
  {
    id: "ferry-005",
    routeId: "male-baa",
    from: "Malé City",
    to: "Baa Atoll",
    departureTime: "14:00",
    arrivalTime: "16:00",
    duration: "2 hours",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    frequency: "6 days a week",
    capacity: 120,
    currentOccupancy: 50,
    price: 55,
    boatType: "ferry",
    amenities: ["Air conditioning", "Refreshments", "Life jackets", "Deck seating"],
    status: "on-time",
    notes: "Afternoon departure. Less crowded.",
  },

  // Malé to Vaavu Atoll Routes
  {
    id: "ferry-006",
    routeId: "male-vaavu",
    from: "Malé City",
    to: "Vaavu Atoll",
    departureTime: "06:30",
    arrivalTime: "08:30",
    duration: "2 hours",
    daysOfOperation: ["Monday", "Wednesday", "Friday", "Sunday"],
    frequency: "4 days a week",
    capacity: 100,
    currentOccupancy: 75,
    price: 50,
    boatType: "speedboat",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Premium seating"],
    status: "on-time",
    notes: "Limited schedule. Ideal for diving trips.",
  },

  // Malé to Meemu Atoll Routes
  {
    id: "ferry-007",
    routeId: "male-meemu",
    from: "Malé City",
    to: "Meemu Atoll",
    departureTime: "05:30",
    arrivalTime: "08:00",
    duration: "2 hours 30 mins",
    daysOfOperation: ["Tuesday", "Thursday", "Saturday"],
    frequency: "3 days a week",
    capacity: 80,
    currentOccupancy: 60,
    price: 60,
    boatType: "ferry",
    amenities: ["Air conditioning", "Breakfast service", "Life jackets", "Lounge area"],
    status: "on-time",
    notes: "Early morning departure. Includes light breakfast.",
  },

  // Inter-atoll Routes
  {
    id: "ferry-008",
    routeId: "ari-baa",
    from: "Ari Atoll",
    to: "Baa Atoll",
    departureTime: "09:00",
    arrivalTime: "10:30",
    duration: "1 hour 30 mins",
    daysOfOperation: ["Monday", "Wednesday", "Friday", "Sunday"],
    frequency: "4 days a week",
    capacity: 100,
    currentOccupancy: 40,
    price: 35,
    boatType: "speedboat",
    amenities: ["Air conditioning", "Snacks", "Life jackets"],
    status: "on-time",
    notes: "Inter-atoll connection. Great for island hopping.",
  },
  {
    id: "ferry-009",
    routeId: "baa-raa",
    from: "Baa Atoll",
    to: "Raa Atoll",
    departureTime: "10:00",
    arrivalTime: "11:45",
    duration: "1 hour 45 mins",
    daysOfOperation: ["Tuesday", "Thursday", "Saturday"],
    frequency: "3 days a week",
    capacity: 90,
    currentOccupancy: 55,
    price: 40,
    boatType: "speedboat",
    amenities: ["Air conditioning", "Refreshments", "Life jackets"],
    status: "on-time",
    notes: "Northern route. Scenic views.",
  },

  // Return Routes
  {
    id: "ferry-010",
    routeId: "ari-male",
    from: "Ari Atoll",
    to: "Malé City",
    departureTime: "17:00",
    arrivalTime: "18:30",
    duration: "1 hour 30 mins",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    frequency: "Daily",
    capacity: 150,
    currentOccupancy: 100,
    price: 45,
    boatType: "catamaran",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Comfortable seating"],
    status: "on-time",
    notes: "Evening return. Popular for day trips.",
  },
  {
    id: "ferry-011",
    routeId: "baa-male",
    from: "Baa Atoll",
    to: "Malé City",
    departureTime: "16:30",
    arrivalTime: "18:30",
    duration: "2 hours",
    daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    frequency: "6 days a week",
    capacity: 120,
    currentOccupancy: 80,
    price: 55,
    boatType: "ferry",
    amenities: ["Air conditioning", "Refreshments", "Life jackets", "Deck seating"],
    status: "on-time",
    notes: "Afternoon return. Scenic sunset views.",
  },
];

// Boat Information
export const BOAT_FLEET: BoatInfo[] = [
  {
    id: "boat-001",
    name: "Island Express",
    type: "catamaran",
    capacity: 150,
    speed: "35 knots",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Comfortable seating", "Restrooms"],
    safetyFeatures: ["Life jackets for all", "Emergency equipment", "Radio communication", "First aid kit"],
    operator: "Maldives Ferry Services",
    yearBuilt: 2020,
    lastMaintenance: "2026-01-15",
    rating: 4.7,
    reviews: 450,
  },
  {
    id: "boat-002",
    name: "Coral Breeze",
    type: "catamaran",
    capacity: 150,
    speed: "35 knots",
    amenities: ["Air conditioning", "Snacks", "Life jackets", "Comfortable seating", "Restrooms"],
    safetyFeatures: ["Life jackets for all", "Emergency equipment", "Radio communication", "First aid kit"],
    operator: "Maldives Ferry Services",
    yearBuilt: 2019,
    lastMaintenance: "2026-01-20",
    rating: 4.6,
    reviews: 380,
  },
  {
    id: "boat-003",
    name: "Speedboat Alpha",
    type: "speedboat",
    capacity: 100,
    speed: "45 knots",
    amenities: ["Air conditioning", "Premium seating", "Life jackets", "Snacks", "Restrooms"],
    safetyFeatures: ["Life jackets for all", "Emergency equipment", "GPS navigation", "First aid kit"],
    operator: "Swift Transport",
    yearBuilt: 2021,
    lastMaintenance: "2026-01-10",
    rating: 4.8,
    reviews: 320,
  },
  {
    id: "boat-004",
    name: "Ocean Ferry",
    type: "ferry",
    capacity: 120,
    speed: "30 knots",
    amenities: ["Air conditioning", "Refreshments", "Life jackets", "Deck seating", "Lounge area"],
    safetyFeatures: ["Life jackets for all", "Emergency equipment", "Radio communication", "First aid kit"],
    operator: "Ocean Transport Co.",
    yearBuilt: 2018,
    lastMaintenance: "2026-01-25",
    rating: 4.5,
    reviews: 290,
  },
  {
    id: "boat-005",
    name: "Dhoni Paradise",
    type: "dhoni",
    capacity: 80,
    speed: "25 knots",
    amenities: ["Shaded deck", "Refreshments", "Life jackets", "Traditional seating"],
    safetyFeatures: ["Life jackets for all", "Emergency equipment", "Radio communication", "First aid kit"],
    operator: "Traditional Dhoni Services",
    yearBuilt: 2017,
    lastMaintenance: "2026-01-18",
    rating: 4.4,
    reviews: 210,
  },
];

/**
 * Get ferry schedules for a specific route
 */
export function getFerrySchedulesForRoute(from: string, to: string): FerrySchedule[] {
  return FERRY_SCHEDULES.filter(
    (schedule) =>
      schedule.from.toLowerCase().includes(from.toLowerCase()) &&
      schedule.to.toLowerCase().includes(to.toLowerCase())
  );
}

/**
 * Get available schedules for a specific day
 */
export function getSchedulesForDay(day: string): FerrySchedule[] {
  return FERRY_SCHEDULES.filter((schedule) =>
    schedule.daysOfOperation.includes(day)
  );
}

/**
 * Get boat information by ID
 */
export function getBoatInfo(boatId: string): BoatInfo | undefined {
  return BOAT_FLEET.find((boat) => boat.id === boatId);
}

/**
 * Get boat type statistics
 */
export function getBoatTypeStats() {
  const stats = {
    speedboat: BOAT_FLEET.filter((b) => b.type === "speedboat").length,
    ferry: BOAT_FLEET.filter((b) => b.type === "ferry").length,
    catamaran: BOAT_FLEET.filter((b) => b.type === "catamaran").length,
    dhoni: BOAT_FLEET.filter((b) => b.type === "dhoni").length,
  };
  return stats;
}

/**
 * Calculate average occupancy across all schedules
 */
export function getAverageOccupancy(): number {
  const total = FERRY_SCHEDULES.reduce((sum, schedule) => sum + schedule.currentOccupancy, 0);
  return Math.round(total / FERRY_SCHEDULES.length);
}

/**
 * Get schedules with available seats
 */
export function getAvailableSchedules(minSeatsRequired: number = 1): FerrySchedule[] {
  return FERRY_SCHEDULES.filter(
    (schedule) => schedule.capacity - schedule.currentOccupancy >= minSeatsRequired
  );
}
