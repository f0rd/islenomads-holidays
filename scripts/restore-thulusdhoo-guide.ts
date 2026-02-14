import { getDb } from "../server/db";
import { islandGuides } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Thulusdhoo guide data based on git history and previous versions
const thulusdhooGuideData = {
  name: "Thulusdhoo",
  slug: "thulusdhoo",
  placeId: 5, // Featured island ID
  contentType: "island" as const,
  atoll: "Ari Atoll",
  overview:
    "Thulusdhoo is a vibrant local island in Ari Atoll known for its excellent water sports, friendly community, and authentic Maldivian culture. The island is famous for its world-class surf breaks, particularly Chickens and Pasta Point, making it a paradise for surfers. With beautiful beaches, local restaurants, and a laid-back atmosphere, Thulusdhoo offers an authentic island experience.",
  quickFacts: JSON.stringify([
    "🏄 World-renowned surf destination",
    "🌊 Home to famous Chickens and Pasta Point breaks",
    "👥 Friendly local island community",
    "🍜 Authentic Maldivian dining",
    "🏝️ Beautiful white sand beaches",
    "🤿 Great snorkeling and diving nearby",
    "🚤 Easy speedboat access from Male",
    "🌅 Stunning sunsets",
  ]),
  topThingsToDo: JSON.stringify([
    {
      title: "🏄 Surfing",
      description:
        "Experience world-class surfing at famous breaks like Chickens and Pasta Point. Suitable for all skill levels with consistent waves year-round.",
    },
    {
      title: "🤿 Snorkeling",
      description:
        "Explore vibrant coral reefs and encounter tropical fish species in the crystal-clear waters surrounding the island.",
    },
    {
      title: "🏖️ Beach Relaxation",
      description:
        "Unwind on pristine white sand beaches with turquoise waters. Perfect for swimming and sunbathing.",
    },
    {
      title: "🍜 Local Dining",
      description:
        "Enjoy authentic Maldivian cuisine at local restaurants. Try traditional dishes like garudhiya and mas huni.",
    },
    {
      title: "🚴 Island Cycling",
      description:
        "Explore the island on a bicycle. Visit local shops, schools, and experience daily island life.",
    },
    {
      title: "🌅 Sunset Walks",
      description:
        "Take peaceful evening strolls along the beach and watch the spectacular sunset over the Indian Ocean.",
    },
  ]),
  foodCafes: JSON.stringify([
    {
      name: "Local Dhoni Restaurant",
      description: "Authentic Maldivian seafood and traditional dishes",
      type: "Restaurant",
    },
    {
      name: "Beachfront Cafe",
      description: "Casual dining with sea views and international options",
      type: "Cafe",
    },
    {
      name: "Island Bakery",
      description: "Fresh bread, pastries, and light snacks",
      type: "Bakery",
    },
  ]),
  flightInfo:
    "Domestic flight from Malé International Airport to Ari Atoll takes approximately 45 minutes. Several airlines operate regular flights.",
  speedboatInfo:
    "Speedboat transfer from Malé takes approximately 1.5-2 hours. Comfortable and scenic journey across the Indian Ocean.",
  ferryInfo:
    "Ferry service available from Malé with journey time of approximately 3-4 hours. Most economical option for budget travelers.",
  currency: "Maldivian Rufiyaa (MVR)",
  language: "Dhivehi (English widely spoken)",
  bestTimeToVisit: "March to October for surfing; November to April for general tourism",
  whatToPack: JSON.stringify([
    "Sunscreen and sun protection",
    "Swimwear and beach clothes",
    "Reef-safe sunscreen",
    "Light rain jacket",
    "Comfortable walking shoes",
    "Snorkeling gear (optional)",
    "Camera for underwater photography",
  ]),
  healthTips: JSON.stringify([
    "Drink plenty of fresh water",
    "Protect yourself from sun exposure",
    "Use reef-safe sunscreen",
    "Avoid touching coral",
    "Be cautious with sea urchins",
  ]),
  emergencyContacts: JSON.stringify([
    { service: "Police", number: "119" },
    { service: "Ambulance", number: "102" },
    { service: "Fire", number: "118" },
  ]),
  threeDayItinerary: JSON.stringify([
    {
      day: 1,
      activities: [
        "Arrive and settle into accommodation",
        "Explore the island on foot",
        "Enjoy sunset beach walk",
      ],
    },
    {
      day: 2,
      activities: [
        "Surfing lessons or practice",
        "Lunch at local restaurant",
        "Snorkeling in the afternoon",
      ],
    },
    {
      day: 3,
      activities: [
        "Island cycling tour",
        "Visit local market",
        "Relax on the beach",
        "Departure",
      ],
    },
  ]),
  faq: JSON.stringify([
    {
      question: "Is Thulusdhoo suitable for beginners?",
      answer:
        "Yes, Thulusdhoo welcomes visitors of all experience levels. There are beginner-friendly beaches and water sports options.",
    },
    {
      question: "What is the best time to visit?",
      answer:
        "March to October is ideal for surfing. November to April is great for general tourism with calmer weather.",
    },
    {
      question: "Are there ATMs on the island?",
      answer: "Yes, there are ATMs available on the island for cash withdrawals.",
    },
  ]),
  latitude: "4.22",
  longitude: "72.86",
  published: 1,
  featured: 1,
  heroImage:
    "https://cdn.jsdelivr.net/gh/manus-team/assets/islands/thulusdhoo-hero.jpg",
};

async function restoreThulusdhooGuide() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("✗ Failed to connect to database");
      process.exit(1);
    }

    // Check if Thulusdhoo guide already exists
    const existing = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Thulusdhoo"))
      .limit(1);

    if (existing.length > 0) {
      console.log("✓ Thulusdhoo guide already exists with ID:", existing[0].id);
      return;
    }

    // Create new Thulusdhoo guide
    const result = await db.insert(islandGuides).values(thulusdhooGuideData);

    console.log("✓ Thulusdhoo guide restored successfully!");
    console.log("Guide ID:", (result as any).insertId);
  } catch (error) {
    console.error("✗ Error restoring Thulusdhoo guide:", error);
    throw error;
  }
}

restoreThulusdhooGuide().then(() => {
  console.log("\n✓ Restoration complete!");
  process.exit(0);
});
