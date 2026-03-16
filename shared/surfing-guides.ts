/**
 * Comprehensive Surfing Guides for Maldives Spots
 * Includes detailed tips, techniques, and local knowledge
 */

export interface SurfingGuide {
  spotName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  overview: string;
  waveCharacteristics: {
    shape: string;
    speed: string;
    barrels: string;
    consistency: string;
  };
  tideInformation: {
    bestTide: string;
    description: string;
  };
  windConditions: {
    ideal: string;
    avoid: string;
  };
  paddleOutTips: string[];
  takoffTips: string[];
  ridingTechniques: string[];
  safetyConsiderations: string[];
  marineLife: string[];
  facilities: string[];
  bestMonths: string[];
  crowdLevel: string;
  crowdDescription: string;
  localKnowledge: string[];
  equipmentRecommendations: string[];
  firstTimeVisitorTips: string[];
  advancedTechniques: string[];
}

export const surfingGuides: Record<string, SurfingGuide> = {
  "Pasta Point": {
    spotName: "Pasta Point",
    difficulty: "Advanced",
    overview:
      "Pasta Point is one of the Maldives' most iconic and consistent surf breaks, located near Thulusdhoo Island. This world-class reef break offers powerful, well-formed waves that peel across a shallow coral reef. The spot is best suited for experienced surfers who can handle fast-moving barrels and occasional closeouts. The wave quality is exceptional during the monsoon season, with clean offshore winds and consistent swell.",
    waveCharacteristics: {
      shape: "Perfect peeling right-hand reef break with defined shoulders",
      speed: "Fast-moving walls that require quick positioning",
      barrels: "Frequent barrel sections, especially on mid-tide",
      consistency: "Very consistent during monsoon season (March-October)",
    },
    tideInformation: {
      bestTide: "Mid to high tide",
      description:
        "The break works best on mid to high tide when the reef is properly submerged. Low tide can expose sharp coral and create closeouts.",
    },
    windConditions: {
      ideal: "Light offshore winds from the west",
      avoid: "Strong onshore winds from the east",
    },
    paddleOutTips: [
      "Use the channel on the left side of the break",
      "Paddle out during lulls between sets",
      "Be aware of strong currents flowing to the right",
      "Watch for other surfers paddling out",
      "Bring a leash - the current is strong",
    ],
    takoffTips: [
      "Position yourself on the shoulder of the wave",
      "Pop up quickly as the wave moves fast",
      "Aim for the steepest section",
      "Watch for the barrel zone forming",
      "Avoid the inside closeout",
    ],
    ridingTechniques: [
      "Carve aggressively on the open face",
      "Set up for barrel sections with proper positioning",
      "Use the shoulder to gain speed",
      "Practice tight turns in the barrel",
      "Learn to read the wave shape for best sections",
    ],
    safetyConsiderations: [
      "Sharp coral reef - wear protective gear",
      "Strong currents present - stay aware",
      "Always surf with a guide or experienced local",
      "Respect marine protected areas",
      "Know your limits - this is an advanced break",
    ],
    marineLife: [
      "Reef sharks (generally harmless)",
      "Trevally (fast-moving predators)",
      "Grouper",
      "Parrotfish",
      "Sea turtles",
    ],
    facilities: ["Nearby resort with equipment rental", "Guides available", "Basic amenities"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Moderate",
    crowdDescription:
      "Popular spot that gets crowded during peak season, but the wave quality justifies sharing the lineup",
    localKnowledge: [
      "Local guides know the exact takeoff positions",
      "Respect the lineup hierarchy",
      "Share waves with other surfers",
      "The break can get very hollow in big swells",
      "Morning sessions are typically cleaner",
    ],
    equipmentRecommendations: [
      "High-performance shortboard (5'6\" - 5'10\")",
      "Reef booties for protection",
      "Leash (mandatory)",
      "Rash guard for sun protection",
      "Spare board recommended",
    ],
    firstTimeVisitorTips: [
      "Book with a local guide for your first session",
      "Start on smaller days to learn the break",
      "Watch other surfers before paddling out",
      "Respect local surfers and their knowledge",
      "Take a lesson if you're not confident",
    ],
    advancedTechniques: [
      "Barrel riding technique for the inside section",
      "Aerial maneuvers on the open face",
      "Tube time management and breathing",
      "Wave reading for optimal positioning",
      "Speed generation for critical sections",
    ],
  },

  Chickens: {
    spotName: "Chickens",
    difficulty: "Advanced",
    overview:
      "Chickens is a challenging right-hand reef break that delivers hollow, fast-moving waves perfect for experienced surfers. Located near Thulusdhoo, this spot gets its name from the local wildlife. The waves are powerful and require precise positioning to catch the best sections.",
    waveCharacteristics: {
      shape: "Hollow right-hand reef break with critical sections",
      speed: "Very fast-moving walls",
      barrels: "Frequent and powerful barrels",
      consistency: "Consistent during monsoon season",
    },
    tideInformation: {
      bestTide: "Mid to high tide",
      description:
        "Best during mid to high tide when the waves maintain their shape and speed",
    },
    windConditions: {
      ideal: "Light offshore winds",
      avoid: "Onshore winds",
    },
    paddleOutTips: [
      "Paddle out on the inside channel",
      "Time your paddle out during lulls",
      "Watch for the inside reform",
      "Stay aware of the current flow",
    ],
    takoffTips: [
      "Position yourself for the barrel sections",
      "Pop up quickly and aggressively",
      "Aim for the steepest part of the wave",
      "Prepare for fast transitions",
    ],
    ridingTechniques: [
      "Barrel riding is essential",
      "Quick turns to stay in the barrel",
      "Speed generation on the face",
      "Reading the wave for critical sections",
    ],
    safetyConsiderations: [
      "Powerful waves and sharp coral",
      "Not suitable for beginners",
      "Always use a guide",
      "Watch for sudden drop-offs",
      "Strong currents present",
    ],
    marineLife: ["Reef sharks", "Trevally", "Snappers", "Grouper"],
    facilities: ["Local island nearby", "Basic amenities", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Moderate",
    crowdDescription: "Popular with experienced surfers, moderate crowds during peak season",
    localKnowledge: [
      "Local guides know the best takeoff spots",
      "The break can close out in big swells",
      "Morning conditions are typically best",
      "Respect the local surfers",
    ],
    equipmentRecommendations: [
      "High-performance shortboard",
      "Reef booties",
      "Leash",
      "Rash guard",
      "Spare board",
    ],
    firstTimeVisitorTips: [
      "Hire a local guide",
      "Watch the break before paddling out",
      "Start on smaller days",
      "Learn barrel riding techniques first",
    ],
    advancedTechniques: [
      "Advanced barrel riding",
      "Aerial maneuvers",
      "Tube time management",
      "Critical section navigation",
    ],
  },

  Cokes: {
    spotName: "Cokes",
    difficulty: "Advanced",
    overview:
      "Cokes is a powerful left-hand reef break that offers consistent, well-formed waves for advanced surfers. Located near Thulusdhoo Island, this spot is known for its fast-moving walls and occasional barrel sections.",
    waveCharacteristics: {
      shape: "Powerful left-hand reef break",
      speed: "Fast-moving walls",
      barrels: "Occasional barrel sections",
      consistency: "Very consistent during monsoon",
    },
    tideInformation: {
      bestTide: "Mid to high tide",
      description: "Works best during mid to high tide",
    },
    windConditions: {
      ideal: "Light offshore winds",
      avoid: "Strong onshore winds",
    },
    paddleOutTips: [
      "Paddle out on the channel to the left",
      "Time your paddle out carefully",
      "Watch for the current flow",
    ],
    takoffTips: [
      "Position for the main wall section",
      "Pop up quickly",
      "Aim for the steepest section",
    ],
    ridingTechniques: [
      "Carving on the open face",
      "Speed generation",
      "Turn execution",
      "Barrel positioning",
    ],
    safetyConsiderations: [
      "Strong currents and sharp coral",
      "Advanced surfers only",
      "Always use a guide",
      "Be aware of the inside closeout",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper", "Snappers"],
    facilities: ["Resort nearby", "Equipment rental", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Moderate",
    crowdDescription: "Popular with experienced surfers",
    localKnowledge: [
      "Local guides know the best takeoff spots",
      "Morning sessions are best",
      "Respect the lineup",
    ],
    equipmentRecommendations: ["High-performance shortboard", "Reef booties", "Leash", "Rash guard"],
    firstTimeVisitorTips: [
      "Hire a local guide",
      "Watch the break first",
      "Start on smaller days",
    ],
    advancedTechniques: [
      "Advanced carving",
      "Barrel riding",
      "Aerial maneuvers",
      "Speed generation",
    ],
  },

  Sultans: {
    spotName: "Sultans",
    difficulty: "Intermediate",
    overview:
      "Sultans is an intermediate-friendly reef break that offers fun, forgiving waves perfect for progressing surfers. Located near Himmafushi Island, this spot provides consistent waves with good shape and manageable speed.",
    waveCharacteristics: {
      shape: "Forgiving reef break with good shape",
      speed: "Manageable speed for intermediate surfers",
      barrels: "Some barrel sections",
      consistency: "Consistent during monsoon",
    },
    tideInformation: {
      bestTide: "Mid tide",
      description: "Works best during mid tide",
    },
    windConditions: {
      ideal: "Light winds",
      avoid: "Strong winds",
    },
    paddleOutTips: [
      "Paddle out on the channel to the right",
      "Easy paddle out",
      "Watch for other surfers",
    ],
    takoffTips: [
      "Multiple takeoff zones",
      "Good for practicing positioning",
      "Forgiving wave shape",
    ],
    ridingTechniques: [
      "Work on carving technique",
      "Practice bottom turns",
      "Improve wave selection",
      "Learn barrel positioning",
    ],
    safetyConsiderations: [
      "Moderate coral reef",
      "Suitable for intermediate surfers",
      "Use a guide for first visit",
      "Watch for occasional strong current",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper", "Parrotfish"],
    facilities: ["Local island", "Basic amenities", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Low",
    crowdDescription: "Low crowds make it perfect for practicing",
    localKnowledge: [
      "Great for skill development",
      "Friendly local surfers",
      "Good for intermediate progression",
    ],
    equipmentRecommendations: ["Fun board", "Reef booties", "Leash", "Rash guard"],
    firstTimeVisitorTips: [
      "Perfect for intermediate surfers",
      "Good for practicing techniques",
      "Low crowd levels",
      "Friendly atmosphere",
    ],
    advancedTechniques: [
      "Carving technique refinement",
      "Barrel positioning practice",
      "Wave selection skills",
      "Speed generation",
    ],
  },

  Jailbreaks: {
    spotName: "Jailbreaks",
    difficulty: "Advanced",
    overview:
      "Jailbreaks is a powerful right-hand reef break that delivers hollow, fast-moving waves for experienced surfers. Located in the central atolls, this spot is known for its consistent quality and challenging conditions.",
    waveCharacteristics: {
      shape: "Hollow right-hand reef break",
      speed: "Fast-moving waves",
      barrels: "Frequent barrels",
      consistency: "Very consistent",
    },
    tideInformation: {
      bestTide: "Mid to high tide",
      description: "Best during mid to high tide",
    },
    windConditions: {
      ideal: "Offshore winds",
      avoid: "Onshore winds",
    },
    paddleOutTips: [
      "Paddle out on the inside channel",
      "Time your paddle out",
      "Watch for strong currents",
    ],
    takoffTips: [
      "Position for the steepest section",
      "Pop up quickly",
      "Prepare for fast transitions",
    ],
    ridingTechniques: [
      "Fast wall carving",
      "Barrel riding",
      "Speed generation",
      "Critical section navigation",
    ],
    safetyConsiderations: [
      "Steep waves and sharp coral",
      "Advanced surfers only",
      "Always use a guide",
      "Be prepared for strong currents",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper", "Snappers"],
    facilities: ["Resort nearby", "Equipment rental", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Moderate",
    crowdDescription: "Popular with experienced surfers",
    localKnowledge: [
      "Local guides know the best spots",
      "Morning sessions are best",
      "Respect the lineup",
    ],
    equipmentRecommendations: ["Performance shortboard", "Reef booties", "Leash", "Rash guard"],
    firstTimeVisitorTips: [
      "Hire a local guide",
      "Watch the break first",
      "Start on smaller days",
    ],
    advancedTechniques: [
      "Advanced barrel riding",
      "Aerial maneuvers",
      "Speed generation",
      "Tube time management",
    ],
  },

  "Broken Rock Left": {
    spotName: "Broken Rock Left",
    difficulty: "Advanced",
    overview:
      "Broken Rock Left is a challenging left-hand reef break that offers hollow, fast-moving waves for experienced surfers. Located in the southern atolls, this spot is less crowded than northern breaks.",
    waveCharacteristics: {
      shape: "Hollow left-hand reef break",
      speed: "Fast-moving waves",
      barrels: "Frequent barrels",
      consistency: "Consistent",
    },
    tideInformation: {
      bestTide: "Mid to high tide",
      description: "Best during mid to high tide",
    },
    windConditions: {
      ideal: "Offshore winds",
      avoid: "Onshore winds",
    },
    paddleOutTips: [
      "Paddle out carefully around the rocks",
      "Watch for sharp edges",
      "Time your paddle out",
    ],
    takoffTips: [
      "Position for the main wall",
      "Pop up quickly",
      "Prepare for fast transitions",
    ],
    ridingTechniques: [
      "Barrel riding",
      "Fast carving",
      "Speed generation",
      "Critical section navigation",
    ],
    safetyConsiderations: [
      "Sharp rocks and coral",
      "Advanced surfers only",
      "Always use a guide",
      "Watch for sudden drop-offs",
    ],
    marineLife: ["Reef sharks", "Trevally", "Grouper"],
    facilities: ["Local island", "Basic amenities", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Low",
    crowdDescription: "Less crowded than northern breaks",
    localKnowledge: [
      "Exclusive experience",
      "Local guides essential",
      "Fewer surfers",
    ],
    equipmentRecommendations: ["High-performance board", "Reef booties", "Leash", "Rash guard"],
    firstTimeVisitorTips: [
      "Hire a local guide",
      "Watch the break first",
      "Be careful around rocks",
    ],
    advancedTechniques: [
      "Advanced barrel riding",
      "Aerial maneuvers",
      "Speed generation",
      "Rock navigation",
    ],
  },

  "Maamigili Right": {
    spotName: "Maamigili Right",
    difficulty: "Beginner",
    overview:
      "Maamigili Right is a beginner-friendly reef break that offers fun, forgiving waves perfect for learning surfers. Located near Maamigili Airport, this spot provides consistent, mellow waves.",
    waveCharacteristics: {
      shape: "Forgiving reef break",
      speed: "Slow-moving waves",
      barrels: "Rare",
      consistency: "Very consistent",
    },
    tideInformation: {
      bestTide: "Mid tide",
      description: "Works best during mid tide",
    },
    windConditions: {
      ideal: "Light winds",
      avoid: "Strong winds",
    },
    paddleOutTips: [
      "Easy paddle out",
      "Watch for other surfers",
      "Stay in the channel",
    ],
    takoffTips: [
      "Multiple takeoff zones",
      "Plenty of time to pop up",
      "Forgiving wave shape",
    ],
    ridingTechniques: [
      "Practice pop-up technique",
      "Work on paddling fitness",
      "Learn basic turning",
      "Improve wave selection",
    ],
    safetyConsiderations: [
      "Shallow reef - wear reef booties",
      "Suitable for beginners",
      "Use a guide for first visit",
      "Watch for occasional strong current",
    ],
    marineLife: ["Small reef fish", "Parrotfish", "Grouper"],
    facilities: ["Airport nearby", "Local amenities", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Low",
    crowdDescription: "Low crowds perfect for learning",
    localKnowledge: [
      "Perfect for beginners",
      "Friendly atmosphere",
      "Good for skill development",
    ],
    equipmentRecommendations: ["Soft-top board", "Reef booties", "Leash", "Rash guard"],
    firstTimeVisitorTips: [
      "Perfect for beginners",
      "Practice your pop-up",
      "Work on paddling",
      "Take a lesson",
    ],
    advancedTechniques: [
      "Pop-up technique refinement",
      "Paddling efficiency",
      "Wave selection skills",
      "Basic turning",
    ],
  },

  "Dhiggiri Outreef": {
    spotName: "Dhiggiri Outreef",
    difficulty: "Beginner",
    overview:
      "Dhiggiri Outreef is a beginner-friendly reef break that offers fun, forgiving waves perfect for learning surfers. Located in the central atolls, this spot provides consistent, mellow waves.",
    waveCharacteristics: {
      shape: "Forgiving reef break",
      speed: "Slow-moving waves",
      barrels: "Rare",
      consistency: "Very consistent",
    },
    tideInformation: {
      bestTide: "Mid to high tide",
      description: "Works best during mid to high tide",
    },
    windConditions: {
      ideal: "Light winds",
      avoid: "Strong winds",
    },
    paddleOutTips: [
      "Easy paddle out",
      "Stay in the channel",
      "Watch for other surfers",
    ],
    takoffTips: [
      "Multiple takeoff zones",
      "Plenty of time to pop up",
      "Forgiving wave shape",
    ],
    ridingTechniques: [
      "Practice pop-up",
      "Work on paddling",
      "Learn basic turning",
      "Improve wave selection",
    ],
    safetyConsiderations: [
      "Shallow reef - wear reef booties",
      "Suitable for beginners",
      "Use a guide",
      "Watch for occasional strong current",
    ],
    marineLife: ["Small reef fish", "Parrotfish", "Grouper"],
    facilities: ["Local island", "Basic amenities", "Guides available"],
    bestMonths: ["March", "April", "May", "June", "July", "August", "September", "October"],
    crowdLevel: "Low",
    crowdDescription: "Low crowds perfect for learning",
    localKnowledge: [
      "Perfect for beginners",
      "Friendly atmosphere",
      "Good for skill development",
    ],
    equipmentRecommendations: ["Soft-top board", "Reef booties", "Leash", "Rash guard"],
    firstTimeVisitorTips: [
      "Perfect for beginners",
      "Practice your fundamentals",
      "Work on wave selection",
      "Take a lesson",
    ],
    advancedTechniques: [
      "Pop-up technique",
      "Paddling efficiency",
      "Wave selection",
      "Basic turning",
    ],
  },
};

export function getSurfingGuide(spotName: string): SurfingGuide | undefined {
  return surfingGuides[spotName];
}

export function getAllSurfingGuides(): SurfingGuide[] {
  return Object.values(surfingGuides);
}

export function getGuidesByDifficulty(
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): SurfingGuide[] {
  return Object.values(surfingGuides).filter((guide) => guide.difficulty === difficulty);
}
