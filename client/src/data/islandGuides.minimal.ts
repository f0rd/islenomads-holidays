/**
 * Minimal Island Guides Data
 * This file contains simplified island guides for all islands in the system.
 * Each guide has the essential information needed for the island guide pages.
 */

export interface MinimalIslandGuide {
  id: string;
  name: string;
  atoll: string;
  overview: string;
  quickFacts: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const MINIMAL_ISLAND_GUIDES: MinimalIslandGuide[] = [
  {
    id: "male-guide",
    name: "Malé City",
    atoll: "Kaafu",
    overview:
      "Malé, the vibrant capital of the Maldives, is a bustling island city where modern development meets rich cultural heritage. The city serves as the gateway to the islands and offers visitors a glimpse into authentic Maldivian life beyond the resort experience.",
    quickFacts: [
      "Population: ~103,000",
      "Area: 1.8 km²",
      "Best time: November-April",
      "Main attractions: Friday Mosque, Fish Market, National Museum",
      "Currency: Maldivian Rufiyaa (MVR)",
      "Language: Dhivehi (English widely spoken)",
      "Gateway to all islands",
      "Rich cultural heritage",
    ],
    coordinates: {
      latitude: 4.1755,
      longitude: 73.5093,
    },
  },
  {
    id: "maafushi-island",
    name: "Maafushi Island",
    atoll: "Kaafu",
    overview:
      "Maafushi is one of the most popular and tourist-friendly local islands in the Maldives, located in the South Male Atoll just 30-45 minutes from Male Airport. This vibrant island offers the perfect blend of authentic Maldivian culture, budget-friendly accommodations, and world-class water activities.",
    quickFacts: [
      "Population: ~2,000 residents",
      "Distance from Male: 30-45 minutes by speedboat",
      "Best time: November-April",
      "Main beach: Bikini Beach",
      "Famous for: Budget guesthouses, beach bars, snorkeling",
      "Water sports: Kayaking, parasailing, jet skiing",
      "Diving: Excellent house reef and nearby sites",
      "Unique: Only local island with beach bars",
    ],
    coordinates: {
      latitude: 4.38,
      longitude: 73.4,
    },
  },
  {
    id: "thoddoo-island",
    name: "Thoddoo Island",
    atoll: "North Ari Atoll",
    overview:
      "Thoddoo is an authentic local island in North Ari Atoll, famous for its agricultural heritage and traditional Maldivian culture. This peaceful island is known for its watermelon farms, local markets, and fishing traditions, offering genuine cultural immersion.",
    quickFacts: [
      "Population: ~1,500 residents",
      "Atoll: North Ari Atoll (Alif Alif)",
      "Famous for: Watermelon farms and agriculture",
      "Best time: November-April",
      "Main activity: Cultural immersion and relaxation",
      "Distance from Male: 67 km (speedboat)",
      "Local market: Fresh produce and handicrafts",
      "Unique: Agricultural island with farming culture",
    ],
    coordinates: {
      latitude: 5.3,
      longitude: 73.4,
    },
  },
  {
    id: "guraidhoo-island",
    name: "Guraidhoo Island",
    atoll: "Kaafu",
    overview:
      "Guraidhoo is a charming local island in South Male Atoll with excellent house reefs and friendly locals. This peaceful destination offers authentic island experiences with world-class diving and snorkeling opportunities.",
    quickFacts: [
      "Population: ~800 residents",
      "Atoll: Kaafu (South Male)",
      "Famous for: House reef diving and snorkeling",
      "Best time: November-April",
      "Main activity: Diving and snorkeling",
      "Distance from Male: 45-60 minutes by speedboat",
      "Fishing village: Traditional culture",
      "Unique: Excellent house reef for diving",
    ],
    coordinates: {
      latitude: 3.95,
      longitude: 73.52,
    },
  },
  {
    id: "thulusdhoo-island",
    name: "Thulusdhoo Island",
    atoll: "Kaafu",
    overview:
      "Thulusdhoo is a laid-back island famous for its surfing breaks and relaxed beach culture. This island is a haven for surfers, yoga enthusiasts, and travelers seeking a peaceful island experience with excellent water sports.",
    quickFacts: [
      "Population: ~1,200 residents",
      "Atoll: Kaafu (North Male)",
      "Famous for: Surfing and beach culture",
      "Best time: March-October (for surfing)",
      "Main activity: Surfing and relaxation",
      "Distance from Male: 45 minutes by speedboat",
      "Beach vibes: Laid-back atmosphere",
      "Unique: Premier surfing destination",
    ],
    coordinates: {
      latitude: 4.35,
      longitude: 73.55,
    },
  },
  {
    id: "kandooma-island",
    name: "Kandooma Island",
    atoll: "Kaafu",
    overview:
      "Kandooma is a scenic island with beautiful beaches and excellent diving spots. This peaceful destination offers pristine beaches, world-class diving, and opportunities for island hopping to explore nearby islands.",
    quickFacts: [
      "Population: ~600 residents",
      "Atoll: Kaafu (South Male)",
      "Famous for: Scenic beaches and diving",
      "Best time: November-April",
      "Main activity: Diving and beach relaxation",
      "Distance from Male: 50-60 minutes by speedboat",
      "Diving: Multiple excellent dive sites",
      "Unique: Scenic beauty and peaceful atmosphere",
    ],
    coordinates: {
      latitude: 3.88,
      longitude: 73.52,
    },
  },
];

export function getMinimalIslandGuide(guideId: string): MinimalIslandGuide | undefined {
  return MINIMAL_ISLAND_GUIDES.find((guide) => guide.id === guideId);
}

export function getAllMinimalIslandGuides(): MinimalIslandGuide[] {
  return MINIMAL_ISLAND_GUIDES;
}

export function searchMinimalIslandGuides(query: string): MinimalIslandGuide[] {
  const lowerQuery = query.toLowerCase();
  return MINIMAL_ISLAND_GUIDES.filter(
    (guide) =>
      guide.name.toLowerCase().includes(lowerQuery) ||
      guide.atoll.toLowerCase().includes(lowerQuery) ||
      guide.overview.toLowerCase().includes(lowerQuery)
  );
}
