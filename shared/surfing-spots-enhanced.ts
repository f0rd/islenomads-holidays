/**
 * Enhanced Surfing Spots Database
 * Contains detailed information about all Maldives surfing spots
 */

export interface EnhancedSurfingSpot {
  id: number;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  waveHeight: string;
  bestSeason: string;
  crowdLevel: "Low" | "Moderate" | "High";
  facilities: string[];
  description: string;
  tips: string[];
  marineLife: string[];
  safetyNotes: string;
  latitude?: number;
  longitude?: number;
}

export const enhancedSurfingSpots: EnhancedSurfingSpot[] = [
  {
    id: 1,
    name: "Pasta Point",
    difficulty: "Advanced",
    waveHeight: "4-6ft",
    bestSeason: "March to October",
    crowdLevel: "Moderate",
    facilities: ["Nearby resort", "Equipment rental", "Guides available"],
    description:
      "Pasta Point is one of the Maldives' most iconic and consistent surf breaks, located near Thulusdhoo Island. This world-class reef break offers powerful, well-formed waves that peel across a shallow coral reef. The spot is best suited for experienced surfers who can handle fast-moving barrels and occasional closeouts. The wave quality is exceptional during the monsoon season, with clean offshore winds and consistent swell. The break works best on mid to high tide, and surfers should be prepared for the strong currents and sharp coral. The nearby resort provides excellent facilities and equipment rental services.",
    tips: [
      "Check tide times before paddling out",
      "Wear reef booties for protection",
      "Respect local surfers and guides",
      "Best in the morning for glassy conditions",
      "Bring a spare board for emergencies",
    ],
    marineLife: [
      "Reef sharks",
      "Trevally",
      "Grouper",
      "Parrotfish",
      "Sea turtles",
    ],
    safetyNotes:
      "Sharp coral reef - wear protective gear. Strong currents present. Always surf with a guide or experienced local. Respect marine protected areas.",
    latitude: 4.1833,
    longitude: 73.5167,
  },
  {
    id: 2,
    name: "Chickens",
    difficulty: "Advanced",
    waveHeight: "3-5ft",
    bestSeason: "March to October",
    crowdLevel: "Moderate",
    facilities: ["Local island nearby", "Basic amenities", "Guides available"],
    description:
      "Chickens is a challenging right-hand reef break that delivers hollow, fast-moving waves perfect for experienced surfers. Located near Thulusdhoo, this spot gets its name from the local wildlife. The waves are powerful and require precise positioning to catch the best sections. The break is best during mid to high tide when the waves maintain their shape and speed. Surfers should be comfortable with tight barrel sections and quick wave transitions. The spot can get crowded during peak season, but the quality waves make it worth the effort.",
    tips: [
      "Paddle out on the inside channel",
      "Position yourself for the barrel sections",
      "Watch out for the inside reform",
      "Best in light offshore winds",
      "Bring a leash and spare board",
    ],
    marineLife: ["Reef sharks", "Trevally", "Snappers", "Grouper"],
    safetyNotes:
      "Powerful waves and sharp coral. Not suitable for beginners. Always use a guide. Watch for sudden drop-offs and strong currents.",
    latitude: 4.18,
    longitude: 73.52,
  },
  {
    id: 3,
    name: "Cokes",
    difficulty: "Advanced",
    waveHeight: "3-6ft",
    bestSeason: "March to October",
    crowdLevel: "Moderate",
    facilities: ["Resort nearby", "Equipment rental", "Guides available"],
    description:
      "Cokes is a powerful left-hand reef break that offers consistent, well-formed waves for advanced surfers. Located near Thulusdhoo Island, this spot is known for its fast-moving walls and occasional barrel sections. The break works best during mid to high tide and requires good paddling fitness to handle the strong currents. The wave shape is excellent for carving and progressive maneuvers. Surfers should be prepared for the challenging paddle-out and the need to position correctly to avoid the inside closeout.",
    tips: [
      "Paddle out on the channel to the left",
      "Position for the main wall section",
      "Watch for the inside section",
      "Best in morning conditions",
      "Bring a high-performance shortboard",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper", "Snappers"],
    safetyNotes:
      "Strong currents and sharp coral. Advanced surfers only. Always use a guide. Be aware of the inside closeout.",
    latitude: 4.1833,
    longitude: 73.5,
  },
  {
    id: 4,
    name: "Sultans",
    difficulty: "Intermediate",
    waveHeight: "2-4ft",
    bestSeason: "March to October",
    crowdLevel: "Low",
    facilities: ["Local island", "Basic amenities", "Guides available"],
    description:
      "Sultans is an intermediate-friendly reef break that offers fun, forgiving waves perfect for progressing surfers. Located near Himmafushi Island, this spot provides consistent waves with good shape and manageable speed. The break works best during mid tide and offers multiple takeoff zones for different skill levels. The waves are less hollow than nearby breaks but offer more forgiving sections for practicing turns and maneuvers. The relatively low crowd levels make it an excellent choice for surfers looking to improve their skills in a less competitive environment.",
    tips: [
      "Paddle out on the channel to the right",
      "Work on your carving technique",
      "Practice your bottom turns",
      "Best in light winds",
      "Bring a fun board for maximum enjoyment",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper", "Parrotfish"],
    safetyNotes:
      "Moderate coral reef. Suitable for intermediate surfers. Use a guide for first visit. Watch for the occasional strong current.",
    latitude: 4.2,
    longitude: 73.48,
  },
  {
    id: 5,
    name: "Jailbreaks",
    difficulty: "Advanced",
    waveHeight: "4-6ft",
    bestSeason: "March to October",
    crowdLevel: "Moderate",
    facilities: ["Resort nearby", "Equipment rental", "Guides available"],
    description:
      "Jailbreaks is a powerful right-hand reef break that delivers hollow, fast-moving waves for experienced surfers. Located in the central atolls, this spot is known for its consistent quality and challenging conditions. The waves are steep and require precise takeoff positioning. The break works best during mid to high tide when the waves maintain their shape. Surfers should be comfortable with fast walls, occasional barrels, and the need to make quick decisions. The spot can get crowded during peak season, but the wave quality justifies the effort.",
    tips: [
      "Paddle out on the inside channel",
      "Position for the steepest section",
      "Watch for the barrel zone",
      "Best in offshore winds",
      "Bring a performance shortboard",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper", "Snappers"],
    safetyNotes:
      "Steep waves and sharp coral. Advanced surfers only. Always use a guide. Be prepared for strong currents.",
    latitude: 4.25,
    longitude: 73.45,
  },
  {
    id: 6,
    name: "Broken Rock Left",
    difficulty: "Advanced",
    waveHeight: "3-5ft",
    bestSeason: "March to October",
    crowdLevel: "Low",
    facilities: ["Local island", "Basic amenities", "Guides available"],
    description:
      "Broken Rock Left is a challenging left-hand reef break that offers hollow, fast-moving waves for experienced surfers. Located in the southern atolls, this spot is less crowded than northern breaks, offering a more exclusive experience. The waves are powerful and require good positioning and timing. The break works best during mid to high tide and in light offshore winds. Surfers should be comfortable with fast walls, occasional barrels, and the need to navigate around the rocky reef.",
    tips: [
      "Paddle out carefully around the rocks",
      "Position for the main wall",
      "Watch for the barrel section",
      "Best in morning conditions",
      "Bring a high-performance board",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper"],
    safetyNotes:
      "Sharp rocks and coral. Advanced surfers only. Always use a guide. Watch for sudden drop-offs.",
    latitude: 4.3,
    longitude: 73.4,
  },
  {
    id: 7,
    name: "Maamigili Right",
    difficulty: "Beginner",
    waveHeight: "2-3ft",
    bestSeason: "March to October",
    crowdLevel: "Low",
    facilities: ["Airport nearby", "Local amenities", "Guides available"],
    description:
      "Maamigili Right is a beginner-friendly reef break that offers fun, forgiving waves perfect for learning surfers. Located near Maamigili Airport, this spot provides consistent, mellow waves with good shape and manageable speed. The break works best during mid tide and offers a safe learning environment with minimal crowd. The waves are small and slow-moving, making them ideal for practicing paddling, pop-ups, and basic turning techniques. The nearby airport makes this an excellent first stop for visiting surfers.",
    tips: [
      "Perfect for beginners",
      "Practice your pop-up technique",
      "Work on paddling fitness",
      "Best in light winds",
      "Bring a soft-top board",
    ],
    marineLife: ["Small reef fish", "Parrotfish", "Grouper"],
    safetyNotes:
      "Shallow reef. Suitable for beginners. Use a guide for first visit. Wear reef booties.",
    latitude: 4.35,
    longitude: 73.35,
  },
  {
    id: 8,
    name: "Dhiggiri Outreef",
    difficulty: "Beginner",
    waveHeight: "2-4ft",
    bestSeason: "March to October",
    crowdLevel: "Low",
    facilities: ["Local island", "Basic amenities", "Guides available"],
    description:
      "Dhiggiri Outreef is a beginner-friendly reef break that offers fun, forgiving waves perfect for learning surfers. Located in the central atolls, this spot provides consistent, mellow waves with good shape and manageable speed. The break works best during mid to high tide and offers a safe learning environment. The waves are slow-moving and forgiving, making them ideal for practicing paddling, pop-ups, and basic turning techniques. The low crowd levels make it an excellent choice for beginners looking to build confidence.",
    tips: [
      "Perfect for beginners",
      "Practice your fundamentals",
      "Work on wave selection",
      "Best in light winds",
      "Bring a fun board",
    ],
    marineLife: ["Small reef fish", "Parrotfish", "Grouper"],
    safetyNotes:
      "Shallow reef. Suitable for beginners. Use a guide. Wear reef booties.",
    latitude: 4.4,
    longitude: 73.3,
  },
];

export function getSurfingSpotById(id: number): EnhancedSurfingSpot | undefined {
  return enhancedSurfingSpots.find((spot) => spot.id === id);
}

export function getSurfingSpotsByDifficulty(
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): EnhancedSurfingSpot[] {
  return enhancedSurfingSpots.filter((spot) => spot.difficulty === difficulty);
}

export function getSurfingSpotsBySeason(season: string): EnhancedSurfingSpot[] {
  return enhancedSurfingSpots.filter((spot) =>
    spot.bestSeason.includes(season)
  );
}

export function getSurfingSpotsByCrowdLevel(
  crowdLevel: "Low" | "Moderate" | "High"
): EnhancedSurfingSpot[] {
  return enhancedSurfingSpots.filter((spot) => spot.crowdLevel === crowdLevel);
}
