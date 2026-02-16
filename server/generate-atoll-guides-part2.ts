/**
 * Atoll Destination Guides Generator - Part 2
 * Creates comprehensive SEO-optimized guides for remaining 10 Maldives atolls
 */

import { getDb } from "./db";
import { atolls } from "../drizzle/schema";
import { eq } from "drizzle-orm";

interface AtollGuideData {
  name: string;
  slug: string;
  region: string;
  description: string;
  overview: string;
  bestFor: string;
  highlights: string[];
  activities: string[];
  accommodation: string[];
  transportation: string;
  bestSeason: string;
  heroImage: string;
}

const ATOLL_GUIDES_PART2: Record<string, AtollGuideData> = {
  "shaviyani": {
    name: "Shaviyani Atoll",
    slug: "shaviyani",
    region: "North",
    description:
      "Shaviyani Atoll is a pristine destination in the northern Maldives, known for its excellent diving sites, authentic island culture, and unspoiled natural beauty. Perfect for adventurous travelers seeking exclusive experiences.",
    overview:
      "Shaviyani Atoll is a relatively underdeveloped atoll offering pristine natural beauty and authentic cultural experiences. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Shaviyani offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts, nature lovers, and those seeking authentic Maldivian experiences. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites with minimal tourist impact",
      "🏊 Snorkeling - Discover vibrant coral reefs and marine life",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine natural landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing methods",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine, uncrowded beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly accommodation options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Shaviyani Atoll is accessible via speedboat (90-120 minutes) or seaplane (60-75 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions with seasonal variations.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "noonu": {
    name: "Noonu Atoll",
    slug: "noonu",
    region: "North",
    description:
      "Noonu Atoll is a pristine destination in the northern Maldives, offering exceptional diving opportunities, pristine coral reefs, and authentic island experiences. Ideal for travelers seeking exclusive and less-crowded destinations.",
    overview:
      "Noonu Atoll is a pristine and relatively underdeveloped atoll in the northern Maldives. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Noonu offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts and adventurous travelers. Visitors can enjoy world-class diving, snorkeling, and authentic cultural experiences in a more secluded setting. The region is perfect for those seeking pristine natural beauty and authentic Maldivian culture.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Exceptional diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Noonu Atoll is accessible via speedboat (120-150 minutes) or seaplane (75-90 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "raa": {
    name: "Raa Atoll",
    slug: "raa",
    region: "North",
    description:
      "Raa Atoll is a pristine destination in the northern Maldives, known for its excellent diving opportunities, pristine coral reefs, and authentic island culture. Perfect for adventurous travelers and diving enthusiasts.",
    overview:
      "Raa Atoll is a pristine and relatively underdeveloped atoll in the northern Maldives. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Raa offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts and nature lovers. Visitors can enjoy world-class diving, snorkeling, and authentic cultural experiences in a more secluded setting. The region is perfect for those seeking pristine natural beauty and authentic Maldivian culture.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Raa Atoll is accessible via speedboat (150-180 minutes) or seaplane (90-120 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "lhaviyani": {
    name: "Lhaviyani Atoll",
    slug: "lhaviyani",
    region: "North",
    description:
      "Lhaviyani Atoll is a premier destination in the northern Maldives, known for its luxury resorts, excellent diving sites, and pristine natural beauty. Perfect for luxury travelers and diving enthusiasts.",
    overview:
      "Lhaviyani Atoll is a popular destination in the northern Maldives, featuring several luxury resorts and pristine natural beauty. The region is known for its excellent diving sites, pristine coral reefs, and high-quality accommodations. Visitors can enjoy world-class diving, snorkeling, and luxury resort amenities.\n\nThe atoll is ideal for luxury travelers, diving enthusiasts, and families. The region offers a perfect balance of comfort and adventure, with excellent diving opportunities and pristine beaches.",
    bestFor:
      "Luxury vacations, diving, snorkeling, water sports, family vacations, romantic getaways, photography, island hopping",
    highlights: [
      "Luxury resorts with world-class amenities",
      "Excellent diving sites with pristine coral reefs",
      "Pristine beaches and crystal-clear water",
      "High-quality accommodations and service",
      "Water sports and adventure activities",
      "Family-friendly resorts",
      "Fine dining and spa facilities",
      "Convenient location from Malé",
    ],
    activities: [
      "🤿 Diving - Explore excellent dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit local islands",
      "🏄 Water Sports - Enjoy paddleboarding and kayaking",
      "📸 Photography - Capture stunning island landscapes",
      "🌅 Sunset Activities - Watch sunsets from pristine beaches",
      "🍽️ Fine Dining - Experience world-class cuisine",
      "🧘 Spa & Wellness - Enjoy rejuvenating spa treatments",
    ],
    accommodation: [
      "Luxury overwater and beach villas",
      "Mid-range resort accommodations",
      "Family-friendly resorts",
      "All-inclusive packages",
      "Boutique resorts with personalized service",
    ],
    transportation:
      "Lhaviyani Atoll is accessible via speedboat (45-60 minutes) or seaplane (30-45 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "kaafu": {
    name: "Kaafu Atoll",
    slug: "kaafu",
    region: "North",
    description:
      "Kaafu Atoll, also known as North Male Atoll, is the most popular destination in the Maldives. Home to numerous luxury resorts, pristine beaches, and excellent diving sites, Kaafu Atoll is perfect for all types of travelers.",
    overview:
      "Kaafu Atoll is the most visited atoll in the Maldives, featuring numerous luxury resorts, pristine beaches, and world-class diving sites. The region is home to some of the Maldives' most prestigious properties and offers excellent value for money. Visitors can enjoy luxury resort amenities, world-class diving, and pristine natural beauty.\n\nThe atoll is ideal for luxury travelers, diving enthusiasts, families, and honeymooners. The region offers a perfect balance of comfort and adventure, with convenient access from Malé and excellent diving opportunities.",
    bestFor:
      "Luxury vacations, diving, snorkeling, water sports, family vacations, honeymoons, romantic getaways, photography, island hopping",
    highlights: [
      "Numerous luxury resorts with world-class amenities",
      "Excellent diving sites with pristine coral reefs",
      "Pristine beaches and crystal-clear water",
      "Convenient proximity to Malé",
      "High-quality accommodations and service",
      "Family-friendly resorts",
      "Fine dining and spa facilities",
      "Diverse accommodation options",
    ],
    activities: [
      "🤿 Diving - Explore excellent dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit local islands",
      "🏄 Water Sports - Enjoy paddleboarding and kayaking",
      "📸 Photography - Capture stunning island landscapes",
      "🌅 Sunset Activities - Watch sunsets from pristine beaches",
      "🍽️ Fine Dining - Experience world-class cuisine",
      "🧘 Spa & Wellness - Enjoy rejuvenating spa treatments",
    ],
    accommodation: [
      "Ultra-luxury overwater and beach villas",
      "Mid-range resort accommodations",
      "Family-friendly resorts",
      "All-inclusive packages",
      "Boutique resorts with personalized service",
    ],
    transportation:
      "Kaafu Atoll is easily accessible from Malé International Airport via speedboat (15-30 minutes) or seaplane (10-20 minutes). Most resorts arrange direct transfers.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "haa-alif": {
    name: "Haa Alif Atoll",
    slug: "haa-alif",
    region: "North",
    description:
      "Haa Alif Atoll is a pristine destination in the northernmost region of the Maldives, known for its authentic island culture, excellent diving opportunities, and unspoiled natural beauty. Perfect for adventurous travelers seeking exclusive experiences.",
    overview:
      "Haa Alif Atoll is located in the northernmost region of the Maldives, offering pristine natural beauty and authentic cultural experiences. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Haa Alif offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts, nature lovers, and those seeking authentic Maldivian experiences. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Haa Alif Atoll is accessible via speedboat (180-210 minutes) or seaplane (120-150 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "haa-dhaalu": {
    name: "Haa Dhaalu Atoll",
    slug: "haa-dhaalu",
    region: "North",
    description:
      "Haa Dhaalu Atoll is a pristine destination in the northernmost region of the Maldives, known for its authentic island culture, excellent diving opportunities, and unspoiled natural beauty. Perfect for adventurous travelers seeking exclusive experiences.",
    overview:
      "Haa Dhaalu Atoll is located in the northernmost region of the Maldives, offering pristine natural beauty and authentic cultural experiences. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Haa Dhaalu offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts, nature lovers, and those seeking authentic Maldivian experiences. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Haa Dhaalu Atoll is accessible via speedboat (210-240 minutes) or seaplane (150-180 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "gaaf-alif": {
    name: "Gaaf Alif Atoll",
    slug: "gaaf-alif",
    region: "South",
    description:
      "Gaaf Alif Atoll is a pristine destination in the southern Maldives, known for its authentic island culture, excellent diving opportunities, and unspoiled natural beauty. Perfect for adventurous travelers seeking exclusive experiences.",
    overview:
      "Gaaf Alif Atoll is located in the southern region of the Maldives, offering pristine natural beauty and authentic cultural experiences. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Gaaf Alif offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts, nature lovers, and those seeking authentic Maldivian experiences. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Gaaf Alif Atoll is accessible via speedboat (240-300 minutes) or seaplane (150-180 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "gaaf-dhaal": {
    name: "Gaaf Dhaal Atoll",
    slug: "gaaf-dhaal",
    region: "South",
    description:
      "Gaaf Dhaal Atoll is a pristine destination in the southern Maldives, known for its authentic island culture, excellent diving opportunities, and unspoiled natural beauty. Perfect for adventurous travelers seeking exclusive experiences.",
    overview:
      "Gaaf Dhaal Atoll is located in the southern region of the Maldives, offering pristine natural beauty and authentic cultural experiences. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Gaaf Dhaal offers a more exclusive and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts, nature lovers, and those seeking authentic Maldivian experiences. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Welcoming local communities",
      "Sustainable tourism practices",
      "Exclusive and unique experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit authentic local islands",
      "📸 Photography - Capture pristine landscapes",
      "🌿 Nature Exploration - Discover local ecosystems",
      "🎣 Fishing - Experience traditional fishing",
      "🍽️ Local Dining - Enjoy authentic island cuisine",
      "🏖️ Beach Relaxation - Unwind on pristine beaches",
    ],
    accommodation: [
      "Boutique resorts with personalized service",
      "Local island guesthouses",
      "Budget-friendly options",
      "Eco-friendly lodges",
      "All-inclusive packages",
    ],
    transportation:
      "Gaaf Dhaal Atoll is accessible via speedboat (270-330 minutes) or seaplane (180-210 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },
};

/**
 * Generate and update atoll guides in the database
 */
async function generateAtollGuidesPart2() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  let updatedCount = 0;
  let errorCount = 0;

  for (const [key, guideData] of Object.entries(ATOLL_GUIDES_PART2)) {
    try {
      // Check if atoll exists
      const existingAtoll = await db
        .select()
        .from(atolls)
        .where(eq(atolls.slug, guideData.slug))
        .limit(1);

      if (existingAtoll.length > 0) {
        // Update existing atoll
        await db
          .update(atolls)
          .set({
            name: guideData.name,
            region: guideData.region,
            description: guideData.description,
            overview: guideData.overview,
            bestFor: guideData.bestFor,
            highlights: JSON.stringify(guideData.highlights),
            activities: JSON.stringify(guideData.activities),
            accommodation: JSON.stringify(guideData.accommodation),
            transportation: guideData.transportation,
            bestSeason: guideData.bestSeason,
            heroImage: guideData.heroImage,
            published: 1,
          })
          .where(eq(atolls.slug, guideData.slug));

        console.log(`✅ Updated: ${guideData.name}`);
        updatedCount++;
      } else {
        // Insert new atoll
        await db.insert(atolls).values({
          name: guideData.name,
          slug: guideData.slug,
          region: guideData.region,
          description: guideData.description,
          overview: guideData.overview,
          bestFor: guideData.bestFor,
          highlights: JSON.stringify(guideData.highlights),
          activities: JSON.stringify(guideData.activities),
          accommodation: JSON.stringify(guideData.accommodation),
          transportation: guideData.transportation,
          bestSeason: guideData.bestSeason,
          heroImage: guideData.heroImage,
          published: 1,
        });

        console.log(`✨ Created: ${guideData.name}`);
        updatedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${guideData.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully processed: ${updatedCount} atolls`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Run if executed directly
if (require.main === module) {
  generateAtollGuidesPart2().catch(console.error);
}

export { generateAtollGuidesPart2 };
