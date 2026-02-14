#!/usr/bin/env node

/**
 * Seed script to populate comprehensive guide content for local tourism islands
 * Run with: node seed-local-island-guides.mjs
 */

import mysql from 'mysql2/promise';

// Parse DATABASE_URL
function parseDatabaseUrl(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

const dbConfig = parseDatabaseUrl(DATABASE_URL);

// Comprehensive guide content for local tourism islands
const islandGuides = [
  {
    name: "Himmafushi",
    topThingsToDo: [
      { title: "Surfing at Jailbreak", description: "Home break, 5-minute walk from island, free access, right-hander with 3 sections, intermediate to advanced, 3-6 feet typical" },
      { title: "Surfing at Sultans", description: "Across channel, fast right-hander, 2 sections with barrels, 200m rides, advanced surfers, usually crowded" },
      { title: "Surfing at Honkys", description: "Left-hand point break, mellow first peak, second section doubles in height, long perfect rides" },
      { title: "Bikini Beach Relaxation", description: "Only designated bikini area on island, white sandy beaches, crystalline waters, sunbeds available" },
      { title: "Water Sports", description: "Kayaking ($10/hour), jet skiing, parasailing, wakeboarding, windsurfing, underwater scooter rentals" },
      { title: "Scuba Diving", description: "PADI dive centers available (Feena Dive), various dive sites in area, good for all levels" },
      { title: "Snorkeling Safari", description: "Clear warm water, diverse marine life, eagle rays, sharks, rays, tropical fish" },
      { title: "Night Fishing", description: "Game fish like trevallies, snappers, groupers, fish can be cooked at guesthouse" },
      { title: "Dolphin Cruise", description: "Spinner dolphins with aerial acrobatics, fun day cruising experience" },
      { title: "Resort Day Visits", description: "Day trips to nearby resorts with lunch and drinks included" }
    ],
    attractions: [
      { name: "Jailbreak Surf Break", description: "Home break 5-minute walk away, free access, right-hander with 3 sections, intermediate to advanced" },
      { name: "Bikini Beach", description: "Only designated bikini area on island, white sandy beaches, crystalline waters" },
      { name: "Island Lagoon", description: "Turquoise lagoon perfect for swimming and water sports" }
    ],
    foodCafes: [
      { name: "Oevaru", description: "Tuna, pasta with seafood, curry, western foods, good prices" },
      { name: "Anmadey Cafe", description: "Local style, good tuna fish rice, big servings" },
      { name: "Sea Breeze Cafe", description: "Local-style with Maldivian food and snacks, friendly management" },
      { name: "Bun Me", description: "Quick sandwiches with meat" }
    ],
    bestTimeToVisit: "March to October (Surf Season), Peak Surf June to August",
    quickFacts: [
      "Distance from Male: 20 minutes by speedboat ($10)",
      "Island Type: Local inhabited island",
      "Population: 850 residents",
      "Best For: Surfers, budget travelers, water sports enthusiasts",
      "Accommodation: $40-80 per night",
      "Main Language: Dhivehi, English widely spoken",
      "Walkable in: 40 minutes",
      "Surf Breaks: 5+ world-class breaks within 10-25 minutes by boat"
    ],
    speedboatInfo: "Scheduled speedboat from Male: $10, 20 minutes. Departures: Male to Himmafushi (11:45, 15:00, 16:45, 22:00), Himmafushi to Male (8:00, 12:45, 16:00, 18:15)",
    ferryInfo: "Local ferry from Vilingili ferry terminal: $2, departs 14:30 daily except Friday",
    threeDayItinerary: [
      { day: 1, activities: "Arrive and settle in, explore island on foot, try local restaurants, sunset at Bikini Beach" },
      { day: 2, activities: "Full day surfing or water sports, morning session at Jailbreak, afternoon at Sultans or Honkys" },
      { day: 3, activities: "Snorkeling safari or dolphin cruise, visit local market, relax at beach, prepare for departure" }
    ],
    faq: [
      { question: "Is there an ATM on Himmafushi?", answer: "No ATMs on island - bring cash (ruffiyaas or USD). Credit cards accepted with 4% fee" },
      { question: "What's the best time to surf?", answer: "March to October is surf season, with peak conditions June to August" },
      { question: "Can beginners surf here?", answer: "Yes, Ninjas and Jailbreak are suitable for beginners. Honkys is also good for learning" },
      { question: "Are there groceries available?", answer: "Yes, basic groceries available. Water $1, fruits/vegetables $0.10-2" },
      { question: "How long to walk around the island?", answer: "About 40 minutes to walk around the entire island" }
    ]
  },
  {
    name: "Omadhoo",
    topThingsToDo: [
      { title: "Flying Fox Watching", description: "Watch from sunset as they soar from sleeping perches in palms" },
      { title: "Stingray Feeding", description: "5:30 PM nightly feeding, stand in water with resident rays, be gentle if touching" },
      { title: "Reef Shark Viewing", description: "Late evening at boardwalk pier (11 PM), large spotlight shows massive reef sharks" },
      { title: "Bioluminescent Plankton", description: "January-March best season, visible after dark on tourist beach" },
      { title: "Traditional Dhoni Ride", description: "$30 for scenic ride on traditional boat" },
      { title: "Reef Snorkeling", description: "Swim straight out from shore at high tide, reach reef shelf, see tropical fish and sharks" },
      { title: "Island Beach Walks", description: "Multiple good beaches, start at Bikini Beach and head clockwise" },
      { title: "Day Trip to Kunburudhoo", description: "Neighboring island, epic blue lagoon snorkeling, local ferry access" },
      { title: "Snorkel Excursions", description: "See whale sharks and mantas (best June-November off-season)" }
    ],
    attractions: [
      { name: "Bikini Beach", description: "Best part of Omadhoo, quiet and peaceful" },
      { name: "Stingray Feeding Point", description: "Nightly feeding at 5:30 PM, unique wildlife experience" },
      { name: "Reef Shark Viewing Pier", description: "Late evening viewing with spotlight" },
      { name: "Flying Fox Roosts", description: "Palm trees where flying foxes sleep during day" }
    ],
    foodCafes: [
      { name: "Green Leaf Cafe", description: "Convenient dining, good local food" },
      { name: "Local Restaurants", description: "Small restaurants scattered throughout island with similar pricing" }
    ],
    bestTimeToVisit: "November-April (Dry Season), Bioluminescence January-March",
    quickFacts: [
      "Island Type: Local inhabited island",
      "Best For: Wildlife viewing, relaxation, budget travelers",
      "Accommodation: $50-90 per night including breakfast",
      "Main Language: Dhivehi, English widely spoken",
      "Atmosphere: Very peaceful, few tourists",
      "Bioluminescence: Best January-March",
      "Stingray Feeding: Daily at 5:30 PM",
      "Nearby Island: Kunburudhoo with blue lagoon snorkeling"
    ],
    threeDayItinerary: [
      { day: 1, activities: "Arrive and settle in, explore Bikini Beach, relax and acclimate" },
      { day: 2, activities: "Stingray feeding at 5:30 PM, reef shark viewing at 11 PM, bioluminescence viewing" },
      { day: 3, activities: "Reef snorkeling, day trip to Kunburudhoo, flying fox watching at sunset" }
    ],
    faq: [
      { question: "What's the best time to see bioluminescence?", answer: "January-March is best season, visible after dark on tourist beach" },
      { question: "Are the stingrays safe?", answer: "Yes, they're accustomed to humans. Be gentle if touching them" },
      { question: "How far is Kunburudhoo?", answer: "Neighboring island, accessible by local ferry" },
      { question: "What's the accommodation like?", answer: "Budget-friendly guesthouses with basic amenities, $50-90 per night" }
    ]
  },
  {
    name: "Feridhoo",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "24/7 shore access, 20-meter walk from accommodations, 80% live corals, reef sharks, Napoleon wrasse" },
      { title: "House Reef Diving", description: "3-25 meters depth, suitable for beginners to advanced, professional PADI dive centers available" },
      { title: "Feridhoo Caves Diving", description: "Unique underwater formation 15 minutes by boat, swim-throughs, larger pelagic species" },
      { title: "Night Diving", description: "Available with excellent turtle spotting opportunities" },
      { title: "Eastern Lagoon Snorkeling", description: "Calm, shallow waters for beginners" },
      { title: "Northern Drop-off Snorkeling", description: "More adventurous, frequent reef shark sightings" },
      { title: "Southwestern Corner Exploration", description: "Pristine coral formations, stronger currents during monsoon transitions" }
    ],
    attractions: [
      { name: "House Reef", description: "80% live corals, accessible 24/7 from shore, pristine coral gardens" },
      { name: "Feridhoo Caves", description: "Unique underwater formation with swim-throughs" },
      { name: "Teardrop Lagoon", description: "Turquoise lagoon with excellent visibility" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests, authentic Maldivian cuisine" }
    ],
    bestTimeToVisit: "December-April (Dry Season), March-May and September-November (Optimal House Reef)",
    quickFacts: [
      "Island Type: Remote local island",
      "Best For: Snorkelers, divers, budget travelers",
      "Accommodation: $45-60 per night",
      "House Reef: 80% live corals, 24/7 accessible",
      "Main Language: Dhivehi, English widely spoken",
      "Dive Centers: Professional PADI available",
      "Visibility: 25+ meters in dry season",
      "Teardrop-shaped island with turquoise lagoon"
    ],
    speedboatInfo: "$45-60 from Male, journey time varies by operator",
    threeDayItinerary: [
      { day: 1, activities: "Arrive and settle in, house reef snorkeling from shore" },
      { day: 2, activities: "Full day diving or snorkeling, visit Feridhoo Caves, night diving with turtle spotting" },
      { day: 3, activities: "Explore different reef sections, relax on beach, prepare for departure" }
    ],
    faq: [
      { question: "Is the house reef accessible year-round?", answer: "Yes, accessible year-round with excellent visibility" },
      { question: "What's the dive certification requirement?", answer: "Beginners welcome, PADI dive centers offer certification courses" },
      { question: "How far is it from Male?", answer: "Speedboat transfer $45-60 from Male" },
      { question: "Are there restaurants on island?", answer: "Guesthouses serve meals, authentic Maldivian cuisine" }
    ]
  },
  {
    name: "Dhangethi",
    topThingsToDo: [
      { title: "Whale Shark Encounters", description: "7 out of 10 encounter success rate, morning trips 6:00-11:00 AM optimal, $45-55" },
      { title: "Research Whale Shark Trips", description: "$65, higher success rates with scientist guides, photography-focused expeditions" },
      { title: "House Reef Diving", description: "100+ species of reef fish, schools of fusiliers, hunting trevally, resident nurse sharks" },
      { title: "Broken Rock Dive Site", description: "Dramatic overhangs at 25-30 meters, grey reef sharks, Napoleon wrasse" },
      { title: "Manta Point Diving", description: "Accessible during southwest monsoon (May-November), 60% manta ray encounter success rate" },
      { title: "Night Snorkeling", description: "Hunting moray eels, sleeping parrotfish, entirely different underwater landscapes" },
      { title: "Island Exploration", description: "Traditional fishing village with 580 residents, authentic Maldivian lifestyle" }
    ],
    attractions: [
      { name: "Whale Shark Sanctuary", description: "Research zone with 7/10 encounter success rate year-round" },
      { name: "House Reef", description: "100+ species of reef fish, resident nurse sharks" },
      { name: "Broken Rock", description: "Dramatic dive site with grey reef sharks and Napoleon wrasse" },
      { name: "Manta Point", description: "60% manta ray encounter success rate May-November" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests, authentic Maldivian cuisine" }
    ],
    bestTimeToVisit: "Year-round for whale sharks, May-November for manta rays",
    quickFacts: [
      "Island Type: Fishing village",
      "Population: 580 residents",
      "Best For: Whale shark enthusiasts, divers, budget travelers",
      "Accommodation: From $35 per night",
      "Whale Shark Success: 7/10 encounter rate",
      "Research Base: Maldives Whale Shark Research Programme",
      "Main Language: Dhivehi, English widely spoken",
      "Manta Rays: Best May-November"
    ],
    threeDayItinerary: [
      { day: 1, activities: "Arrive and settle in, explore fishing village, house reef snorkeling" },
      { day: 2, activities: "Morning whale shark trip, afternoon diving at Broken Rock or Manta Point" },
      { day: 3, activities: "Research whale shark trip with scientist guide, night snorkeling, relax" }
    ],
    faq: [
      { question: "What's the whale shark encounter success rate?", answer: "7 out of 10 encounters year-round, higher with research trips" },
      { question: "When are manta rays best?", answer: "May-November during southwest monsoon" },
      { question: "Are whale shark trips safe?", answer: "Yes, professional guides, snorkeling only, no touching" },
      { question: "What's accommodation like?", answer: "Budget guesthouses from $35/night, basic amenities" }
    ]
  },
  {
    name: "Gulhi",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "Exceptional snorkeling directly from shore, abundant marine life" },
      { title: "Scuba Diving", description: "Professional dive centers, various dive sites, good for all levels" },
      { title: "Island Exploration", description: "Authentic Maldivian culture, local shops and restaurants" },
      { title: "Beach Relaxation", description: "Pristine beaches, turquoise waters" },
      { title: "Dolphin Watching", description: "Spinner dolphins, evening cruises available" },
      { title: "Fishing Trips", description: "Night fishing with local fishermen" }
    ],
    attractions: [
      { name: "House Reef", description: "Exceptional snorkeling directly from shore" },
      { name: "Local Market", description: "Authentic Maldivian experience" },
      { name: "Island Beaches", description: "Pristine sandy beaches with turquoise waters" }
    ],
    foodCafes: [
      { name: "Local Restaurants", description: "Authentic Maldivian cuisine, fresh seafood" }
    ],
    bestTimeToVisit: "November-April (Dry Season)",
    quickFacts: [
      "Island Type: Local inhabited island",
      "Best For: Snorkelers, divers, culture enthusiasts",
      "Accommodation: Budget-friendly guesthouses",
      "House Reef: Exceptional snorkeling",
      "Main Language: Dhivehi, English widely spoken",
      "Closest to Male: Among nearest local islands",
      "Authentic Culture: Traditional Maldivian lifestyle",
      "Accessibility: Easy access from Male"
    ],
    threeDayItinerary: [
      { day: 1, activities: "Arrive and settle in, explore island, house reef snorkeling" },
      { day: 2, activities: "Full day diving or snorkeling, visit local market, try local restaurants" },
      { day: 3, activities: "Dolphin watching cruise, relax on beach, prepare for departure" }
    ],
    faq: [
      { question: "How far from Male?", answer: "Closest local island, very easy access" },
      { question: "What's the house reef like?", answer: "Exceptional snorkeling directly from shore, abundant marine life" },
      { question: "Are there dive centers?", answer: "Yes, professional PADI dive centers available" }
    ]
  },
  {
    name: "Goidhoo",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "Peaceful local island with excellent snorkeling" },
      { title: "Scuba Diving", description: "Professional dive centers, various dive sites" },
      { title: "Island Exploration", description: "Authentic local experience, traditional lifestyle" },
      { title: "Beach Relaxation", description: "Quiet beaches, peaceful atmosphere" }
    ],
    attractions: [
      { name: "House Reef", description: "Excellent snorkeling opportunities" },
      { name: "Local Island", description: "Authentic Maldivian community" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests" }
    ],
    bestTimeToVisit: "November-April (Dry Season)",
    quickFacts: [
      "Island Type: Local inhabited island",
      "Best For: Snorkelers, divers, budget travelers",
      "Atmosphere: Peaceful local island",
      "House Reef: Excellent snorkeling",
      "Main Language: Dhivehi, English widely spoken",
      "Accommodation: Budget-friendly guesthouses"
    ]
  },
  {
    name: "Fulhadhoo",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "Remote island with pristine snorkeling" },
      { title: "Scuba Diving", description: "Professional dive centers, various dive sites" },
      { title: "Island Exploration", description: "Remote local island experience" }
    ],
    attractions: [
      { name: "House Reef", description: "Pristine snorkeling opportunities" },
      { name: "Remote Island", description: "Authentic local experience" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests" }
    ],
    bestTimeToVisit: "November-April (Dry Season)",
    quickFacts: [
      "Island Type: Remote local island",
      "Best For: Snorkelers, divers, adventurers",
      "Atmosphere: Remote and peaceful",
      "House Reef: Pristine snorkeling",
      "Main Language: Dhivehi, English widely spoken"
    ]
  },
  {
    name: "Fehendhoo",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "Local island with good snorkeling" },
      { title: "Scuba Diving", description: "Professional dive centers available" },
      { title: "Island Exploration", description: "Authentic local island experience" }
    ],
    attractions: [
      { name: "House Reef", description: "Good snorkeling opportunities" },
      { name: "Local Island", description: "Authentic community" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests" }
    ],
    bestTimeToVisit: "November-April (Dry Season)",
    quickFacts: [
      "Island Type: Local inhabited island",
      "Best For: Snorkelers, divers, budget travelers",
      "House Reef: Good snorkeling",
      "Main Language: Dhivehi, English widely spoken"
    ]
  },
  {
    name: "Hanimadhoo",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "Northernmost local island with good snorkeling" },
      { title: "Scuba Diving", description: "Professional dive centers available" },
      { title: "Island Exploration", description: "Remote northern island experience" }
    ],
    attractions: [
      { name: "House Reef", description: "Good snorkeling opportunities" },
      { name: "Northern Island", description: "Remote location" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests" }
    ],
    bestTimeToVisit: "November-April (Dry Season)",
    quickFacts: [
      "Island Type: Northernmost local island",
      "Best For: Snorkelers, divers, adventurers",
      "House Reef: Good snorkeling",
      "Main Language: Dhivehi, English widely spoken"
    ]
  },
  {
    name: "Mathiveri",
    topThingsToDo: [
      { title: "House Reef Snorkeling", description: "Small intimate island with snorkeling" },
      { title: "Scuba Diving", description: "Professional dive centers available" },
      { title: "Island Exploration", description: "Small intimate local island" }
    ],
    attractions: [
      { name: "House Reef", description: "Snorkeling opportunities" },
      { name: "Small Island", description: "Intimate local experience" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests" }
    ],
    bestTimeToVisit: "November-April (Dry Season)",
    quickFacts: [
      "Island Type: Small local island",
      "Best For: Snorkelers, divers, couples",
      "Atmosphere: Small and intimate",
      "House Reef: Snorkeling available",
      "Main Language: Dhivehi, English widely spoken"
    ]
  },
  {
    name: "Fuvahmulah",
    topThingsToDo: [
      { title: "Tiger Shark Diving", description: "World's best tiger shark diving destination, year-round encounters" },
      { title: "Whale Shark Encounters", description: "Seasonal encounters, excellent snorkeling opportunities" },
      { title: "House Reef Diving", description: "Pristine reef with diverse marine life" },
      { title: "Lagoon Exploration", description: "Unique geological features and pristine waters" },
      { title: "Island Exploration", description: "Southernmost island with unique geography" }
    ],
    attractions: [
      { name: "Tiger Shark Diving Sites", description: "World-class tiger shark diving destination" },
      { name: "House Reef", description: "Pristine reef with diverse marine life" },
      { name: "Unique Lagoon", description: "Geological formations and pristine waters" }
    ],
    foodCafes: [
      { name: "Local Guesthouses", description: "Serve meals for guests" }
    ],
    bestTimeToVisit: "Year-round for tiger sharks",
    quickFacts: [
      "Island Type: Southernmost local island",
      "Best For: Advanced divers, shark enthusiasts",
      "Tiger Sharks: Year-round encounters",
      "Unique Features: Geological formations",
      "Main Language: Dhivehi, English widely spoken",
      "Accommodation: Budget-friendly guesthouses",
      "Diving: Professional dive centers available"
    ],
    threeDayItinerary: [
      { day: 1, activities: "Arrive and settle in, explore island, house reef diving" },
      { day: 2, activities: "Tiger shark diving expedition, afternoon relaxation" },
      { day: 3, activities: "Whale shark snorkeling or additional diving, prepare for departure" }
    ],
    faq: [
      { question: "Is tiger shark diving safe?", answer: "Yes, professional guides, advanced divers only" },
      { question: "What's the best time for tiger sharks?", answer: "Year-round encounters available" },
      { question: "Are whale sharks present?", answer: "Yes, seasonal encounters available" }
    ]
  }
];

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      ...dbConfig,
      ssl: {},
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });
    console.log('✓ Connected to database');

    console.log('\n🏝️  Updating island guides with comprehensive content...');
    
    for (const guide of islandGuides) {
      const query = `
        UPDATE island_guides 
        SET 
          topThingsToDo = ?,
          attractions = ?,
          foodCafes = ?,
          bestTimeToVisit = ?,
          quickFacts = ?,
          speedboatInfo = ?,
          ferryInfo = ?,
          threeDayItinerary = ?,
          faq = ?,
          published = 1
        WHERE name = ?
      `;

      const values = [
        JSON.stringify(guide.topThingsToDo || []),
        JSON.stringify(guide.attractions || []),
        JSON.stringify(guide.foodCafes || []),
        guide.bestTimeToVisit || null,
        JSON.stringify(guide.quickFacts || []),
        guide.speedboatInfo || null,
        guide.ferryInfo || null,
        JSON.stringify(guide.threeDayItinerary || []),
        JSON.stringify(guide.faq || []),
        guide.name
      ];

      await connection.execute(query, values);
      console.log(`  ✓ Updated guide: ${guide.name}`);
    }

    console.log('\n✅ Island guides updated successfully!');
    console.log(`   - ${islandGuides.length} island guides updated with comprehensive content`);

  } catch (error) {
    console.error('❌ Error updating guides:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the seed function
seedDatabase();
