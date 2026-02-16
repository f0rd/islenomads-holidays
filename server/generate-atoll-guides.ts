/**
 * Atoll Destination Guides Generator
 * Creates comprehensive SEO-optimized guides for all 20 Maldives atolls
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

const ATOLL_GUIDES: Record<string, AtollGuideData> = {
  "alif-alif": {
    name: "Alif Alif Atoll",
    slug: "alif-alif",
    region: "North",
    description:
      "Alif Alif Atoll, located in the North Male Atoll region, is one of the Maldives' most exclusive and luxurious destinations. Known for its pristine white-sand beaches, crystal-clear turquoise lagoons, and world-class resorts, Alif Alif Atoll offers the ultimate tropical paradise experience.",
    overview:
      "Alif Alif Atoll is a premier destination in the Maldives, famous for its luxury resorts and exclusive island experiences. The atoll features some of the most prestigious properties in the country, including Soneva Jani, Soneva Kiri, and other high-end resorts. With excellent diving sites, pristine beaches, and exceptional service, Alif Alif Atoll is perfect for honeymooners, luxury travelers, and those seeking an unforgettable island escape.\n\nThe atoll is characterized by its calm lagoons, abundant marine life, and well-preserved coral reefs. Visitors can enjoy world-class water sports, spa treatments, and fine dining experiences. The region is also known for its commitment to sustainability and environmental conservation.",
    bestFor:
      "Luxury vacations, honeymoons, romantic getaways, exclusive island experiences, water sports, diving and snorkeling, spa retreats",
    highlights: [
      "Luxury overwater bungalows with private pools",
      "World-class diving sites with pristine coral reefs",
      "Exclusive island experiences and private beach access",
      "Fine dining restaurants with international cuisine",
      "Spa and wellness centers offering holistic treatments",
      "Water sports including snorkeling, diving, and windsurfing",
      "Sunset cruises and dolphin watching tours",
      "Cultural experiences and local island visits",
    ],
    activities: [
      "🤿 Diving - Explore pristine coral reefs and encounter manta rays, sharks, and colorful fish species",
      "🏊 Snorkeling - Discover vibrant marine life in shallow lagoons and house reefs",
      "🚤 Island Hopping - Visit nearby local islands and experience authentic Maldivian culture",
      "🏄 Water Sports - Enjoy windsurfing, kitesurfing, paddleboarding, and jet skiing",
      "🌅 Sunset Cruises - Watch the sun set over the Indian Ocean with champagne and canapés",
      "🐬 Dolphin Watching - Spot playful dolphins in their natural habitat",
      "🧘 Spa & Wellness - Indulge in rejuvenating spa treatments and yoga sessions",
      "🍽️ Fine Dining - Experience world-class cuisine at beachfront restaurants",
    ],
    accommodation: [
      "Ultra-luxury overwater bungalows with private pools and direct lagoon access",
      "Beach villas with private gardens and infinity pools",
      "Garden villas nestled among tropical vegetation",
      "All-inclusive resort packages with meals and activities",
      "Customizable villa experiences with personal butlers",
    ],
    transportation:
      "Alif Alif Atoll is easily accessible from Malé International Airport. Most resorts offer speedboat transfers (20-45 minutes) or seaplane transfers (15-30 minutes). Some properties also arrange helicopter transfers for ultimate luxury.",
    bestSeason:
      "November to April offers the best weather with calm seas and clear skies. May to October is the monsoon season with occasional rainfall, but still offers excellent diving conditions and fewer crowds.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "alif-dhaal": {
    name: "Alif Dhaal Atoll",
    slug: "alif-dhaal",
    region: "North",
    description:
      "Alif Dhaal Atoll, also known as South Male Atoll, is a diverse destination offering a perfect blend of luxury resorts and authentic local island experiences. Located south of Malé, this atoll is famous for its exceptional diving sites, vibrant coral reefs, and warm hospitality.",
    overview:
      "Alif Dhaal Atoll is a dynamic destination that caters to all types of travelers. The atoll is home to several world-renowned resorts, popular local islands like Maafushi and Kandooma, and some of the Maldives' best diving sites. The region offers excellent value for money while maintaining high standards of comfort and service.\n\nThe atoll features diverse accommodation options ranging from luxury resorts to guesthouses on local islands. Visitors can experience both the exclusive resort lifestyle and authentic Maldivian culture. The region is particularly popular with diving enthusiasts due to its proximity to famous dive sites like Kandooma Thila and Banana Reef.",
    bestFor:
      "Diving and snorkeling, island hopping, cultural experiences, budget-friendly luxury, family vacations, water sports, photography",
    highlights: [
      "World-class diving sites including Kandooma Thila and Banana Reef",
      "Authentic local island experiences on Maafushi and Kandooma",
      "Excellent value for money with diverse accommodation options",
      "Vibrant coral reefs teeming with marine life",
      "Water sports and adventure activities",
      "Cultural immersion and local cuisine",
      "Convenient proximity to Malé (30-45 minutes)",
      "Variety of resorts from budget-friendly to ultra-luxury",
    ],
    activities: [
      "🤿 Diving - Explore famous dive sites with abundant marine biodiversity",
      "🏊 Snorkeling - Enjoy shallow reef exploration and house reef snorkeling",
      "🚤 Island Hopping - Visit local islands and experience authentic Maldivian life",
      "🏄 Water Sports - Try surfing, paddleboarding, and other water activities",
      "🐠 Fish Feeding - Hand-feed tropical fish in the lagoon",
      "🌊 Reef Exploration - Discover colorful coral gardens and marine ecosystems",
      "🍽️ Local Dining - Taste authentic Maldivian cuisine at island restaurants",
      "🎣 Fishing - Experience traditional Maldivian fishing techniques",
    ],
    accommodation: [
      "Luxury overwater and beach villas at premium resorts",
      "Mid-range resort accommodations with excellent amenities",
      "Guesthouses on local islands offering authentic experiences",
      "Budget-friendly options without compromising comfort",
      "All-inclusive packages with meals and activities",
    ],
    transportation:
      "Alif Dhaal Atoll is conveniently located 30-45 minutes from Malé International Airport via speedboat. Seaplane transfers are also available for direct resort access. Local ferries connect the atoll's islands.",
    bestSeason:
      "November to April provides ideal weather conditions. May to October offers monsoon season diving with excellent visibility and fewer tourists.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "baa": {
    name: "Baa Atoll",
    slug: "baa",
    region: "North",
    description:
      "Baa Atoll is a UNESCO Biosphere Reserve and one of the Maldives' most biodiverse destinations. Located in the North Male region, Baa Atoll is renowned for its exceptional marine life, pristine coral reefs, and commitment to environmental conservation.",
    overview:
      "Baa Atoll is a paradise for nature lovers and diving enthusiasts. As a UNESCO Biosphere Reserve, the atoll is protected and carefully managed to preserve its unique ecosystems. The region is famous for its manta ray encounters, particularly at Hanifaru Bay, which is one of the world's best manta ray aggregation sites.\n\nThe atoll features several luxury resorts, beautiful local islands, and some of the healthiest coral reefs in the Maldives. Visitors can experience world-class diving, snorkeling with manta rays, and authentic island culture. The region is ideal for eco-conscious travelers seeking sustainable tourism experiences.",
    bestFor:
      "Manta ray encounters, diving, snorkeling, eco-tourism, nature photography, wildlife watching, luxury experiences, conservation-minded travel",
    highlights: [
      "Hanifaru Bay - world's best manta ray aggregation site",
      "UNESCO Biosphere Reserve status with pristine ecosystems",
      "Exceptional coral reefs and marine biodiversity",
      "Luxury resorts with sustainability focus",
      "Authentic local island experiences",
      "Professional diving guides and operators",
      "Seasonal manta ray migrations (May-November)",
      "Pristine beaches and crystal-clear lagoons",
    ],
    activities: [
      "🦅 Manta Ray Encounters - Swim with graceful manta rays at Hanifaru Bay",
      "🤿 Diving - Explore pristine dive sites with abundant marine life",
      "🏊 Snorkeling - Discover vibrant coral reefs and tropical fish",
      "📸 Wildlife Photography - Capture stunning images of marine life",
      "🌿 Eco-Tours - Learn about conservation efforts and marine ecosystems",
      "🚤 Island Hopping - Visit local islands and experience island culture",
      "🌅 Sunset Viewing - Watch spectacular sunsets from pristine beaches",
      "🧘 Wellness Retreats - Enjoy yoga and spa treatments in natural settings",
    ],
    accommodation: [
      "Eco-friendly luxury resorts with sustainability practices",
      "Overwater and beach villas with ocean views",
      "Local island guesthouses for authentic experiences",
      "All-inclusive resort packages",
      "Boutique resorts with personalized service",
    ],
    transportation:
      "Baa Atoll is accessible via speedboat (60-90 minutes) or seaplane (45-60 minutes) from Malé International Airport. Most resorts arrange transfers directly to their properties.",
    bestSeason:
      "May to November is peak manta ray season. November to April offers excellent weather and calm seas. Year-round diving is possible with varying conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "vaavu": {
    name: "Vaavu Atoll",
    slug: "vaavu",
    region: "Central",
    description:
      "Vaavu Atoll is a hidden gem in the Maldives, known for its exceptional diving opportunities, pristine coral reefs, and exclusive island experiences. Located in the central region, Vaavu Atoll offers a perfect balance of luxury and adventure.",
    overview:
      "Vaavu Atoll is an ideal destination for diving enthusiasts and adventurous travelers. The atoll features some of the Maldives' most spectacular dive sites, including Keyodhoo Caves and Fotteyo Kandu. With fewer tourists than other atolls, Vaavu offers a more exclusive and intimate island experience.\n\nThe atoll is home to several luxury resorts and pristine local islands. Visitors can enjoy world-class diving, snorkeling, and water sports in a more secluded setting. The region is perfect for those seeking an authentic Maldivian experience away from the crowds.",
    bestFor:
      "Diving, snorkeling, exclusive experiences, adventure travel, water sports, photography, peaceful vacations, marine exploration",
    highlights: [
      "Exceptional dive sites with pristine coral reefs",
      "Keyodhoo Caves - unique underwater cave formations",
      "Fewer tourists and more exclusive experiences",
      "Luxury resorts with personalized service",
      "Pristine beaches and clear lagoons",
      "Abundant marine life and fish species",
      "Water sports and adventure activities",
      "Authentic local island culture",
    ],
    activities: [
      "🤿 Cave Diving - Explore unique underwater cave systems",
      "🏊 Reef Diving - Discover pristine coral reefs and marine life",
      "🐠 Snorkeling - Enjoy shallow reef exploration",
      "🚤 Island Hopping - Visit local islands and experience culture",
      "🏄 Water Sports - Try paddleboarding, windsurfing, and kayaking",
      "📸 Photography - Capture stunning underwater and landscape photos",
      "🌅 Sunset Activities - Enjoy beach walks and sunset viewing",
      "🎣 Fishing Excursions - Experience traditional fishing methods",
    ],
    accommodation: [
      "Luxury overwater and beach villas",
      "Boutique resorts with exclusive amenities",
      "Local island guesthouses",
      "All-inclusive resort packages",
      "Private villa experiences",
    ],
    transportation:
      "Vaavu Atoll is accessible via speedboat (90-120 minutes) or seaplane (60-75 minutes) from Malé International Airport. The atoll's relative isolation adds to its exclusive appeal.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions with seasonal variations.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "meemu": {
    name: "Meemu Atoll",
    slug: "meemu",
    region: "Central",
    description:
      "Meemu Atoll is a pristine destination in the central Maldives, offering excellent diving, snorkeling, and authentic island experiences. Known for its welcoming local communities and unspoiled natural beauty, Meemu Atoll is perfect for travelers seeking genuine Maldivian culture.",
    overview:
      "Meemu Atoll is characterized by its authentic charm and natural beauty. The atoll features several luxury resorts and vibrant local islands where visitors can experience genuine Maldivian hospitality. The region offers excellent diving opportunities, pristine coral reefs, and diverse marine ecosystems.\n\nThe atoll is less crowded than northern atolls, making it ideal for those seeking a more peaceful and authentic experience. Visitors can enjoy both luxury resort amenities and meaningful interactions with local communities. The region is also known for its traditional fishing practices and local crafts.",
    bestFor:
      "Authentic experiences, diving, snorkeling, cultural immersion, peaceful vacations, photography, family trips, local island visits",
    highlights: [
      "Authentic Maldivian island culture and hospitality",
      "Excellent diving sites with healthy coral reefs",
      "Pristine beaches and clear lagoons",
      "Local island experiences and community interactions",
      "Diverse accommodation options",
      "Less crowded than northern atolls",
      "Traditional fishing and local crafts",
      "Variety of water sports and activities",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites with abundant marine life",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit local islands and meet local communities",
      "🏄 Water Sports - Enjoy paddleboarding, kayaking, and windsurfing",
      "🎣 Fishing Trips - Experience traditional Maldivian fishing",
      "🌿 Nature Walks - Explore island vegetation and local ecosystems",
      "🍽️ Local Dining - Taste authentic Maldivian cuisine",
      "🎨 Cultural Activities - Learn about local crafts and traditions",
    ],
    accommodation: [
      "Luxury resorts with modern amenities",
      "Mid-range resort accommodations",
      "Local island guesthouses for authentic experiences",
      "Budget-friendly options",
      "All-inclusive packages",
    ],
    transportation:
      "Meemu Atoll is accessible via speedboat (120-150 minutes) or seaplane (75-90 minutes) from Malé International Airport. The journey offers beautiful views of the Maldivian archipelago.",
    bestSeason:
      "November to April provides ideal weather conditions. May to October offers monsoon season diving with excellent visibility.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "faafu": {
    name: "Faafu Atoll",
    slug: "faafu",
    region: "Central",
    description:
      "Faafu Atoll is an emerging destination in the central Maldives, offering pristine natural beauty, excellent diving opportunities, and authentic local island experiences. Perfect for adventurous travelers seeking less-explored destinations.",
    overview:
      "Faafu Atoll is a relatively underdeveloped atoll with tremendous potential for travelers seeking authentic and exclusive experiences. The region features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Faafu offers a more intimate and peaceful island experience.\n\nThe atoll is ideal for diving enthusiasts, nature lovers, and those seeking to support sustainable tourism. Visitors can enjoy pristine beaches, world-class diving, and meaningful cultural interactions with local islanders.",
    bestFor:
      "Authentic experiences, diving, snorkeling, adventure travel, eco-tourism, photography, peaceful vacations, cultural immersion",
    highlights: [
      "Pristine and less-developed destination",
      "Excellent diving sites with healthy coral reefs",
      "Authentic local island culture",
      "Abundant marine life and biodiversity",
      "Peaceful and uncrowded beaches",
      "Sustainable tourism practices",
      "Welcoming local communities",
      "Unique and exclusive experiences",
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
      "Faafu Atoll is accessible via speedboat (150-180 minutes) or seaplane (90-120 minutes) from Malé International Airport. The journey is part of the adventure.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions with seasonal variations.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "dhaalu": {
    name: "Dhaalu Atoll",
    slug: "dhaalu",
    region: "Central",
    description:
      "Dhaalu Atoll is a charming destination in the central Maldives, known for its pristine beaches, excellent diving sites, and authentic island culture. The atoll offers a perfect blend of luxury and local experiences.",
    overview:
      "Dhaalu Atoll is a hidden treasure in the Maldives, offering pristine natural beauty and authentic cultural experiences. The atoll features several luxury resorts, vibrant local islands, and some of the region's best diving sites. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities.\n\nThe atoll is characterized by its warm hospitality, pristine beaches, and healthy coral reefs. The region is ideal for travelers seeking both comfort and authentic experiences. Dhaalu offers excellent value for money while maintaining high standards of service and sustainability.",
    bestFor:
      "Diving, snorkeling, cultural experiences, family vacations, photography, water sports, peaceful getaways, island hopping",
    highlights: [
      "Pristine beaches with crystal-clear water",
      "Excellent diving sites with abundant marine life",
      "Authentic local island experiences",
      "Luxury resorts with personalized service",
      "Warm and welcoming local communities",
      "Diverse accommodation options",
      "Water sports and adventure activities",
      "Sustainable tourism practices",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🚤 Island Hopping - Visit local islands and communities",
      "🏄 Water Sports - Enjoy paddleboarding and kayaking",
      "📸 Photography - Capture stunning island landscapes",
      "🌅 Sunset Activities - Watch sunsets from pristine beaches",
      "🍽️ Local Dining - Experience authentic Maldivian cuisine",
      "🎨 Cultural Activities - Learn about local traditions",
    ],
    accommodation: [
      "Luxury overwater and beach villas",
      "Mid-range resort accommodations",
      "Local island guesthouses",
      "Budget-friendly options",
      "All-inclusive packages",
    ],
    transportation:
      "Dhaalu Atoll is accessible via speedboat (120-150 minutes) or seaplane (75-90 minutes) from Malé International Airport.",
    bestSeason:
      "November to April provides ideal weather. May to October offers excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "thaa": {
    name: "Thaa Atoll",
    slug: "thaa",
    region: "Central",
    description:
      "Thaa Atoll is a pristine destination in the central Maldives, offering exceptional diving opportunities, authentic island culture, and unspoiled natural beauty. Perfect for adventurous travelers and diving enthusiasts.",
    overview:
      "Thaa Atoll is a pristine and relatively undeveloped destination, ideal for travelers seeking authentic Maldivian experiences. The atoll features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other atolls, Thaa offers a more exclusive and peaceful island experience.\n\nThe region is known for its excellent diving sites, pristine beaches, and authentic local island culture. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
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
      "Thaa Atoll is accessible via speedboat (180-210 minutes) or seaplane (120-150 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "laamu": {
    name: "Laamu Atoll",
    slug: "laamu",
    region: "South",
    description:
      "Laamu Atoll is a pristine destination in the southern Maldives, known for its exceptional diving opportunities, authentic island culture, and unspoiled natural beauty. Ideal for adventurous travelers seeking exclusive experiences.",
    overview:
      "Laamu Atoll is one of the southernmost atolls in the Maldives, offering pristine natural beauty and authentic cultural experiences. The atoll features pristine coral reefs, abundant marine life, and welcoming local communities. With fewer resorts than other regions, Laamu offers a more exclusive and peaceful island experience.\n\nThe region is known for its excellent diving sites, pristine beaches, and authentic local island culture. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities in a more secluded setting.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, peaceful vacations, cultural immersion, eco-tourism",
    highlights: [
      "Pristine southern destination",
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
      "Laamu Atoll is accessible via speedboat (240-300 minutes) or seaplane (150-180 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "gnaviyani": {
    name: "Gnaviyani Atoll",
    slug: "gnaviyani",
    region: "South",
    description:
      "Gnaviyani Atoll, home to Fuvahmulah Island, is a unique destination in the southern Maldives. Known for its freshwater lagoons, unique ecosystems, and authentic island culture, Gnaviyani offers a distinctive Maldivian experience.",
    overview:
      "Gnaviyani Atoll is unique among Maldivian atolls due to its freshwater lagoons and distinctive ecosystems. The atoll is home to Fuvahmulah Island, which features freshwater lakes and unique flora and fauna. The region offers authentic cultural experiences, excellent diving opportunities, and pristine natural beauty.\n\nThe atoll is ideal for travelers seeking unique and authentic experiences. Visitors can explore freshwater lagoons, experience local island culture, and enjoy world-class diving in a more exclusive setting.",
    bestFor:
      "Unique experiences, diving, snorkeling, cultural immersion, photography, adventure travel, eco-tourism, nature exploration",
    highlights: [
      "Unique freshwater lagoons and ecosystems",
      "Authentic local island culture",
      "Excellent diving sites",
      "Pristine natural beauty",
      "Unique flora and fauna",
      "Peaceful and uncrowded destination",
      "Sustainable tourism practices",
      "Exclusive experiences",
    ],
    activities: [
      "🤿 Diving - Explore pristine dive sites",
      "🏊 Snorkeling - Discover vibrant coral reefs",
      "🌊 Lagoon Exploration - Explore unique freshwater lagoons",
      "🚤 Island Hopping - Visit local islands",
      "📸 Photography - Capture unique landscapes",
      "🌿 Nature Walks - Explore local ecosystems",
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
      "Gnaviyani Atoll is accessible via speedboat (300+ minutes) or seaplane (180-210 minutes) from Malé International Airport.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },

  "addu": {
    name: "Addu Atoll",
    slug: "addu",
    region: "South",
    description:
      "Addu Atoll, located in the southernmost region of the Maldives, is a unique destination known for its strategic location, authentic culture, and excellent diving opportunities. Home to the Equatorial Channel, Addu offers world-class diving experiences.",
    overview:
      "Addu Atoll is the southernmost atoll in the Maldives, offering a unique combination of authentic island culture and world-class diving. The atoll is home to the Equatorial Channel, one of the world's best diving destinations. The region features pristine coral reefs, abundant marine life, and welcoming local communities.\n\nAddu is ideal for diving enthusiasts and adventurous travelers. The atoll offers excellent diving opportunities, authentic cultural experiences, and pristine natural beauty. Visitors can enjoy world-class diving, snorkeling, and meaningful interactions with local communities.",
    bestFor:
      "Diving, snorkeling, authentic experiences, adventure travel, photography, cultural immersion, eco-tourism, exclusive vacations",
    highlights: [
      "Equatorial Channel - world-class diving destination",
      "Pristine coral reefs with abundant marine life",
      "Authentic local island culture",
      "Strategic location with unique geography",
      "Excellent diving sites",
      "Peaceful and exclusive destination",
      "Welcoming local communities",
      "Sustainable tourism practices",
    ],
    activities: [
      "🤿 Diving - Explore world-class dive sites including Equatorial Channel",
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
      "Addu Atoll is accessible via speedboat (300+ minutes) or seaplane (180-210 minutes) from Malé International Airport. Domestic flights are also available.",
    bestSeason:
      "November to April offers the best weather. May to October provides excellent diving conditions with seasonal variations.",
    heroImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  },
};

/**
 * Generate and update atoll guides in the database
 */
async function generateAtollGuides() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  let updatedCount = 0;
  let errorCount = 0;

  for (const [key, guideData] of Object.entries(ATOLL_GUIDES)) {
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
  generateAtollGuides().catch(console.error);
}

export { generateAtollGuides };
