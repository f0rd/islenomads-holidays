import { describe, it, expect } from "vitest";

// Dive Points Data
const DIVE_POINTS = [
  {
    id: "dive-1",
    name: "Banana Reef",
    type: "Dive Point",
    lat: 4.25,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "5-30m",
    description: "Iconic reef with excellent coral formations and tropical fish",
    highlights: ["Coral Gardens", "Reef Sharks", "Groupers"],
    rating: 4.8,
  },
  {
    id: "dive-2",
    name: "Maaya Thila",
    type: "Dive Point",
    lat: 4.28,
    lng: 73.48,
    difficulty: "Advanced",
    depth: "10-40m",
    description: "Dramatic underwater mountain with strong currents and large pelagics",
    highlights: ["Pelagic Fish", "Sharks", "Eagle Rays"],
    rating: 4.9,
  },
  {
    id: "dive-3",
    name: "Miyaru Kandu",
    type: "Dive Point",
    lat: 4.35,
    lng: 73.45,
    difficulty: "Advanced",
    depth: "15-40m",
    description: "Channel dive with strong currents and abundant marine life",
    highlights: ["Manta Rays", "Snappers", "Trevally"],
    rating: 4.7,
  },
  {
    id: "dive-4",
    name: "Hanifaru Bay",
    type: "Dive Point",
    lat: 5.25,
    lng: 73.32,
    difficulty: "Beginner",
    depth: "3-20m",
    description: "UNESCO site famous for manta ray aggregations",
    highlights: ["Manta Rays", "Whale Sharks", "Snorkeling"],
    rating: 4.9,
  },
  {
    id: "dive-5",
    name: "Fotteyo Kandu",
    type: "Dive Point",
    lat: 4.18,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "8-35m",
    description: "Channel with excellent visibility and diverse marine life",
    highlights: ["Reef Fish", "Rays", "Octopus"],
    rating: 4.6,
  },
  {
    id: "dive-6",
    name: "Okobe Thila",
    type: "Dive Point",
    lat: 3.95,
    lng: 73.48,
    difficulty: "Intermediate",
    depth: "12-30m",
    description: "Beautiful thila with colorful corals and schooling fish",
    highlights: ["Coral Formations", "Schooling Fish", "Turtles"],
    rating: 4.5,
  },
  {
    id: "dive-7",
    name: "Vaavu Wreck",
    type: "Dive Point",
    lat: 3.6,
    lng: 73.0,
    difficulty: "Advanced",
    depth: "20-40m",
    description: "Wreck dive with historical significance and marine life",
    highlights: ["Wreck Exploration", "Groupers", "Snappers"],
    rating: 4.4,
  },
  {
    id: "dive-8",
    name: "Kandooma Thila",
    type: "Dive Point",
    lat: 3.88,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "10-35m",
    description: "Popular thila with excellent coral and abundant fish",
    highlights: ["Coral Reefs", "Reef Sharks", "Jacks"],
    rating: 4.7,
  },
];

// Surf Spots Data
const SURF_SPOTS = [
  {
    id: "surf-1",
    name: "Pasta Point",
    type: "Surf Spot",
    lat: 4.15,
    lng: 73.45,
    difficulty: "Intermediate",
    waveHeight: "2-6ft",
    description: "Consistent reef break with long rides and friendly atmosphere",
    highlights: ["Consistent Waves", "Right Hander", "Reef Break"],
    rating: 4.6,
  },
  {
    id: "surf-2",
    name: "Chickens",
    type: "Surf Spot",
    lat: 4.12,
    lng: 73.42,
    difficulty: "Beginner",
    waveHeight: "1-4ft",
    description: "Mellow beach break perfect for beginners and learning",
    highlights: ["Beach Break", "Beginner Friendly", "Sandy Bottom"],
    rating: 4.3,
  },
  {
    id: "surf-3",
    name: "Riptide",
    type: "Surf Spot",
    lat: 4.18,
    lng: 73.48,
    difficulty: "Advanced",
    waveHeight: "3-8ft",
    description: "Powerful reef break with challenging conditions",
    highlights: ["Powerful Waves", "Reef Break", "Left Hander"],
    rating: 4.5,
  },
  {
    id: "surf-4",
    name: "Thalapathi",
    type: "Surf Spot",
    lat: 4.22,
    lng: 73.55,
    difficulty: "Intermediate",
    waveHeight: "2-5ft",
    description: "Consistent point break with smooth waves",
    highlights: ["Point Break", "Long Rides", "Scenic"],
    rating: 4.4,
  },
  {
    id: "surf-5",
    name: "Jailbreaks",
    type: "Surf Spot",
    lat: 4.08,
    lng: 73.38,
    difficulty: "Advanced",
    waveHeight: "3-7ft",
    description: "Challenging reef break with fast walls",
    highlights: ["Reef Break", "Fast Walls", "Barrels"],
    rating: 4.7,
  },
  {
    id: "surf-6",
    name: "Honky's",
    type: "Surf Spot",
    lat: 4.05,
    lng: 73.35,
    difficulty: "Intermediate",
    waveHeight: "2-6ft",
    description: "Fun reef break with multiple peaks",
    highlights: ["Multiple Peaks", "Reef Break", "Fun Waves"],
    rating: 4.5,
  },
];

describe("Dive Points - Data Validation", () => {
  it("should have exactly 8 dive points", () => {
    expect(DIVE_POINTS).toHaveLength(8);
  });

  it("should have unique IDs for all dive points", () => {
    const ids = DIVE_POINTS.map((dive) => dive.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(DIVE_POINTS.length);
  });

  it("should have valid coordinates for all dive points", () => {
    DIVE_POINTS.forEach((dive) => {
      expect(dive.lat).toBeGreaterThanOrEqual(0);
      expect(dive.lat).toBeLessThanOrEqual(7);
      expect(dive.lng).toBeGreaterThanOrEqual(72);
      expect(dive.lng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all dive points", () => {
    DIVE_POINTS.forEach((dive) => {
      expect(dive.id).toBeDefined();
      expect(dive.name).toBeDefined();
      expect(dive.type).toBe("Dive Point");
      expect(dive.lat).toBeDefined();
      expect(dive.lng).toBeDefined();
      expect(dive.difficulty).toBeDefined();
      expect(dive.depth).toBeDefined();
      expect(dive.description).toBeDefined();
      expect(dive.highlights).toBeDefined();
      expect(dive.rating).toBeDefined();
    });
  });

  it("should have valid difficulty levels", () => {
    const validDifficulties = ["Beginner", "Intermediate", "Advanced"];
    DIVE_POINTS.forEach((dive) => {
      expect(validDifficulties).toContain(dive.difficulty);
    });
  });

  it("should have ratings between 4.0 and 5.0", () => {
    DIVE_POINTS.forEach((dive) => {
      expect(dive.rating).toBeGreaterThanOrEqual(4.0);
      expect(dive.rating).toBeLessThanOrEqual(5.0);
    });
  });

  it("should have at least 2 highlights per dive point", () => {
    DIVE_POINTS.forEach((dive) => {
      expect(dive.highlights.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have Hanifaru Bay as beginner dive point", () => {
    const hanifaru = DIVE_POINTS.find((dive) => dive.id === "dive-4");
    expect(hanifaru?.name).toBe("Hanifaru Bay");
    expect(hanifaru?.difficulty).toBe("Beginner");
    expect(hanifaru?.rating).toBe(4.9);
  });

  it("should have highest rated dive point at 4.9", () => {
    const maxRating = Math.max(...DIVE_POINTS.map((dive) => dive.rating));
    expect(maxRating).toBe(4.9);
  });

  it("should have depth ranges in proper format", () => {
    DIVE_POINTS.forEach((dive) => {
      expect(dive.depth).toMatch(/^\d+-\d+m$/);
    });
  });
});

describe("Surf Spots - Data Validation", () => {
  it("should have exactly 6 surf spots", () => {
    expect(SURF_SPOTS).toHaveLength(6);
  });

  it("should have unique IDs for all surf spots", () => {
    const ids = SURF_SPOTS.map((surf) => surf.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(SURF_SPOTS.length);
  });

  it("should have valid coordinates for all surf spots", () => {
    SURF_SPOTS.forEach((surf) => {
      expect(surf.lat).toBeGreaterThanOrEqual(0);
      expect(surf.lat).toBeLessThanOrEqual(7);
      expect(surf.lng).toBeGreaterThanOrEqual(72);
      expect(surf.lng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all surf spots", () => {
    SURF_SPOTS.forEach((surf) => {
      expect(surf.id).toBeDefined();
      expect(surf.name).toBeDefined();
      expect(surf.type).toBe("Surf Spot");
      expect(surf.lat).toBeDefined();
      expect(surf.lng).toBeDefined();
      expect(surf.difficulty).toBeDefined();
      expect(surf.waveHeight).toBeDefined();
      expect(surf.description).toBeDefined();
      expect(surf.highlights).toBeDefined();
      expect(surf.rating).toBeDefined();
    });
  });

  it("should have valid difficulty levels", () => {
    const validDifficulties = ["Beginner", "Intermediate", "Advanced"];
    SURF_SPOTS.forEach((surf) => {
      expect(validDifficulties).toContain(surf.difficulty);
    });
  });

  it("should have ratings between 4.0 and 5.0", () => {
    SURF_SPOTS.forEach((surf) => {
      expect(surf.rating).toBeGreaterThanOrEqual(4.0);
      expect(surf.rating).toBeLessThanOrEqual(5.0);
    });
  });

  it("should have at least 2 highlights per surf spot", () => {
    SURF_SPOTS.forEach((surf) => {
      expect(surf.highlights.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have Chickens as beginner surf spot", () => {
    const chickens = SURF_SPOTS.find((surf) => surf.id === "surf-2");
    expect(chickens?.name).toBe("Chickens");
    expect(chickens?.difficulty).toBe("Beginner");
  });

  it("should have wave height ranges in proper format", () => {
    SURF_SPOTS.forEach((surf) => {
      expect(surf.waveHeight).toMatch(/^\d+-\d+ft$/);
    });
  });

  it("should have highest rated surf spot at 4.7", () => {
    const maxRating = Math.max(...SURF_SPOTS.map((surf) => surf.rating));
    expect(maxRating).toBe(4.7);
  });
});

describe("Activity Markers - Search Functionality", () => {
  it("should filter dive points by name", () => {
    const searchTerm = "Reef";
    const filtered = DIVE_POINTS.filter((dive) =>
      dive.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter surf spots by difficulty", () => {
    const filtered = SURF_SPOTS.filter((surf) => surf.difficulty === "Beginner");
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter dive points by difficulty level", () => {
    const advanced = DIVE_POINTS.filter((dive) => dive.difficulty === "Advanced");
    expect(advanced.length).toBeGreaterThan(0);
    expect(advanced.length).toBeLessThan(DIVE_POINTS.length);
  });

  it("should find dive points by description keywords", () => {
    const searchTerm = "manta";
    const filtered = DIVE_POINTS.filter((dive) =>
      dive.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should find surf spots by wave conditions", () => {
    const filtered = SURF_SPOTS.filter((surf) => surf.waveHeight.includes("6"));
    expect(filtered.length).toBeGreaterThan(0);
  });
});

describe("Activity Markers - Statistics", () => {
  it("should have total of 14 activity markers (8 dives + 6 surfs)", () => {
    const total = DIVE_POINTS.length + SURF_SPOTS.length;
    expect(total).toBe(14);
  });

  it("should have more dive points than surf spots", () => {
    expect(DIVE_POINTS.length).toBeGreaterThan(SURF_SPOTS.length);
  });

  it("should have average dive rating above 4.5", () => {
    const avgRating = DIVE_POINTS.reduce((sum, dive) => sum + dive.rating, 0) / DIVE_POINTS.length;
    expect(avgRating).toBeGreaterThan(4.5);
  });

  it("should have average surf rating above 4.4", () => {
    const avgRating = SURF_SPOTS.reduce((sum, surf) => sum + surf.rating, 0) / SURF_SPOTS.length;
    expect(avgRating).toBeGreaterThan(4.4);
  });

  it("should have diverse difficulty distribution", () => {
    const allActivities = [...DIVE_POINTS, ...SURF_SPOTS];
    const difficulties = new Set(allActivities.map((a) => a.difficulty));
    expect(difficulties.size).toBeGreaterThanOrEqual(2);
  });
});
