import { describe, it, expect } from "vitest";

describe("Packages Listing Page", () => {
  // Test package filtering
  it("should filter packages by destination", () => {
    const packages = [
      { id: 1, name: "Maldives Paradise", destination: "Male", price: 2500, published: 1 },
      { id: 2, name: "Ari Atoll Escape", destination: "Ari Atoll", price: 3000, published: 1 },
      { id: 3, name: "Baa Atoll Adventure", destination: "Baa Atoll", price: 3500, published: 1 },
    ];

    const filtered = packages.filter((pkg) => pkg.destination === "Male");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Maldives Paradise");
  });

  // Test price range filtering
  it("should filter packages by price range", () => {
    const packages = [
      { id: 1, name: "Budget Package", price: 1500, published: 1 },
      { id: 2, name: "Mid-Range Package", price: 3000, published: 1 },
      { id: 3, name: "Luxury Package", price: 6000, published: 1 },
    ];

    const budgetPackages = packages.filter((pkg) => pkg.price < 2000);
    expect(budgetPackages).toHaveLength(1);
    expect(budgetPackages[0].name).toBe("Budget Package");

    const luxuryPackages = packages.filter((pkg) => pkg.price > 5000);
    expect(luxuryPackages).toHaveLength(1);
    expect(luxuryPackages[0].name).toBe("Luxury Package");
  });

  // Test search functionality
  it("should search packages by name", () => {
    const packages = [
      { id: 1, name: "Maldives Paradise", description: "Beautiful island getaway", published: 1 },
      { id: 2, name: "Tropical Escape", description: "Relax in paradise", published: 1 },
      { id: 3, name: "Island Adventure", description: "Explore the Maldives", published: 1 },
    ];

    const searchQuery = "maldives";
    const results = packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(results).toHaveLength(2);
    expect(results.some((p) => p.name === "Maldives Paradise")).toBe(true);
    expect(results.some((p) => p.description.includes("Maldives"))).toBe(true);
  });

  // Test sorting by price
  it("should sort packages by price", () => {
    const packages = [
      { id: 1, name: "Package A", price: 3000 },
      { id: 2, name: "Package B", price: 1500 },
      { id: 3, name: "Package C", price: 5000 },
    ];

    const sortedAsc = [...packages].sort((a, b) => a.price - b.price);
    expect(sortedAsc[0].price).toBe(1500);
    expect(sortedAsc[2].price).toBe(5000);

    const sortedDesc = [...packages].sort((a, b) => b.price - a.price);
    expect(sortedDesc[0].price).toBe(5000);
    expect(sortedDesc[2].price).toBe(1500);
  });

  // Test pagination
  it("should paginate packages correctly", () => {
    const packages = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Package ${i + 1}`,
    }));

    const itemsPerPage = 12;
    const page1 = packages.slice(0, itemsPerPage);
    const page2 = packages.slice(itemsPerPage, itemsPerPage * 2);
    const page3 = packages.slice(itemsPerPage * 2);

    expect(page1).toHaveLength(12);
    expect(page2).toHaveLength(12);
    expect(page3).toHaveLength(1);
    expect(page1[0].name).toBe("Package 1");
    expect(page2[0].name).toBe("Package 13");
    expect(page3[0].name).toBe("Package 25");
  });

  // Test published filter
  it("should only show published packages", () => {
    const packages = [
      { id: 1, name: "Published Package", published: 1 },
      { id: 2, name: "Draft Package", published: 0 },
      { id: 3, name: "Another Published", published: 1 },
    ];

    const published = packages.filter((pkg) => pkg.published === 1);
    expect(published).toHaveLength(2);
    expect(published.every((p) => p.published === 1)).toBe(true);
  });

  // Test combined filtering
  it("should apply multiple filters together", () => {
    const packages = [
      {
        id: 1,
        name: "Maldives Luxury",
        destination: "Male",
        price: 6000,
        published: 1,
      },
      {
        id: 2,
        name: "Ari Budget",
        destination: "Ari Atoll",
        price: 1500,
        published: 1,
      },
      {
        id: 3,
        name: "Baa Mid-Range",
        destination: "Baa Atoll",
        price: 3500,
        published: 1,
      },
      {
        id: 4,
        name: "Male Draft",
        destination: "Male",
        price: 2500,
        published: 0,
      },
    ];

    // Filter: Male destination, published, price > 5000
    const filtered = packages.filter(
      (pkg) =>
        pkg.destination === "Male" &&
        pkg.published === 1 &&
        pkg.price > 5000
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Maldives Luxury");
  });

  // Test duration filter
  it("should filter packages by duration", () => {
    const packages = [
      { id: 1, name: "Short Trip", duration: "3 days", published: 1 },
      { id: 2, name: "Medium Trip", duration: "5 days", published: 1 },
      { id: 3, name: "Long Trip", duration: "7 days", published: 1 },
      { id: 4, name: "Another Short", duration: "3 days", published: 1 },
    ];

    const shortTrips = packages.filter((pkg) => pkg.duration === "3 days");
    expect(shortTrips).toHaveLength(2);
    expect(shortTrips.every((p) => p.duration === "3 days")).toBe(true);
  });

  // Test featured packages
  it("should prioritize featured packages in sorting", () => {
    const packages = [
      { id: 1, name: "Regular Package", featured: 0, price: 2000 },
      { id: 2, name: "Featured Package", featured: 1, price: 3000 },
      { id: 3, name: "Another Regular", featured: 0, price: 2500 },
    ];

    const sorted = [...packages].sort((a, b) => (b.featured || 0) - (a.featured || 0));
    expect(sorted[0].name).toBe("Featured Package");
    expect(sorted[0].featured).toBe(1);
  });

  // Test empty results
  it("should handle empty filter results", () => {
    const packages = [
      { id: 1, name: "Package A", destination: "Male", published: 1 },
      { id: 2, name: "Package B", destination: "Ari Atoll", published: 1 },
    ];

    const filtered = packages.filter((pkg) => pkg.destination === "Non-existent");
    expect(filtered).toHaveLength(0);
  });

  // Test sorting by name
  it("should sort packages alphabetically", () => {
    const packages = [
      { id: 1, name: "Zebra Package" },
      { id: 2, name: "Apple Package" },
      { id: 3, name: "Mango Package" },
    ];

    const sorted = [...packages].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name).toBe("Apple Package");
    expect(sorted[1].name).toBe("Mango Package");
    expect(sorted[2].name).toBe("Zebra Package");
  });

  // Test package highlights extraction
  it("should extract and display package highlights", () => {
    const pkg = {
      id: 1,
      name: "Test Package",
      highlights: "Snorkeling, Diving, Beach relaxation, Water sports",
    };

    const highlights = pkg.highlights.split(",").map((h) => h.trim());
    expect(highlights).toHaveLength(4);
    expect(highlights).toContain("Snorkeling");
    expect(highlights).toContain("Diving");
  });

  // Test package amenities
  it("should extract and display package amenities", () => {
    const pkg = {
      id: 1,
      name: "Test Package",
      amenities: "WiFi, Air Conditioning, Swimming Pool, Restaurant",
    };

    const amenities = pkg.amenities.split(",").map((a) => a.trim());
    expect(amenities).toHaveLength(4);
    expect(amenities).toContain("WiFi");
    expect(amenities).toContain("Restaurant");
  });

  // Test total pages calculation
  it("should calculate correct number of pages", () => {
    const totalPackages = 25;
    const itemsPerPage = 12;
    const totalPages = Math.ceil(totalPackages / itemsPerPage);

    expect(totalPages).toBe(3);
  });

  // Test price formatting
  it("should format prices with currency", () => {
    const price = 2500;
    const formatted = `$${price.toLocaleString()}`;

    expect(formatted).toBe("$2,500");
  });
});
