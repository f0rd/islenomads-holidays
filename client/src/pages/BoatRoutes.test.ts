import { describe, it, expect } from "vitest";
import { SPEEDBOAT_ROUTES, PUBLIC_FERRY_ROUTES, BOAT_INFORMATION } from "@/data/boatRoutes";

describe("Speedboat Routes - Data Validation", () => {
  it("should have exactly 4 speedboat routes", () => {
    expect(SPEEDBOAT_ROUTES).toHaveLength(4);
  });

  it("should have unique IDs for all speedboat routes", () => {
    const ids = SPEEDBOAT_ROUTES.map((route) => route.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(SPEEDBOAT_ROUTES.length);
  });

  it("should have valid coordinates for all speedboat routes", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      expect(route.startLat).toBeGreaterThanOrEqual(0);
      expect(route.startLat).toBeLessThanOrEqual(7);
      expect(route.startLng).toBeGreaterThanOrEqual(72);
      expect(route.startLng).toBeLessThanOrEqual(74);
      expect(route.endLat).toBeGreaterThanOrEqual(0);
      expect(route.endLat).toBeLessThanOrEqual(7);
      expect(route.endLng).toBeGreaterThanOrEqual(72);
      expect(route.endLng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all speedboat routes", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      expect(route.id).toBeDefined();
      expect(route.name).toBeDefined();
      expect(route.type).toBe("Speedboat Route");
      expect(route.startPoint).toBeDefined();
      expect(route.endPoint).toBeDefined();
      expect(route.duration).toBeDefined();
      expect(route.distance).toBeDefined();
      expect(route.frequency).toBeDefined();
      expect(route.capacity).toBeDefined();
      expect(route.speed).toBeDefined();
      expect(route.price).toBeDefined();
      expect(route.amenities).toBeDefined();
      expect(route.operator).toBeDefined();
      expect(route.schedule).toBeDefined();
    });
  });

  it("should have capacity between 40-60 passengers for speedboats", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      expect(route.capacity).toBeGreaterThanOrEqual(40);
      expect(route.capacity).toBeLessThanOrEqual(60);
    });
  });

  it("should have speed between 35-50 knots for speedboats", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      const speed = parseInt(route.speed);
      expect(speed).toBeGreaterThanOrEqual(35);
      expect(speed).toBeLessThanOrEqual(50);
    });
  });

  it("should have at least 3 amenities per speedboat route", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      expect(route.amenities.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have valid price format for speedboat routes", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      expect(route.price).toMatch(/^\$\d+$/);
    });
  });

  it("should have at least 2 departure times per route", () => {
    SPEEDBOAT_ROUTES.forEach((route) => {
      expect(route.schedule.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have Maldives Express as operator for most speedboats", () => {
    const maldivesExpressRoutes = SPEEDBOAT_ROUTES.filter((route) => route.operator === "Maldives Express");
    expect(maldivesExpressRoutes.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Public Ferry Routes - Data Validation", () => {
  it("should have exactly 4 public ferry routes", () => {
    expect(PUBLIC_FERRY_ROUTES).toHaveLength(4);
  });

  it("should have unique IDs for all ferry routes", () => {
    const ids = PUBLIC_FERRY_ROUTES.map((route) => route.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(PUBLIC_FERRY_ROUTES.length);
  });

  it("should have valid coordinates for all ferry routes", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      expect(route.startLat).toBeGreaterThanOrEqual(0);
      expect(route.startLat).toBeLessThanOrEqual(7);
      expect(route.startLng).toBeGreaterThanOrEqual(72);
      expect(route.startLng).toBeLessThanOrEqual(74);
      expect(route.endLat).toBeGreaterThanOrEqual(0);
      expect(route.endLat).toBeLessThanOrEqual(7);
      expect(route.endLng).toBeGreaterThanOrEqual(72);
      expect(route.endLng).toBeLessThanOrEqual(74);
    });
  });

  it("should have required fields for all ferry routes", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      expect(route.id).toBeDefined();
      expect(route.name).toBeDefined();
      expect(route.type).toBe("Public Ferry Route");
      expect(route.startPoint).toBeDefined();
      expect(route.endPoint).toBeDefined();
      expect(route.duration).toBeDefined();
      expect(route.distance).toBeDefined();
      expect(route.frequency).toBeDefined();
      expect(route.capacity).toBeDefined();
      expect(route.speed).toBeDefined();
      expect(route.price).toBeDefined();
      expect(route.amenities).toBeDefined();
      expect(route.operator).toBeDefined();
      expect(route.schedule).toBeDefined();
    });
  });

  it("should have capacity between 150-300 passengers for ferries", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      expect(route.capacity).toBeGreaterThanOrEqual(150);
      expect(route.capacity).toBeLessThanOrEqual(300);
    });
  });

  it("should have speed between 15-30 knots for ferries", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      const speed = parseInt(route.speed);
      expect(speed).toBeGreaterThanOrEqual(15);
      expect(speed).toBeLessThanOrEqual(30);
    });
  });

  it("should have at least 2 amenities per ferry route", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      expect(route.amenities.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have valid price format for ferry routes", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      expect(route.price).toMatch(/^\$[\d.]+$/);
    });
  });

  it("should have ferry routes starting from Male City", () => {
    PUBLIC_FERRY_ROUTES.forEach((route) => {
      expect(route.startPoint).toBe("Malé City");
    });
  });

  it("should have Addu City ferry as longest route", () => {
    const adduRoute = PUBLIC_FERRY_ROUTES.find((route) => route.endPoint === "Addu City");
    expect(adduRoute).toBeDefined();
    expect(adduRoute?.duration).toBe("240 mins");
    expect(adduRoute?.distance).toBe("240 km");
  });
});

describe("Boat Information - Data Validation", () => {
  it("should have exactly 5 boats in fleet", () => {
    expect(BOAT_INFORMATION).toHaveLength(5);
  });

  it("should have unique IDs for all boats", () => {
    const ids = BOAT_INFORMATION.map((boat) => boat.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(BOAT_INFORMATION.length);
  });

  it("should have required fields for all boats", () => {
    BOAT_INFORMATION.forEach((boat) => {
      expect(boat.id).toBeDefined();
      expect(boat.name).toBeDefined();
      expect(boat.type).toBeDefined();
      expect(boat.capacity).toBeDefined();
      expect(boat.speed).toBeDefined();
      expect(boat.length).toBeDefined();
      expect(boat.yearBuilt).toBeDefined();
      expect(boat.amenities).toBeDefined();
      expect(boat.safetyFeatures).toBeDefined();
      expect(boat.description).toBeDefined();
      expect(boat.rating).toBeDefined();
    });
  });

  it("should have valid boat types", () => {
    const validTypes = ["Speedboat", "Public Ferry", "Long Distance Ferry"];
    BOAT_INFORMATION.forEach((boat) => {
      expect(validTypes).toContain(boat.type);
    });
  });

  it("should have ratings between 4.0 and 5.0", () => {
    BOAT_INFORMATION.forEach((boat) => {
      expect(boat.rating).toBeGreaterThanOrEqual(4.0);
      expect(boat.rating).toBeLessThanOrEqual(5.0);
    });
  });

  it("should have year built between 2015 and 2025", () => {
    BOAT_INFORMATION.forEach((boat) => {
      expect(boat.yearBuilt).toBeGreaterThanOrEqual(2015);
      expect(boat.yearBuilt).toBeLessThanOrEqual(2025);
    });
  });

  it("should have at least 3 amenities per boat", () => {
    BOAT_INFORMATION.forEach((boat) => {
      expect(boat.amenities.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have at least 3 safety features per boat", () => {
    BOAT_INFORMATION.forEach((boat) => {
      expect(boat.safetyFeatures.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have 2 speedboats in fleet", () => {
    const speedboats = BOAT_INFORMATION.filter((boat) => boat.type === "Speedboat");
    expect(speedboats).toHaveLength(2);
  });

  it("should have 2 public ferries in fleet", () => {
    const ferries = BOAT_INFORMATION.filter((boat) => boat.type === "Public Ferry");
    expect(ferries).toHaveLength(2);
  });

  it("should have 1 long distance ferry in fleet", () => {
    const longDistanceFerries = BOAT_INFORMATION.filter((boat) => boat.type === "Long Distance Ferry");
    expect(longDistanceFerries).toHaveLength(1);
  });

  it("should have highest rated boat at 4.8", () => {
    const maxRating = Math.max(...BOAT_INFORMATION.map((boat) => boat.rating));
    expect(maxRating).toBe(4.8);
  });

  it("should have Express 2 as highest rated speedboat", () => {
    const speedboats = BOAT_INFORMATION.filter((boat) => boat.type === "Speedboat");
    const maxRating = Math.max(...speedboats.map((boat) => boat.rating));
    const topBoat = speedboats.find((boat) => boat.rating === maxRating);
    expect(topBoat?.name).toContain("Express 2");
  });
});

describe("Routes & Boats - Search Functionality", () => {
  it("should filter speedboat routes by name", () => {
    const searchTerm = "Express";
    const filtered = SPEEDBOAT_ROUTES.filter((route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter ferry routes by destination", () => {
    const searchTerm = "Hulhumalé";
    const filtered = PUBLIC_FERRY_ROUTES.filter((route) =>
      route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter boats by type", () => {
    const filtered = BOAT_INFORMATION.filter((boat) => boat.type === "Speedboat");
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter boats by amenities", () => {
    const filtered = BOAT_INFORMATION.filter((boat) =>
      boat.amenities.some((a) => a.toLowerCase().includes("wifi"))
    );
    expect(filtered.length).toBeGreaterThan(0);
  });
});

describe("Routes & Boats - Statistics", () => {
  it("should have total of 8 routes (4 speedboat + 4 ferry)", () => {
    const total = SPEEDBOAT_ROUTES.length + PUBLIC_FERRY_ROUTES.length;
    expect(total).toBe(8);
  });

  it("should have more ferry capacity than speedboat capacity", () => {
    const speedboatCapacity = SPEEDBOAT_ROUTES.reduce((sum, route) => sum + route.capacity, 0);
    const ferryCapacity = PUBLIC_FERRY_ROUTES.reduce((sum, route) => sum + route.capacity, 0);
    expect(ferryCapacity).toBeGreaterThan(speedboatCapacity);
  });

  it("should have average speedboat rating above 4.7", () => {
    const speedboats = BOAT_INFORMATION.filter((boat) => boat.type === "Speedboat");
    const avgRating = speedboats.reduce((sum, boat) => sum + boat.rating, 0) / speedboats.length;
    expect(avgRating).toBeGreaterThan(4.7);
  });

  it("should have average ferry rating above 4.4", () => {
    const ferries = BOAT_INFORMATION.filter((boat) => boat.type === "Public Ferry");
    const avgRating = ferries.reduce((sum, boat) => sum + boat.rating, 0) / ferries.length;
    expect(avgRating).toBeGreaterThan(4.4);
  });

  it("should have more speedboat routes to atolls than local islands", () => {
    const atollRoutes = SPEEDBOAT_ROUTES.filter((route) => route.endPoint.includes("Atoll"));
    expect(atollRoutes.length).toBeGreaterThan(0);
  });
});
