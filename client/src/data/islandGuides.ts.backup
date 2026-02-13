export interface IslandGuide {
  id: string;
  name: string;
  atoll: string;
  overview: string;
  quickFacts: string[];
  howToGetThere: {
    flight: string;
    speedboat: string;
    ferry: string;
  };
  topThingsToDo: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  snorkelingGuide: {
    bestSpots: string[];
    difficulty: string;
    seasonalTips: string;
    safetyTips: string[];
  };
  divingGuide: {
    bestSites: string[];
    difficulty: string;
    depthRange: string;
    seasonalTips: string;
    safetyTips: string[];
  };
  surfWatersports: {
    available: boolean;
    spots: string[];
    bestSeason: string;
    rentals: string;
  };
  sandbankDolphinTrips: {
    description: string;
    bestTime: string;
    duration: string;
    price: string;
    tips: string[];
  };
  beachesLocalRules: {
    beaches: Array<{
      name: string;
      description: string;
      rules: string[];
    }>;
    culturalTips: string[];
    safetyTips: string[];
  };
  foodCafes: Array<{
    name: string;
    type: string;
    cuisine: string;
    priceRange: string;
    highlights: string[];
  }>;
  practicalInfo: {
    currency: string;
    language: string;
    bestTimeToVisit: string;
    whatToPack: string[];
    healthTips: string[];
    emergencyContacts: string[];
  };
  itineraries: {
    threeDays: Array<{
      day: number;
      activities: string[];
      meals: string[];
      notes: string;
    }>;
    fiveDays: Array<{
      day: number;
      activities: string[];
      meals: string[];
      notes: string;
    }>;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}

export const ISLAND_GUIDES: IslandGuide[] = [
  {
    id: "male-guide",
    name: "Malé City",
    atoll: "Kaafu",
    overview:
      "Malé, the vibrant capital of the Maldives, is a bustling island city where modern development meets rich cultural heritage. Despite its small size of just 1.8 square kilometers, Malé pulses with energy, colorful buildings, and a fascinating blend of Indian, Arab, and Southeast Asian influences. The city serves as the gateway to the islands and offers visitors a glimpse into authentic Maldivian life beyond the resort experience. From the iconic Friday Mosque to the lively fish markets, Malé provides an immersive cultural experience that shouldn't be missed when visiting the Maldives.",
    quickFacts: [
      "Population: ~103,000 (about 30% of Maldives total)",
      "Area: 1.8 square kilometers (smallest capital by area)",
      "Language: Dhivehi (English widely spoken)",
      "Currency: Maldivian Rufiyaa (MVR)",
      "Best time to visit: November to April (dry season)",
      "Time zone: GMT+5",
      "Visa: 30 days visa-free for most nationalities",
      "Airport: Velana International Airport (15 minutes by speedboat)",
    ],
    howToGetThere: {
      flight: "Most international flights arrive at Velana International Airport (MLE), located on Hulhulé Island, 15 minutes from Malé by speedboat or 30 minutes by ferry.",
      speedboat:
        "Speedboats depart every 30 minutes from the airport to Malé City. Journey takes 15-20 minutes. Cost: $15-20 USD per person.",
      ferry:
        "Public ferries available from airport to Malé. Journey takes 30-45 minutes. Cost: $2-3 USD per person. Slower but most economical option.",
    },
    topThingsToDo: [
      {
        title: "Friday Mosque (Hukuru Miskiy)",
        description:
          "Built in 1656, this stunning mosque features intricate Islamic architecture and beautiful coral stone carvings. Non-Muslims can view from outside during non-prayer times.",
        icon: "🕌",
      },
      {
        title: "National Centre of Linguistic & Historical Studies",
        description:
          "Explore Maldivian history, culture, and language through exhibits and artifacts. Learn about the ancient Maldivian script and maritime heritage.",
        icon: "📚",
      },
      {
        title: "Male Fish Market",
        description:
          "Experience authentic local life at this vibrant market. Watch fishermen unload their catch, sample fresh seafood, and interact with locals. Best visited early morning.",
        icon: "🐟",
      },
      {
        title: "Artificial Beach",
        description:
          "A man-made sandy beach perfect for swimming and relaxing. Great for sunset views and people-watching. Free entry.",
        icon: "🏖️",
      },
      {
        title: "Male City Walking Tour",
        description:
          "Stroll through colorful streets, visit local shops, and discover hidden cafés. The city is very walkable and compact, perfect for exploring on foot.",
        icon: "🚶",
      },
      {
        title: "Maldives National University",
        description:
          "Beautiful campus with modern architecture. Open for visitors during non-academic hours. Great for photography.",
        icon: "🏫",
      },
      {
        title: "Local Restaurants & Street Food",
        description:
          "Try authentic Maldivian cuisine at local eateries. Must-try: garudhiya (fish soup), mas huni (tuna salad), and fihunu mas (grilled fish).",
        icon: "🍜",
      },
      {
        title: "Sunset at the Harbour",
        description:
          "Watch traditional dhoni boats return at sunset. Perfect photo opportunity and peaceful end to the day.",
        icon: "🌅",
      },
      {
        title: "Maldives Islamic Centre",
        description:
          "Modern architectural marvel with beautiful Islamic design. Visitors welcome outside prayer times. Impressive interior and exterior.",
        icon: "✨",
      },
      {
        title: "Local Shopping",
        description:
          "Browse local crafts, souvenirs, and traditional items at local shops. Avoid tourist-oriented shops for authentic experiences and better prices.",
        icon: "🛍️",
      },
    ],
    snorkelingGuide: {
      bestSpots: [
        "Artificial Beach - Easy access, good for beginners",
        "Harbour area - Colorful reef fish and coral",
        "Nearby islands - Short speedboat ride to pristine reefs",
      ],
      difficulty: "Easy to Moderate",
      seasonalTips:
        "Best from November to April. Avoid monsoon season (May-October) when visibility is reduced.",
      safetyTips: [
        "Always snorkel with a buddy",
        "Wear reef-safe sunscreen",
        "Respect marine life - do not touch corals",
        "Be aware of boat traffic in harbour areas",
        "Check weather conditions before going out",
      ],
    },
    divingGuide: {
      bestSites: [
        "Artificial Reef - Beginner-friendly with good marine life",
        "Local dive sites - 15-30 minutes by boat",
        "Banana Reef - Popular site with diverse fish species",
      ],
      difficulty: "Easy to Intermediate",
      depthRange: "5-30 meters",
      seasonalTips:
        "Dry season (Nov-Apr) offers best visibility. Wet season still diveable but with reduced visibility.",
      safetyTips: [
        "Dive with certified operators only",
        "Check your equipment thoroughly",
        "Follow dive master instructions",
        "Ascend slowly and make safety stops",
        "Stay within your certification limits",
      ],
    },
    surfWatersports: {
      available: true,
      spots: ["Artificial Beach - Occasional small waves", "Nearby breaks - Speedboat accessible"],
      bestSeason: "March to October (monsoon swells)",
      rentals:
        "Limited rentals in Malé. Most water sports available through resorts. Recommend pre-booking.",
    },
    sandbankDolphinTrips: {
      description:
        "Embark on a magical journey to nearby sandbars where you can relax on pristine white sand surrounded by turquoise waters. Dolphin spotting trips depart early morning for best sightings.",
      bestTime: "Early morning (5:00-7:00 AM) for dolphin sightings",
      duration: "4-6 hours",
      price: "$80-150 USD per person",
      tips: [
        "Book through reputable operators",
        "Bring binoculars for better dolphin viewing",
        "Wear reef-safe sunscreen",
        "Bring a light jacket for early morning",
        "Respect dolphins - maintain distance and do not feed",
      ],
    },
    beachesLocalRules: {
      beaches: [
        {
          name: "Artificial Beach",
          description:
            "Man-made sandy beach in the heart of Malé. Popular with locals and visitors. Good facilities.",
          rules: [
            "No alcohol consumption",
            "Modest swimwear recommended",
            "Respect prayer times",
            "No loud music or disturbances",
          ],
        },
        {
          name: "Local Island Beaches",
          description:
            "Nearby inhabited islands have beaches accessible by short boat ride. More authentic experience.",
          rules: [
            "Ask permission before entering local islands",
            "Respect local customs and privacy",
            "No photography without consent",
            "Follow local guidelines",
          ],
        },
      ],
      culturalTips: [
        "Maldives is a Muslim country - dress modestly outside resorts",
        "Remove shoes when entering mosques and homes",
        "Avoid public displays of affection",
        "Learn basic Dhivehi greetings - locals appreciate the effort",
        "Respect prayer times - some businesses may close",
      ],
      safetyTips: [
        "Malé is generally safe, but avoid isolated areas at night",
        "Keep valuables secure",
        "Use registered taxis or ride-sharing apps",
        "Stay aware of your surroundings",
        "Travel in groups when possible",
      ],
    },
    foodCafes: [
      {
        name: "Café de Malé",
        type: "Local Café",
        cuisine: "Maldivian, International",
        priceRange: "$5-15 USD",
        highlights: ["Garudhiya", "Mas Huni", "Fresh juices"],
      },
      {
        name: "Octopus Restaurant",
        type: "Fine Dining",
        cuisine: "Seafood, International",
        priceRange: "$20-50 USD",
        highlights: ["Fresh catch daily", "Ocean views", "Professional service"],
      },
      {
        name: "Local Market Food Stalls",
        type: "Street Food",
        cuisine: "Maldivian",
        priceRange: "$2-5 USD",
        highlights: ["Authentic experience", "Budget-friendly", "Try local specialties"],
      },
      {
        name: "Seagull Café House",
        type: "Café",
        cuisine: "Coffee, Pastries, Light meals",
        priceRange: "$3-10 USD",
        highlights: ["Great coffee", "Local vibe", "Affordable"],
      },
      {
        name: "Jade Café",
        type: "Asian Fusion",
        cuisine: "Thai, Chinese, Maldivian",
        priceRange: "$8-20 USD",
        highlights: ["Diverse menu", "Good value", "Popular with locals"],
      },
    ],
    practicalInfo: {
      currency: "Maldivian Rufiyaa (MVR). 1 USD ≈ 15-16 MVR. USD widely accepted.",
      language:
        "Dhivehi is the official language. English widely spoken in tourism areas. Learning basic phrases appreciated.",
      bestTimeToVisit:
        "November to April (dry season) - sunny, calm seas. May-October is wet season with monsoons.",
      whatToPack: [
        "Reef-safe sunscreen (SPF 50+)",
        "Light, breathable clothing",
        "Modest clothing for cultural sites",
        "Snorkel gear (optional)",
        "Hat and sunglasses",
        "Medications and first-aid kit",
        "Power adapter (Type G - UK style)",
        "Waterproof bag for electronics",
      ],
      healthTips: [
        "Drink plenty of water - stay hydrated",
        "Use high SPF sunscreen - sun is intense",
        "Mosquitoes present - consider repellent",
        "Medical facilities available in Malé",
        "Travel insurance recommended",
        "Vaccinations - check requirements before travel",
      ],
      emergencyContacts: [
        "Police: 119",
        "Ambulance: 102",
        "Fire: 118",
        "Tourist Police: +960 330-3222",
        "Embassy contacts available at your accommodation",
      ],
    },
    itineraries: {
      threeDays: [
        {
          day: 1,
          activities: [
            "Arrive at airport, transfer to Malé",
            "Check-in and rest",
            "Evening: Explore Artificial Beach",
            "Sunset at harbour",
            "Dinner at local restaurant",
          ],
          meals: ["Lunch: Airport", "Dinner: Local restaurant"],
          notes:
            "Acclimatize and recover from travel. Take it easy and enjoy the sunset.",
        },
        {
          day: 2,
          activities: [
            "Early morning: Fish market visit",
            "Breakfast at local café",
            "Morning: Friday Mosque and city walking tour",
            "Lunch: Local eatery",
            "Afternoon: National Centre of Linguistic & Historical Studies",
            "Evening: Shopping and street food exploration",
          ],
          meals: [
            "Breakfast: Local café",
            "Lunch: Local restaurant",
            "Dinner: Street food or café",
          ],
          notes:
            "Immerse yourself in local culture. Wear modest clothing. Respect prayer times.",
        },
        {
          day: 3,
          activities: [
            "Morning: Snorkeling or dolphin trip (optional)",
            "Lunch: Waterfront restaurant",
            "Afternoon: Last-minute shopping or relaxation",
            "Evening: Sunset at Artificial Beach",
            "Dinner and departure preparations",
          ],
          meals: ["Breakfast: Hotel", "Lunch: Waterfront", "Dinner: Your choice"],
          notes:
            "Flexible day. Can add water activities or relax before departure.",
        },
      ],
      fiveDays: [
        {
          day: 1,
          activities: [
            "Arrive and transfer to Malé",
            "Check-in and rest",
            "Evening: Explore Artificial Beach",
            "Sunset at harbour",
          ],
          meals: ["Lunch: Airport", "Dinner: Local restaurant"],
          notes: "Arrival and acclimatization day.",
        },
        {
          day: 2,
          activities: [
            "Early morning: Fish market visit",
            "Breakfast at local café",
            "Morning: Friday Mosque and Islamic Centre",
            "Lunch: Local restaurant",
            "Afternoon: National Centre of Linguistic & Historical Studies",
            "Evening: City walking tour",
          ],
          meals: [
            "Breakfast: Local café",
            "Lunch: Local restaurant",
            "Dinner: Fine dining",
          ],
          notes: "Deep dive into Maldivian culture and history.",
        },
        {
          day: 3,
          activities: [
            "Full day: Dolphin and sandbank trip",
            "Snorkeling at sandbanks",
            "Lunch on sandbank",
            "Dolphin spotting",
            "Return to Malé in evening",
          ],
          meals: ["Breakfast: Hotel", "Lunch: On boat", "Dinner: Local restaurant"],
          notes:
            "Magical day on the water. Book in advance. Bring camera and sunscreen.",
        },
        {
          day: 4,
          activities: [
            "Morning: Relaxation at Artificial Beach",
            "Lunch: Café",
            "Afternoon: Local island visit (if available)",
            "Evening: Shopping and souvenirs",
            "Sunset dinner cruise (optional)",
          ],
          meals: [
            "Breakfast: Hotel",
            "Lunch: Café",
            "Dinner: Dinner cruise or restaurant",
          ],
          notes: "Flexible day. Mix relaxation with optional activities.",
        },
        {
          day: 5,
          activities: [
            "Morning: Last-minute sightseeing or shopping",
            "Lunch: Favorite restaurant",
            "Afternoon: Prepare for departure",
            "Evening: Transfer to airport",
          ],
          meals: ["Breakfast: Hotel", "Lunch: Restaurant", "Dinner: Airport"],
          notes: "Departure day. Allow time for airport transfer.",
        },
      ],
    },
    faq: [
      {
        question: "Is Malé safe for tourists?",
        answer:
          "Yes, Malé is generally safe for tourists. It's a well-developed capital city with good infrastructure. However, like any city, avoid isolated areas at night, keep valuables secure, and stay aware of your surroundings. The tourist police are helpful and responsive.",
      },
      {
        question: "How long should I spend in Malé?",
        answer:
          "Most visitors spend 1-2 days in Malé before heading to island resorts. However, if you're interested in culture and local life, 3-5 days allows for a deeper experience. The city is compact and walkable, so you can see main attractions in 1-2 days.",
      },
      {
        question: "What's the best way to get around Malé?",
        answer:
          "Malé is very walkable and compact (1.8 km²). For longer distances, use registered taxis or ride-sharing apps like Uber. Avoid unmarked taxis. Ferries connect to nearby islands. Most attractions are within walking distance.",
      },
      {
        question: "Can I drink alcohol in Malé?",
        answer:
          "Alcohol is not sold in Malé or other inhabited islands due to Islamic law. However, it's available in resorts and tourist areas. Drinking alcohol in public places is illegal and disrespectful. Respect local customs.",
      },
      {
        question: "What should I wear in Malé?",
        answer:
          "Dress modestly outside resorts. Women should cover shoulders and knees. Men should wear shirts. Swimwear is only for beaches. Respect local culture, especially when visiting religious sites. Modest dress shows respect for Maldivian traditions.",
      },
      {
        question: "Is it easy to find vegetarian food in Malé?",
        answer:
          "Vegetarian options are available but limited compared to Western countries. Many restaurants can prepare vegetarian meals if requested. Local markets have fresh fruits and vegetables. International restaurants offer more vegetarian choices. Inform restaurants in advance for better options.",
      },
    ],
    coordinates: {
      latitude: 4.1755,
      longitude: 73.5093,
    },
    images: [
      "/images/male-mosque.jpg",
      "/images/male-harbor.jpg",
      "/images/male-street.jpg",
      "/images/male-beach.jpg",
    ],
  },
];

export function getIslandGuide(islandId: string): IslandGuide | undefined {
  return ISLAND_GUIDES.find((guide) => guide.id === islandId);
}

export function getAllIslandGuides(): IslandGuide[] {
  return ISLAND_GUIDES;
}

export function searchIslandGuides(query: string): IslandGuide[] {
  const lowerQuery = query.toLowerCase();
  return ISLAND_GUIDES.filter(
    (guide) =>
      guide.name.toLowerCase().includes(lowerQuery) ||
      guide.atoll.toLowerCase().includes(lowerQuery) ||
      guide.overview.toLowerCase().includes(lowerQuery)
  );
}
