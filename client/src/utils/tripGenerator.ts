/**
 * Ideal Trip Generator
 * AI-powered trip generation based on customer preferences and destinations
 */

export interface TripPreference {
  budget: "budget" | "mid-range" | "luxury" | "ultra-luxury";
  pace: "relaxed" | "moderate" | "fast";
  activities: ("diving" | "snorkeling" | "surfing" | "beach" | "culture" | "adventure")[];
  duration: number; // days
  travelers: number;
  season: string;
}

export interface GeneratedTrip {
  id: string;
  title: string;
  description: string;
  destinations: string[];
  duration: number;
  estimatedCost: number;
  itinerary: ItineraryDay[];
  highlights: string[];
  bestFor: string[];
  weatherForecast: string;
  accommodations: AccommodationSuggestion[];
  activities: ActivitySuggestion[];
  meals: number;
  transportation: TransportationSuggestion[];
  score: number; // 0-100
}

export interface ItineraryDay {
  day: number;
  destination: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  notes: string;
}

export interface AccommodationSuggestion {
  name: string;
  type: string;
  pricePerNight: number;
  rating: number;
  highlights: string[];
}

export interface ActivitySuggestion {
  name: string;
  destination: string;
  duration: string;
  price: number;
  difficulty: string;
  description: string;
}

export interface TransportationSuggestion {
  from: string;
  to: string;
  type: "speedboat" | "ferry" | "seaplane" | "domestic-flight";
  duration: string;
  price: number;
  frequency: string;
  departureTime: string;
}

export interface PricingRequest {
  id: string;
  customerName: string;
  email: string;
  destinations: string[];
  duration: number;
  travelers: number;
  budget: string;
  preferences: string;
  specialRequests: string;
  status: "pending" | "quoted" | "accepted" | "rejected";
  createdAt: Date;
  quotedPrice?: number;
  notes?: string;
}

/**
 * Generate ideal trips based on customer preferences
 */
export function generateIdealTrips(
  destinations: string[],
  preferences: TripPreference
): GeneratedTrip[] {
  const trips: GeneratedTrip[] = [];

  // Generate multiple trip options based on different themes
  const tripThemes = [
    generateRelaxationTrip(destinations, preferences),
    generateAdventureTrip(destinations, preferences),
    generateCulturalTrip(destinations, preferences),
  ];

  return tripThemes.filter((trip) => trip !== null) as GeneratedTrip[];
}

/**
 * Generate a relaxation-focused trip
 */
function generateRelaxationTrip(
  destinations: string[],
  preferences: TripPreference
): GeneratedTrip | null {
  const itinerary: ItineraryDay[] = [];

  for (let day = 1; day <= preferences.duration; day++) {
    const destination = destinations[Math.floor((day - 1) / Math.ceil(preferences.duration / destinations.length))];

    itinerary.push({
      day,
      destination,
      activities: [
        "Beach relaxation",
        "Spa treatment",
        "Sunset dinner",
        "Water activities",
      ],
      meals: ["Breakfast at resort", "Lunch at beach club", "Dinner at restaurant"],
      accommodation: "Resort with ocean view",
      notes: `Day ${day}: Relax and rejuvenate at ${destination}`,
    });
  }

  const baseCost = preferences.duration * 200 * preferences.travelers;
  const costMultiplier = {
    "budget": 1,
    "mid-range": 1.5,
    "luxury": 2.5,
    "ultra-luxury": 4,
  };

  return {
    id: `relaxation-${Date.now()}`,
    title: "Ultimate Relaxation Escape",
    description: "Perfect for those seeking peace, tranquility, and rejuvenation",
    destinations,
    duration: preferences.duration,
    estimatedCost: Math.round(baseCost * costMultiplier[preferences.budget]),
    itinerary,
    highlights: [
      "Private beach time",
      "Spa and wellness",
      "Sunset views",
      "Gourmet dining",
    ],
    bestFor: ["Couples", "Honeymooners", "Wellness enthusiasts"],
    weatherForecast: "Sunny with occasional tropical showers",
    accommodations: [
      {
        name: "Luxury Water Villa",
        type: "Resort",
        pricePerNight: 500,
        rating: 4.8,
        highlights: ["Private pool", "Ocean view", "Direct beach access"],
      },
    ],
    activities: [
      {
        name: "Spa Massage",
        destination: destinations[0],
        duration: "2 hours",
        price: 150,
        difficulty: "easy",
        description: "Traditional Maldivian spa treatment",
      },
    ],
    meals: preferences.duration * 3,
    transportation: generateTransportationSuggestions(destinations),
    score: 95,
  };
}

/**
 * Generate an adventure-focused trip
 */
function generateAdventureTrip(
  destinations: string[],
  preferences: TripPreference
): GeneratedTrip | null {
  if (!preferences.activities.includes("diving") && !preferences.activities.includes("surfing")) {
    return null;
  }

  const itinerary: ItineraryDay[] = [];

  for (let day = 1; day <= preferences.duration; day++) {
    const destination = destinations[Math.floor((day - 1) / Math.ceil(preferences.duration / destinations.length))];

    itinerary.push({
      day,
      destination,
      activities: [
        "Diving or snorkeling",
        "Water sports",
        "Island exploration",
        "Night adventure",
      ],
      meals: ["Breakfast", "Lunch", "Dinner"],
      accommodation: "Adventure resort",
      notes: `Day ${day}: Adventure activities at ${destination}`,
    });
  }

  const baseCost = preferences.duration * 250 * preferences.travelers;
  const costMultiplier = {
    "budget": 1,
    "mid-range": 1.5,
    "luxury": 2.5,
    "ultra-luxury": 4,
  };

  return {
    id: `adventure-${Date.now()}`,
    title: "Thrilling Island Adventure",
    description: "Packed with exciting activities and unforgettable experiences",
    destinations,
    duration: preferences.duration,
    estimatedCost: Math.round(baseCost * costMultiplier[preferences.budget]),
    itinerary,
    highlights: [
      "Diving expeditions",
      "Water sports",
      "Island hopping",
      "Marine life encounters",
    ],
    bestFor: ["Adventure seekers", "Divers", "Active travelers"],
    weatherForecast: "Mostly sunny, ideal for water activities",
    accommodations: [
      {
        name: "Adventure Resort",
        type: "Resort",
        pricePerNight: 350,
        rating: 4.6,
        highlights: ["Water sports center", "Dive shop", "Adventure guides"],
      },
    ],
    activities: [
      {
        name: "Scuba Diving",
        destination: destinations[0],
        duration: "4 hours",
        price: 200,
        difficulty: "intermediate",
        description: "Explore vibrant coral reefs and marine life",
      },
      {
        name: "Surfing Lesson",
        destination: destinations[1] || destinations[0],
        duration: "2 hours",
        price: 100,
        difficulty: "beginner",
        description: "Learn surfing from professional instructors",
      },
    ],
    meals: preferences.duration * 3,
    transportation: generateTransportationSuggestions(destinations),
    score: 88,
  };
}

/**
 * Generate a cultural-focused trip
 */
function generateCulturalTrip(
  destinations: string[],
  preferences: TripPreference
): GeneratedTrip | null {
  if (!preferences.activities.includes("culture")) {
    return null;
  }

  const itinerary: ItineraryDay[] = [];

  for (let day = 1; day <= preferences.duration; day++) {
    const destination = destinations[Math.floor((day - 1) / Math.ceil(preferences.duration / destinations.length))];

    itinerary.push({
      day,
      destination,
      activities: [
        "Local market visit",
        "Cultural tours",
        "Traditional dining",
        "Museum visits",
      ],
      meals: ["Local breakfast", "Street food lunch", "Traditional dinner"],
      accommodation: "Cultural guesthouse",
      notes: `Day ${day}: Immerse in culture at ${destination}`,
    });
  }

  const baseCost = preferences.duration * 180 * preferences.travelers;
  const costMultiplier = {
    "budget": 1,
    "mid-range": 1.5,
    "luxury": 2.5,
    "ultra-luxury": 4,
  };

  return {
    id: `cultural-${Date.now()}`,
    title: "Cultural Immersion Journey",
    description: "Discover the rich heritage and traditions of the Maldives",
    destinations,
    duration: preferences.duration,
    estimatedCost: Math.round(baseCost * costMultiplier[preferences.budget]),
    itinerary,
    highlights: [
      "Local markets",
      "Traditional crafts",
      "Cultural performances",
      "Local cuisine",
    ],
    bestFor: ["Culture enthusiasts", "Photographers", "History lovers"],
    weatherForecast: "Warm and tropical",
    accommodations: [
      {
        name: "Local Guesthouse",
        type: "Guesthouse",
        pricePerNight: 150,
        rating: 4.4,
        highlights: ["Local experience", "Authentic cuisine", "Cultural tours"],
      },
    ],
    activities: [
      {
        name: "Local Market Tour",
        destination: destinations[0],
        duration: "3 hours",
        price: 50,
        difficulty: "easy",
        description: "Explore local markets and meet artisans",
      },
    ],
    meals: preferences.duration * 3,
    transportation: generateTransportationSuggestions(destinations),
    score: 85,
  };
}

/**
 * Generate transportation suggestions between destinations
 */
function generateTransportationSuggestions(destinations: string[]): TransportationSuggestion[] {
  const suggestions: TransportationSuggestion[] = [];

  for (let i = 0; i < destinations.length - 1; i++) {
    suggestions.push({
      from: destinations[i],
      to: destinations[i + 1],
      type: i % 2 === 0 ? "speedboat" : "ferry",
      duration: i % 2 === 0 ? "30 mins" : "1.5 hours",
      price: i % 2 === 0 ? 150 : 80,
      frequency: "Multiple daily",
      departureTime: "08:00 AM",
    });
  }

  return suggestions;
}

/**
 * Create a custom pricing request
 */
export function createPricingRequest(
  customerName: string,
  email: string,
  destinations: string[],
  duration: number,
  travelers: number,
  budget: string,
  preferences: string,
  specialRequests: string
): PricingRequest {
  return {
    id: `pricing-${Date.now()}`,
    customerName,
    email,
    destinations,
    duration,
    travelers,
    budget,
    preferences,
    specialRequests,
    status: "pending",
    createdAt: new Date(),
  };
}

/**
 * Calculate trip score based on various factors
 */
export function calculateTripScore(trip: GeneratedTrip): number {
  let score = 80;

  // Add points for variety
  if (trip.activities.length > 3) score += 5;

  // Add points for good accommodations
  if (trip.accommodations.some((a) => a.rating > 4.5)) score += 5;

  // Add points for diverse transportation
  const transportTypes = new Set(trip.transportation.map((t) => t.type));
  if (transportTypes.size > 2) score += 5;

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Estimate trip cost
 */
export function estimateTripCost(
  destinations: string[],
  duration: number,
  travelers: number,
  budget: "budget" | "mid-range" | "luxury" | "ultra-luxury"
): number {
  const baseCostPerDay = {
    "budget": 150,
    "mid-range": 300,
    "luxury": 600,
    "ultra-luxury": 1200,
  };

  const costPerDestination = 100;
  const costPerTraveler = 50;

  const totalCost =
    (baseCostPerDay[budget] * duration) +
    (costPerDestination * destinations.length) +
    (costPerTraveler * travelers);

  return Math.round(totalCost);
}
