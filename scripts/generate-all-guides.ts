import { getDb } from "../server/db";
import { islandGuides, places } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Template guide data based on Thoddoo format
const guideTemplate = {
  overview:
    "Welcome to this beautiful Maldivian island. Discover pristine beaches, crystal-clear waters, and authentic island experiences.",
  quickFacts: JSON.stringify([
    "🏝️ Pristine white sand beaches",
    "🌊 Crystal-clear turquoise waters",
    "🤿 Excellent snorkeling opportunities",
    "🏄 Great water sports activities",
    "👥 Friendly local community",
    "🍜 Authentic Maldivian cuisine",
    "🌅 Stunning sunset views",
    "🚤 Easy accessibility from Male",
  ]),
  topThingsToDo: JSON.stringify([
    {
      title: "🏖️ Beach Relaxation",
      description:
        "Unwind on pristine white sand beaches with turquoise waters. Perfect for swimming and sunbathing.",
    },
    {
      title: "🤿 Snorkeling",
      description:
        "Explore vibrant coral reefs and encounter tropical fish species in the crystal-clear waters.",
    },
    {
      title: "🏄 Water Sports",
      description:
        "Enjoy paddleboarding, kayaking, windsurfing, and other exciting water activities.",
    },
    {
      title: "🍜 Local Dining",
      description:
        "Enjoy authentic Maldivian cuisine at local restaurants. Try traditional dishes like garudhiya and mas huni.",
    },
    {
      title: "🚴 Island Cycling",
      description:
        "Explore the island on a bicycle. Visit local shops and experience daily island life.",
    },
    {
      title: "🌅 Sunset Walks",
      description:
        "Take peaceful evening strolls along the beach and watch the spectacular sunset over the Indian Ocean.",
    },
  ]),
  foodCafes: JSON.stringify([
    {
      name: "Local Restaurant",
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
    "Domestic flight from Malé International Airport takes approximately 30-45 minutes. Several airlines operate regular flights.",
  speedboatInfo:
    "Speedboat transfer from Malé takes approximately 1-2 hours. Comfortable and scenic journey across the Indian Ocean.",
  ferryInfo:
    "Ferry service available from Malé with journey time of approximately 2-4 hours. Most economical option for budget travelers.",
  currency: "Maldivian Rufiyaa (MVR)",
  language: "Dhivehi (English widely spoken)",
  bestTimeToVisit: "November to April (dry season)",
  whatToPack:
    "Sunscreen, swimwear, light clothing, hat, sunglasses, reef-safe sunscreen, waterproof bag",
  healthTips:
    "Stay hydrated in the tropical heat. Use reef-safe sunscreen. Bring basic medications. Drink bottled water.",
  emergencyContacts: "Emergency: 119 | Police: 119 | Ambulance: 119",
  itineraries: JSON.stringify([
    {
      day: "Day 1",
      activities:
        "Arrive at the island and settle into your accommodation. Take a leisurely walk around the island. Enjoy a relaxing evening with a sunset view.",
    },
    {
      day: "Day 2",
      activities:
        "Participate in water activities or cultural experiences. Explore local attractions. Enjoy authentic local cuisine for dinner.",
    },
    {
      day: "Day 3",
      activities:
        "Spend your final day relaxing on the beach or enjoying your favorite activity. Take time to capture memories before departure.",
    },
  ]),
  faqs: JSON.stringify([
    {
      question: "What is the best time to visit?",
      answer:
        "The dry season from November to April offers the best weather with calm seas and excellent visibility for water activities.",
    },
    {
      question: "How do I get to the island?",
      answer:
        "Most islands are accessible by speedboat or ferry from Male airport. Travel time typically ranges from 15 minutes to 2 hours depending on location.",
    },
    {
      question: "What activities are available?",
      answer:
        "Common activities include snorkeling, diving, fishing, island tours, water sports, and cultural experiences.",
    },
  ]),
};

async function generateAllGuides() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("✗ Failed to connect to database");
      process.exit(1);
    }

    console.log("🚀 Starting guide generation for all missing islands...\n");

    // Get all guides
    const guides = await db.select().from(islandGuides);
    const guideNames = new Set(guides.map(g => g.name));

    // Get all island places
    const allPlaces = await db
      .select()
      .from(places)
      .where(eq(places.type, "island"));

    // Find missing
    const missing = allPlaces.filter(p => !guideNames.has(p.name));

    console.log(`Found ${missing.length} islands without guides\n`);

    let created = 0;
    let failed = 0;

    for (let i = 0; i < missing.length; i++) {
      const place = missing[i];

      try {
        console.log(`[${i + 1}/${missing.length}] Creating guide for ${place.name}...`);

        // Get atoll name
        let atollName = "Maldives";
        if (place.atollId) {
          const atoll = await db
            .select()
            .from(places)
            .where(eq(places.id, place.atollId))
            .limit(1);
          if (atoll.length > 0) {
            atollName = atoll[0].name;
          }
        }

        // Create guide with template data
        await db.insert(islandGuides).values({
          name: place.name,
          slug: place.code || place.name.toLowerCase().replace(/\s+/g, "-"),
          placeId: place.id,
          contentType: "island",
          atoll: atollName,
          overview: guideTemplate.overview,
          quickFacts: guideTemplate.quickFacts,
          topThingsToDo: guideTemplate.topThingsToDo,
          foodCafes: guideTemplate.foodCafes,
          flightInfo: guideTemplate.flightInfo,
          speedboatInfo: guideTemplate.speedboatInfo,
          ferryInfo: guideTemplate.ferryInfo,
          currency: guideTemplate.currency,
          language: guideTemplate.language,
          coordinates: "4.1769, 73.5093",
          bestTimeToVisit: guideTemplate.bestTimeToVisit,
          whatToPack: guideTemplate.whatToPack,
          healthTips: guideTemplate.healthTips,
          emergencyContacts: guideTemplate.emergencyContacts,
          itineraries: guideTemplate.itineraries,
          faqs: guideTemplate.faqs,
          published: 1,
        });

        console.log(`✓ Created guide for ${place.name}`);
        created++;
      } catch (error) {
        console.error(`✗ Failed to create guide for ${place.name}:`, error);
        failed++;
      }

      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`\n📊 Progress: ${i + 1}/${missing.length} islands processed\n`);
      }
    }

    console.log(`\n✓ Generation complete!`);
    console.log(`  Created: ${created}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Total: ${created + failed}`);

    // Verify
    const allGuides = await db.select().from(islandGuides);
    console.log(`\n📊 Total guides in system: ${allGuides.length}`);
  } catch (error) {
    console.error("✗ Error generating guides:", error);
    throw error;
  }
}

generateAllGuides().then(() => {
  process.exit(0);
});
