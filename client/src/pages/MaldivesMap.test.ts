import { describe, it, expect } from "vitest";

// Test data validation
describe("MaldivesMap - Location Data", () => {
  const MALDIVES_LOCATIONS = [
    {
      id: 1,
      name: "Malé City",
      type: "Capital",
      lat: 4.1748,
      lng: 73.5082,
      description: "The capital city of Maldives, gateway to the islands",
      highlights: ["National Museum", "Grand Friday Mosque", "Local Markets"],
    },
    {
      id: 2,
      name: "North Malé Atoll",
      type: "Atoll",
      lat: 4.3,
      lng: 73.5,
      description: "Popular atoll with luxury resorts and pristine beaches",
      highlights: ["Crystal Clear Waters", "Coral Reefs", "Water Sports"],
    },
    {
      id: 3,
      name: "South Malé Atoll",
      type: "Atoll",
      lat: 3.9,
      lng: 73.5,
      description: "Serene atoll with exclusive resorts and calm lagoons",
      highlights: ["Luxury Resorts", "Calm Lagoons", "Diving Spots"],
    },
    {
      id: 4,
      name: "Ari Atoll",
      type: "Atoll",
      lat: 4.2,
      lng: 72.8,
      description: "Famous for manta rays and whale sharks",
      highlights: ["Manta Ray Spotting", "Whale Sharks", "House Reef Diving"],
    },
    {
      id: 5,
      name: "Baa Atoll",
      type: "Atoll",
      lat: 5.2,
      lng: 73.3,
      description: "UNESCO Biosphere Reserve with exceptional marine life",
      highlights: ["Hanifaru Bay", "Manta Rays", "Snorkeling"],
    },
    {
      id: 6,
      name: "Vaavu Atoll",
      type: "Atoll",
      lat: 3.6,
      lng: 73.0,
      description: "Pristine diving destination with minimal crowds",
      highlights: ["Pristine Reefs", "Wreck Diving", "Shark Encounters"],
    },
    {
      id: 7,
      name: "Meemu Atoll",
      type: "Atoll",
      lat: 3.2,
      lng: 72.9,
      description: "Tranquil atoll perfect for relaxation and diving",
      highlights: ["Quiet Beaches", "Excellent Diving", "Local Culture"],
    },
    {
      id: 8,
      name: "Addu Atoll",
      type: "Atoll",
      lat: 0.6,
      lng: 73.2,
      description: "Southernmost atoll with unique history and charm",
      highlights: ["Historical Sites", "Beautiful Lagoons", "Local Islands"],
    },
    {
      id: 9,
      name: "Thiladhunmathi Atoll",
      type: "Atoll",
      lat: 6.0,
      lng: 73.2,
      description: "Northern atoll with exclusive resorts and pristine reefs",
      highlights: ["Exclusive Resorts", "Pristine Reefs", "Water Activities"],
    },
    {
      id: 10,
      name: "Haa Alifu Atoll",
      type: "Atoll",
      lat: 6.8,
      lng: 73.0,
      description: "Northernmost atoll with untouched beauty",
      highlights: ["Untouched Beaches", "Rare Marine Life", "Adventure"],
    },
  ];

  it("should have exactly 10 locations", () => {
    expect(MALDIVES_LOCATIONS).toHaveLength(10);
  });

  it("should have unique IDs for all locations", () => {
    const ids = MALDIVES_LOCATIONS.map((loc) => loc.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(MALDIVES_LOCATIONS.length);
  });

  it("should have valid coordinates for all locations", () => {
    MALDIVES_LOCATIONS.forEach((location) => {
      expect(location.lat).toBeGreaterThanOrEqual(0);
      expect(location.lat).toBeLessThanOrEqual(7);
      expect(location.lng).toBeGreaterThanOrEqual(72);
      expect(location.lng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all locations", () => {
    MALDIVES_LOCATIONS.forEach((location) => {
      expect(location.id).toBeDefined();
      expect(location.name).toBeDefined();
      expect(location.type).toBeDefined();
      expect(location.lat).toBeDefined();
      expect(location.lng).toBeDefined();
      expect(location.description).toBeDefined();
      expect(location.highlights).toBeDefined();
    });
  });

  it("should have at least 2 highlights for each location", () => {
    MALDIVES_LOCATIONS.forEach((location) => {
      expect(location.highlights.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have non-empty names and descriptions", () => {
    MALDIVES_LOCATIONS.forEach((location) => {
      expect(location.name.length).toBeGreaterThan(0);
      expect(location.description.length).toBeGreaterThan(0);
    });
  });

  it("should have proper location types", () => {
    const validTypes = ["Capital", "Atoll"];
    MALDIVES_LOCATIONS.forEach((location) => {
      expect(validTypes).toContain(location.type);
    });
  });

  it("should have Malé City as the capital", () => {
    const maleCity = MALDIVES_LOCATIONS.find((loc) => loc.id === 1);
    expect(maleCity?.name).toBe("Malé City");
    expect(maleCity?.type).toBe("Capital");
  });

  it("should have 9 atolls", () => {
    const atolls = MALDIVES_LOCATIONS.filter((loc) => loc.type === "Atoll");
    expect(atolls).toHaveLength(9);
  });

  it("should cover the geographic range of Maldives", () => {
    const lats = MALDIVES_LOCATIONS.map((loc) => loc.lat);
    const lngs = MALDIVES_LOCATIONS.map((loc) => loc.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Maldives spans from about 0°S to 7°N and 72°E to 74°E
    expect(minLat).toBeLessThan(2);
    expect(maxLat).toBeGreaterThan(5);
    expect(minLng).toBeGreaterThanOrEqual(72);
    expect(maxLng).toBeLessThanOrEqual(74);
  });

  it("should have Addu Atoll as the southernmost location", () => {
    const adduAtoll = MALDIVES_LOCATIONS.find((loc) => loc.id === 8);
    const minLat = Math.min(...MALDIVES_LOCATIONS.map((loc) => loc.lat));
    expect(adduAtoll?.lat).toBe(minLat);
  });

  it("should have Haa Alifu Atoll as the northernmost location", () => {
    const haaAlifu = MALDIVES_LOCATIONS.find((loc) => loc.id === 10);
    const maxLat = Math.max(...MALDIVES_LOCATIONS.map((loc) => loc.lat));
    expect(haaAlifu?.lat).toBe(maxLat);
  });
});

// Test search and filtering logic
describe("MaldivesMap - Search Functionality", () => {
  const MALDIVES_LOCATIONS = [
    {
      id: 1,
      name: "Malé City",
      type: "Capital",
      lat: 4.1748,
      lng: 73.5082,
      description: "The capital city of Maldives, gateway to the islands",
      highlights: ["National Museum", "Grand Friday Mosque", "Local Markets"],
    },
    {
      id: 2,
      name: "North Malé Atoll",
      type: "Atoll",
      lat: 4.3,
      lng: 73.5,
      description: "Popular atoll with luxury resorts and pristine beaches",
      highlights: ["Crystal Clear Waters", "Coral Reefs", "Water Sports"],
    },
    {
      id: 4,
      name: "Ari Atoll",
      type: "Atoll",
      lat: 4.2,
      lng: 72.8,
      description: "Famous for manta rays and whale sharks",
      highlights: ["Manta Ray Spotting", "Whale Sharks", "House Reef Diving"],
    },
  ];

  it("should filter locations by name", () => {
    const searchTerm = "Malé";
    const filtered = MALDIVES_LOCATIONS.filter((location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered).toHaveLength(2);
    expect(filtered[0].name).toBe("Malé City");
    expect(filtered[1].name).toBe("North Malé Atoll");
  });

  it("should filter locations by description keywords", () => {
    const searchTerm = "manta";
    const filtered = MALDIVES_LOCATIONS.filter((location) =>
      location.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(4);
  });

  it("should be case-insensitive", () => {
    const searchTerm = "ATOLL";
    const filtered = MALDIVES_LOCATIONS.filter((location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should return all locations with empty search term", () => {
    const searchTerm = "";
    const filtered = MALDIVES_LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered).toHaveLength(MALDIVES_LOCATIONS.length);
  });

  it("should return empty array for non-matching search", () => {
    const searchTerm = "nonexistent";
    const filtered = MALDIVES_LOCATIONS.filter((location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered).toHaveLength(0);
  });
});
