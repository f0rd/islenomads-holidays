import { describe, it, expect } from "vitest";

// Popular Islands Data
const POPULAR_ISLANDS = [
  {
    id: "island-1",
    name: "Maafushi Island",
    type: "Island",
    lat: 4.25,
    lng: 73.42,
    category: "Local Island",
    description: "Popular local island with budget-friendly guesthouses and vibrant culture",
    highlights: ["Local Atmosphere", "Budget Friendly", "Beach Bars", "Water Sports"],
    population: "~2000",
    rating: 4.4,
  },
  {
    id: "island-2",
    name: "Thoddoo Island",
    type: "Island",
    lat: 5.3,
    lng: 73.4,
    category: "Local Island",
    description: "Authentic local island known for agriculture and traditional culture",
    highlights: ["Watermelon Farms", "Local Markets", "Fishing Village", "Authentic Experience"],
    population: "~1500",
    rating: 4.3,
  },
  {
    id: "island-3",
    name: "Guraidhoo Island",
    type: "Island",
    lat: 3.95,
    lng: 73.52,
    category: "Local Island",
    description: "Charming local island with excellent house reefs and friendly locals",
    highlights: ["House Reef Diving", "Local Restaurants", "Fishing Culture", "Peaceful"],
    population: "~800",
    rating: 4.5,
  },
  {
    id: "island-4",
    name: "Thulusdhoo Island",
    type: "Island",
    lat: 4.35,
    lng: 73.55,
    category: "Local Island",
    description: "Laid-back island famous for surfing and relaxed beach culture",
    highlights: ["Surf Breaks", "Beach Vibes", "Local Cafes", "Yoga Retreats"],
    population: "~1200",
    rating: 4.6,
  },
  {
    id: "island-5",
    name: "Kandooma Island",
    type: "Island",
    lat: 3.88,
    lng: 73.52,
    category: "Local Island",
    description: "Scenic island with beautiful beaches and excellent diving spots",
    highlights: ["Scenic Beaches", "Dive Sites", "Snorkeling", "Island Hopping"],
    population: "~600",
    rating: 4.4,
  },
];

// Luxury Resorts Data
const LUXURY_RESORTS = [
  {
    id: "resort-1",
    name: "Soneva Jani",
    type: "Resort",
    lat: 4.25,
    lng: 73.35,
    category: "Ultra-Luxury",
    price: "$$$$$",
    description: "Iconic ultra-luxury resort with glass villas and private pools",
    amenities: ["Glass Villas", "Underwater Spa", "Private Pool", "Michelin-starred Dining"],
    rating: 4.9,
    pricePerNight: "$1500+",
  },
  {
    id: "resort-2",
    name: "The Muraka",
    type: "Resort",
    lat: 4.28,
    lng: 73.38,
    category: "Ultra-Luxury",
    price: "$$$$$",
    description: "Exclusive underwater villa experience with panoramic ocean views",
    amenities: ["Underwater Bedroom", "Private Yacht", "Infinity Pool", "Fine Dining"],
    rating: 4.9,
    pricePerNight: "$1800+",
  },
  {
    id: "resort-3",
    name: "Baros Maldives",
    type: "Resort",
    lat: 4.32,
    lng: 73.48,
    category: "Luxury",
    price: "$$$$",
    description: "Elegant luxury resort with pristine beaches and world-class diving",
    amenities: ["Overwater Villas", "Spa", "Fine Dining", "Diving Center"],
    rating: 4.8,
    pricePerNight: "$800-1200",
  },
  {
    id: "resort-4",
    name: "Angsana Ihuru",
    type: "Resort",
    lat: 4.35,
    lng: 73.52,
    category: "Mid-Range",
    price: "$$$",
    description: "Comfortable mid-range resort with excellent value and friendly service",
    amenities: ["Beach Villas", "Restaurant", "Snorkeling", "Water Sports"],
    rating: 4.5,
    pricePerNight: "$400-600",
  },
  {
    id: "resort-5",
    name: "Adaaran Select Meedhupparu",
    type: "Resort",
    lat: 5.15,
    lng: 73.28,
    category: "Luxury",
    price: "$$$$",
    description: "All-inclusive luxury resort in Baa Atoll with exceptional diving",
    amenities: ["All-Inclusive", "House Reef", "Spa", "Diving Packages"],
    rating: 4.7,
    pricePerNight: "$600-900",
  },
  {
    id: "resort-6",
    name: "Vakaaru Island Resort",
    type: "Resort",
    lat: 3.92,
    lng: 73.45,
    category: "Mid-Range",
    price: "$$$",
    description: "Boutique resort with personalized service and intimate atmosphere",
    amenities: ["Beach Villas", "Spa", "Restaurant", "Water Activities"],
    rating: 4.6,
    pricePerNight: "$500-700",
  },
  {
    id: "resort-7",
    name: "Kurumba Maldives",
    type: "Resort",
    lat: 4.38,
    lng: 73.52,
    category: "Luxury",
    price: "$$$$",
    description: "Iconic resort close to Malé with excellent facilities and service",
    amenities: ["Overwater Villas", "Spa", "Multiple Restaurants", "Watersports"],
    rating: 4.7,
    pricePerNight: "$700-1000",
  },
  {
    id: "resort-8",
    name: "Coco Bodu Hithi",
    type: "Resort",
    lat: 4.42,
    lng: 73.55,
    category: "Luxury",
    price: "$$$$",
    description: "Stylish luxury resort with contemporary design and excellent dining",
    amenities: ["Modern Villas", "Spa", "Fine Dining", "Diving"],
    rating: 4.8,
    pricePerNight: "$900-1300",
  },
];

describe("Popular Islands - Data Validation", () => {
  it("should have exactly 5 popular islands", () => {
    expect(POPULAR_ISLANDS).toHaveLength(5);
  });

  it("should have unique IDs for all islands", () => {
    const ids = POPULAR_ISLANDS.map((island) => island.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(POPULAR_ISLANDS.length);
  });

  it("should have valid coordinates for all islands", () => {
    POPULAR_ISLANDS.forEach((island) => {
      expect(island.lat).toBeGreaterThanOrEqual(0);
      expect(island.lat).toBeLessThanOrEqual(7);
      expect(island.lng).toBeGreaterThanOrEqual(72);
      expect(island.lng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all islands", () => {
    POPULAR_ISLANDS.forEach((island) => {
      expect(island.id).toBeDefined();
      expect(island.name).toBeDefined();
      expect(island.type).toBe("Island");
      expect(island.lat).toBeDefined();
      expect(island.lng).toBeDefined();
      expect(island.category).toBeDefined();
      expect(island.description).toBeDefined();
      expect(island.highlights).toBeDefined();
      expect(island.population).toBeDefined();
      expect(island.rating).toBeDefined();
    });
  });

  it("should have all islands as Local Islands", () => {
    POPULAR_ISLANDS.forEach((island) => {
      expect(island.category).toBe("Local Island");
    });
  });

  it("should have ratings between 4.0 and 5.0", () => {
    POPULAR_ISLANDS.forEach((island) => {
      expect(island.rating).toBeGreaterThanOrEqual(4.0);
      expect(island.rating).toBeLessThanOrEqual(5.0);
    });
  });

  it("should have at least 3 highlights per island", () => {
    POPULAR_ISLANDS.forEach((island) => {
      expect(island.highlights.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have Thulusdhoo as highest rated island", () => {
    const maxRating = Math.max(...POPULAR_ISLANDS.map((island) => island.rating));
    const thulusdhoo = POPULAR_ISLANDS.find((island) => island.id === "island-4");
    expect(thulusdhoo?.rating).toBe(maxRating);
  });

  it("should have population in proper format", () => {
    POPULAR_ISLANDS.forEach((island) => {
      expect(island.population).toMatch(/^~\d+$/);
    });
  });

  it("should have Kandooma as smallest island", () => {
    const minPopulation = Math.min(
      ...POPULAR_ISLANDS.map((island) => parseInt(island.population.replace("~", "")))
    );
    const kandooma = POPULAR_ISLANDS.find((island) => island.id === "island-5");
    expect(parseInt(kandooma!.population.replace("~", ""))).toBe(minPopulation);
  });
});

describe("Luxury Resorts - Data Validation", () => {
  it("should have exactly 8 luxury resorts", () => {
    expect(LUXURY_RESORTS).toHaveLength(8);
  });

  it("should have unique IDs for all resorts", () => {
    const ids = LUXURY_RESORTS.map((resort) => resort.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(LUXURY_RESORTS.length);
  });

  it("should have valid coordinates for all resorts", () => {
    LUXURY_RESORTS.forEach((resort) => {
      expect(resort.lat).toBeGreaterThanOrEqual(0);
      expect(resort.lat).toBeLessThanOrEqual(7);
      expect(resort.lng).toBeGreaterThanOrEqual(72);
      expect(resort.lng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all resorts", () => {
    LUXURY_RESORTS.forEach((resort) => {
      expect(resort.id).toBeDefined();
      expect(resort.name).toBeDefined();
      expect(resort.type).toBe("Resort");
      expect(resort.lat).toBeDefined();
      expect(resort.lng).toBeDefined();
      expect(resort.category).toBeDefined();
      expect(resort.price).toBeDefined();
      expect(resort.description).toBeDefined();
      expect(resort.amenities).toBeDefined();
      expect(resort.rating).toBeDefined();
      expect(resort.pricePerNight).toBeDefined();
    });
  });

  it("should have valid resort categories", () => {
    const validCategories = ["Ultra-Luxury", "Luxury", "Mid-Range"];
    LUXURY_RESORTS.forEach((resort) => {
      expect(validCategories).toContain(resort.category);
    });
  });

  it("should have ratings between 4.0 and 5.0", () => {
    LUXURY_RESORTS.forEach((resort) => {
      expect(resort.rating).toBeGreaterThanOrEqual(4.0);
      expect(resort.rating).toBeLessThanOrEqual(5.0);
    });
  });

  it("should have at least 3 amenities per resort", () => {
    LUXURY_RESORTS.forEach((resort) => {
      expect(resort.amenities.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have 2 Ultra-Luxury resorts", () => {
    const ultraLuxury = LUXURY_RESORTS.filter((resort) => resort.category === "Ultra-Luxury");
    expect(ultraLuxury).toHaveLength(2);
  });

  it("should have 4 Luxury resorts", () => {
    const luxury = LUXURY_RESORTS.filter((resort) => resort.category === "Luxury");
    expect(luxury).toHaveLength(4);
  });

  it("should have 2 Mid-Range resorts", () => {
    const midRange = LUXURY_RESORTS.filter((resort) => resort.category === "Mid-Range");
    expect(midRange).toHaveLength(2);
  });

  it("should have highest rated resorts at 4.9", () => {
    const maxRating = Math.max(...LUXURY_RESORTS.map((resort) => resort.rating));
    expect(maxRating).toBe(4.9);
  });

  it("should have Soneva Jani and The Muraka as highest rated", () => {
    const topResorts = LUXURY_RESORTS.filter((resort) => resort.rating === 4.9);
    expect(topResorts).toHaveLength(2);
    const names = topResorts.map((r) => r.name);
    expect(names).toContain("Soneva Jani");
    expect(names).toContain("The Muraka");
  });
});

describe("Islands & Resorts - Search Functionality", () => {
  it("should filter islands by name", () => {
    const searchTerm = "Island";
    const filtered = POPULAR_ISLANDS.filter((island) =>
      island.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter resorts by name", () => {
    const searchTerm = "Maldives";
    const filtered = LUXURY_RESORTS.filter((resort) =>
      resort.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter islands by description keywords", () => {
    const searchTerm = "diving";
    const filtered = POPULAR_ISLANDS.filter((island) =>
      island.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter resorts by category", () => {
    const filtered = LUXURY_RESORTS.filter((resort) => resort.category === "Ultra-Luxury");
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter resorts by amenities", () => {
    const filtered = LUXURY_RESORTS.filter((resort) =>
      resort.amenities.some((a) => a.toLowerCase().includes("spa"))
    );
    expect(filtered.length).toBeGreaterThan(0);
  });
});

describe("Islands & Resorts - Statistics", () => {
  it("should have total of 13 locations (5 islands + 8 resorts)", () => {
    const total = POPULAR_ISLANDS.length + LUXURY_RESORTS.length;
    expect(total).toBe(13);
  });

  it("should have more resorts than islands", () => {
    expect(LUXURY_RESORTS.length).toBeGreaterThan(POPULAR_ISLANDS.length);
  });

  it("should have average island rating above 4.3", () => {
    const avgRating = POPULAR_ISLANDS.reduce((sum, island) => sum + island.rating, 0) / POPULAR_ISLANDS.length;
    expect(avgRating).toBeGreaterThan(4.3);
  });

  it("should have average resort rating above 4.6", () => {
    const avgRating = LUXURY_RESORTS.reduce((sum, resort) => sum + resort.rating, 0) / LUXURY_RESORTS.length;
    expect(avgRating).toBeGreaterThan(4.6);
  });

  it("should have resorts with higher average rating than islands", () => {
    const islandAvg = POPULAR_ISLANDS.reduce((sum, island) => sum + island.rating, 0) / POPULAR_ISLANDS.length;
    const resortAvg = LUXURY_RESORTS.reduce((sum, resort) => sum + resort.rating, 0) / LUXURY_RESORTS.length;
    expect(resortAvg).toBeGreaterThan(islandAvg);
  });
});
