// Comprehensive Destination Information Database

export interface DestinationInfo {
  id: string;
  name: string;
  atoll: string;
  type: "island" | "atoll" | "city";
  
  // Geographic Data
  coordinates: { lat: number; lng: number };
  distanceFromMale: number; // in km
  
  // Travel Info
  ferryRoutes: string[];
  flightAvailable: boolean;
  ferryDuration: string;
  flightDuration?: string;
  
  // Amenities
  amenities: string[];
  guesthouses: number;
  resorts: number;
  restaurants: number;
  
  // Activities
  activities: string[];
  
  // Seasonal Info
  bestMonths: string[];
  weatherSummary: string;
  
  // Photos
  photos: string[];
  
  // Ratings
  rating: number; // 1-5
  reviews: number;
  description: string;
}

export const DESTINATION_INFO: Record<string, DestinationInfo> = {
  "male": {
    id: "male",
    name: "Malé City",
    atoll: "Kaafu",
    type: "city",
    coordinates: { lat: 4.1748, lng: 73.5082 },
    distanceFromMale: 0,
    ferryRoutes: ["Hub for all ferries"],
    flightAvailable: true,
    ferryDuration: "N/A",
    amenities: ["Airport", "Hotels", "Restaurants", "Shopping", "Banks", "Hospitals"],
    guesthouses: 50,
    resorts: 0,
    restaurants: 100,
    activities: ["City tour", "Shopping", "Museum visit", "Local market"],
    bestMonths: ["November", "December", "January", "February", "March", "April"],
    weatherSummary: "Tropical climate, monsoon seasons affect weather",
    photos: ["/images/male-city.jpg"],
    rating: 4.2,
    reviews: 250,
    description: "Capital city of Maldives, main transportation hub with international airport",
  },

  "maafushi-island": {
    id: "maafushi-island",
    name: "Maafushi Island",
    atoll: "Kaafu (South Malé)",
    type: "island",
    coordinates: { lat: 4.4, lng: 73.4 },
    distanceFromMale: 45,
    ferryRoutes: ["Male to Maafushi (75 min)"],
    flightAvailable: false,
    ferryDuration: "75 minutes",
    amenities: ["Guesthouses", "Restaurants", "Dive shops", "Water sports", "Beach"],
    guesthouses: 15,
    resorts: 2,
    restaurants: 20,
    activities: ["Snorkeling", "Diving", "Island hopping", "Fishing", "Water sports"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Dry season: November-April. Monsoon: May-October",
    photos: ["/images/maafushi.jpg"],
    rating: 4.5,
    reviews: 320,
    description: "Popular budget-friendly island with excellent diving and snorkeling opportunities",
  },

  "dharavandhoo-island": {
    id: "dharavandhoo-island",
    name: "Dharavandhoo Island",
    atoll: "Baa",
    type: "island",
    coordinates: { lat: 5.25, lng: 73.2 },
    distanceFromMale: 120,
    ferryRoutes: ["Male to Dharavandhoo (via ferry hub)"],
    flightAvailable: true,
    ferryDuration: "3-4 hours",
    flightDuration: "20 minutes",
    amenities: ["Guesthouses", "Restaurants", "Dive center", "Beach resort", "Local shops"],
    guesthouses: 8,
    resorts: 3,
    restaurants: 12,
    activities: ["Diving", "Snorkeling", "Manta ray spotting", "Island tour", "Fishing"],
    bestMonths: ["November", "December", "January", "February", "March", "April"],
    weatherSummary: "Best for manta rays: June-November",
    photos: ["/images/dharavandhoo.jpg"],
    rating: 4.7,
    reviews: 280,
    description: "Famous for manta ray encounters and pristine coral reefs",
  },

  "ukulhas-island": {
    id: "ukulhas-island",
    name: "Ukulhas Island",
    atoll: "Alifu Alifu",
    type: "island",
    coordinates: { lat: 4.27, lng: 73.08 },
    distanceFromMale: 80,
    ferryRoutes: ["Male to Ukulhas (120 min)"],
    flightAvailable: false,
    ferryDuration: "120 minutes",
    amenities: ["Guesthouses", "Restaurants", "Dive shop", "Beach", "Local market"],
    guesthouses: 12,
    resorts: 1,
    restaurants: 15,
    activities: ["Diving", "Snorkeling", "Island hopping", "Local culture", "Fishing"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Tropical with monsoon variations",
    photos: ["/images/ukulhas.jpg"],
    rating: 4.4,
    reviews: 195,
    description: "Local island with authentic Maldivian culture and excellent diving",
  },

  "dhigurah-island": {
    id: "dhigurah-island",
    name: "Dhigurah Island",
    atoll: "Alifu Alifu",
    type: "island",
    coordinates: { lat: 4.16, lng: 73.05 },
    distanceFromMale: 90,
    ferryRoutes: ["Male to Dhigurah (150 min)"],
    flightAvailable: false,
    ferryDuration: "150 minutes",
    amenities: ["Guesthouses", "Restaurants", "Dive center", "Beach", "Water sports"],
    guesthouses: 10,
    resorts: 2,
    restaurants: 14,
    activities: ["Diving", "Snorkeling", "Whale shark spotting", "Island tour", "Fishing"],
    bestMonths: ["August", "September", "October", "November"],
    weatherSummary: "Best for whale sharks: August-October",
    photos: ["/images/dhigurah.jpg"],
    rating: 4.6,
    reviews: 240,
    description: "Known for whale shark encounters and pristine beaches",
  },

  "rasdhoo-island": {
    id: "rasdhoo-island",
    name: "Rasdhoo Island",
    atoll: "Alifu Dhaalu",
    type: "island",
    coordinates: { lat: 4.33, lng: 73.08 },
    distanceFromMale: 110,
    ferryRoutes: ["Male to Rasdhoo (300 min)"],
    flightAvailable: false,
    ferryDuration: "300 minutes",
    amenities: ["Guesthouses", "Restaurants", "Dive shop", "Beach", "Local shops"],
    guesthouses: 9,
    resorts: 1,
    restaurants: 11,
    activities: ["Diving", "Snorkeling", "Island hopping", "Local culture", "Fishing"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Tropical climate with seasonal variations",
    photos: ["/images/rasdhoo.jpg"],
    rating: 4.3,
    reviews: 165,
    description: "Quiet local island perfect for authentic island-hopping experience",
  },

  "eydhafushi-island": {
    id: "eydhafushi-island",
    name: "Eydhafushi Island",
    atoll: "Baa",
    type: "island",
    coordinates: { lat: 5.13, lng: 73.06 },
    distanceFromMale: 130,
    ferryRoutes: ["Baa Atoll ferry hub"],
    flightAvailable: true,
    ferryDuration: "3-4 hours",
    flightDuration: "25 minutes",
    amenities: ["Hospital", "Market", "Guesthouses", "Restaurants", "Shops"],
    guesthouses: 6,
    resorts: 0,
    restaurants: 10,
    activities: ["Local market", "Island tour", "Fishing", "Snorkeling"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Administrative center of Baa Atoll",
    photos: ["/images/eydhafushi.jpg"],
    rating: 4.1,
    reviews: 120,
    description: "Administrative hub of Baa Atoll with local market and authentic culture",
  },

  "hangnaameedhoo-island": {
    id: "hangnaameedhoo-island",
    name: "Hangnaameedhoo Island",
    atoll: "Alifu Dhaalu",
    type: "island",
    coordinates: { lat: 3.82, lng: 73.16 },
    distanceFromMale: 100,
    ferryRoutes: ["Male to Hangnaameedhoo"],
    flightAvailable: false,
    ferryDuration: "180 minutes",
    amenities: ["Guesthouses", "Restaurants", "Beach", "Local shops", "Fishing"],
    guesthouses: 7,
    resorts: 0,
    restaurants: 8,
    activities: ["Fishing", "Snorkeling", "Island tour", "Local culture"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Quiet local island atmosphere",
    photos: ["/images/hangnaameedhoo.jpg"],
    rating: 4.0,
    reviews: 95,
    description: "Peaceful local island ideal for budget travelers seeking authentic experience",
  },

  "gan-island": {
    id: "gan-island",
    name: "Gan Island",
    atoll: "Addu Atoll",
    type: "island",
    coordinates: { lat: 0.6, lng: 73.15 },
    distanceFromMale: 540,
    ferryRoutes: ["Flight or long ferry"],
    flightAvailable: true,
    ferryDuration: "12+ hours",
    flightDuration: "95 minutes",
    amenities: ["Airport", "Hotels", "Restaurants", "Shops", "Hospital"],
    guesthouses: 5,
    resorts: 2,
    restaurants: 15,
    activities: ["Diving", "Snorkeling", "Island tour", "Water sports", "Fishing"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Southernmost atoll with unique marine life",
    photos: ["/images/gan.jpg"],
    rating: 4.4,
    reviews: 140,
    description: "Remote southern atoll with unique diving and pristine beaches",
  },

  "funadhoo-island": {
    id: "funadhoo-island",
    name: "Funadhoo Island",
    atoll: "Shaviyani",
    type: "island",
    coordinates: { lat: 5.0, lng: 73.42 },
    distanceFromMale: 140,
    ferryRoutes: ["Via Shaviyani Atoll"],
    flightAvailable: true,
    ferryDuration: "4-5 hours",
    flightDuration: "40 minutes",
    amenities: ["Guesthouses", "Restaurants", "Dive center", "Beach"],
    guesthouses: 6,
    resorts: 1,
    restaurants: 9,
    activities: ["Diving", "Snorkeling", "Island tour", "Fishing"],
    bestMonths: ["November", "December", "January", "February", "March"],
    weatherSummary: "Northern atoll with excellent diving",
    photos: ["/images/funadhoo.jpg"],
    rating: 4.3,
    reviews: 110,
    description: "Northern island known for excellent diving and pristine coral reefs",
  },
};

// Get destination info by ID
export function getDestinationInfo(id: string): DestinationInfo | undefined {
  return DESTINATION_INFO[id];
}

// Get all destinations with info
export function getAllDestinationInfo(): DestinationInfo[] {
  return Object.values(DESTINATION_INFO);
}

// Search destinations by name
export function searchDestinations(query: string): DestinationInfo[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(DESTINATION_INFO).filter(
    (dest) =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.atoll.toLowerCase().includes(lowerQuery)
  );
}

// Get destinations by atoll
export function getDestinationsByAtoll(atoll: string): DestinationInfo[] {
  return Object.values(DESTINATION_INFO).filter((dest) => dest.atoll === atoll);
}

// Get destinations with guesthouses
export function getDestinationsWithGuesthouses(): DestinationInfo[] {
  return Object.values(DESTINATION_INFO).filter((dest) => dest.guesthouses > 0);
}

// Get top-rated destinations
export function getTopRatedDestinations(limit: number = 5): DestinationInfo[] {
  return Object.values(DESTINATION_INFO)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
