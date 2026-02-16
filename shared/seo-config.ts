/**
 * SEO Configuration for Isle Nomads Holidays
 * Centralized SEO metadata for all pages
 */

export const SEO_CONFIG = {
  home: {
    title: "Maldives Luxury Vacations | Isle Nomads Travel Specialist",
    description:
      "Discover luxury Maldives vacations with Isle Nomads. Expert travel planning, premium resorts, island hopping, and unforgettable island experiences. Book your dream vacation today.",
    keywords:
      "Maldives vacations, luxury travel, island resorts, Maldives holidays, travel specialist, Maldives packages, island hopping",
    ogTitle: "Maldives Luxury Vacations | Isle Nomads Travel Specialist",
    ogDescription:
      "Discover luxury Maldives vacations with Isle Nomads. Expert travel planning, premium resorts, and unforgettable island experiences.",
  },
  about: {
    title: "About Isle Nomads | Maldives Travel Specialists",
    description:
      "Learn about Isle Nomads, a trusted Maldives travel specialist with 15+ years of experience. Discover our mission, values, and expert team dedicated to creating unforgettable island vacations.",
    keywords:
      "Isle Nomads, Maldives travel specialist, luxury travel company, island vacation experts, Maldives tourism",
    ogTitle: "About Isle Nomads | Maldives Travel Specialists",
    ogDescription:
      "Learn about Isle Nomads, a trusted Maldives travel specialist with 15+ years of experience in luxury island vacations.",
  },
  packages: {
    title: "Maldives Vacation Packages | Isle Nomads",
    description:
      "Explore premium Maldives vacation packages from Isle Nomads. Romantic escapes, family adventures, diving expeditions, and luxury island experiences. Customize your perfect Maldives getaway.",
    keywords:
      "Maldives packages, vacation packages, island packages, Maldives deals, luxury packages, family vacation packages",
    ogTitle: "Maldives Vacation Packages | Isle Nomads",
    ogDescription:
      "Explore premium Maldives vacation packages. Romantic escapes, family adventures, diving expeditions, and luxury island experiences.",
  },
  exploreMaldives: {
    title: "Explore Maldives | Islands, Atolls & Destinations | Isle Nomads",
    description:
      "Explore the Maldives with Isle Nomads. Discover 129+ islands, 20 atolls, luxury resorts, dive sites, and surf spots. Interactive maps and detailed island guides for your perfect vacation.",
    keywords:
      "Maldives islands, Maldives atolls, Maldives destinations, island guides, Maldives map, Maldives resorts, dive sites",
    ogTitle: "Explore Maldives | Islands, Atolls & Destinations | Isle Nomads",
    ogDescription:
      "Explore the Maldives with Isle Nomads. Discover 129+ islands, 20 atolls, luxury resorts, dive sites, and surf spots.",
  },
  map: {
    title: "Interactive Maldives Map | Islands, Resorts & Activities | Isle Nomads",
    description:
      "Interactive map of the Maldives showing islands, resorts, dive sites, surf spots, and activities. Plan your island adventure with detailed location information and booking options.",
    keywords:
      "Maldives map, interactive map, island locations, resort locations, dive sites map, surf spots, Maldives geography",
    ogTitle: "Interactive Maldives Map | Islands, Resorts & Activities | Isle Nomads",
    ogDescription:
      "Interactive map of the Maldives showing islands, resorts, dive sites, surf spots, and activities for your perfect vacation.",
  },
  tripPlanner: {
    title: "Maldives Trip Planner | Custom Itineraries | Isle Nomads",
    description:
      "Plan your perfect Maldives trip with Isle Nomads AI-powered trip planner. Create custom itineraries, explore island hopping routes, and get personalized recommendations for your vacation.",
    keywords:
      "Maldives trip planner, itinerary planner, island hopping, vacation planner, travel planning, Maldives itinerary",
    ogTitle: "Maldives Trip Planner | Custom Itineraries | Isle Nomads",
    ogDescription:
      "Plan your perfect Maldives trip with Isle Nomads AI-powered trip planner. Create custom itineraries and island hopping routes.",
  },
  blog: {
    title: "Maldives Travel Blog | Tips, Guides & Stories | Isle Nomads",
    description:
      "Read the latest Maldives travel blog posts from Isle Nomads. Get expert tips, destination guides, travel stories, and insider advice for planning your Maldives vacation.",
    keywords:
      "Maldives blog, travel blog, Maldives tips, travel guides, destination guides, travel stories, Maldives advice",
    ogTitle: "Maldives Travel Blog | Tips, Guides & Stories | Isle Nomads",
    ogDescription:
      "Read the latest Maldives travel blog posts from Isle Nomads. Get expert tips, destination guides, and travel stories.",
  },
  boatRoutes: {
    title: "Maldives Boat Routes & Ferry Schedules | Isle Nomads",
    description:
      "Explore Maldives boat routes, ferry schedules, and speedboat transfers. Find transportation options between islands, atolls, and airports with detailed pricing and timing information.",
    keywords:
      "Maldives boat routes, ferry schedules, speedboat transfers, island transportation, ferry times, boat schedules",
    ogTitle: "Maldives Boat Routes & Ferry Schedules | Isle Nomads",
    ogDescription:
      "Explore Maldives boat routes, ferry schedules, and speedboat transfers between islands and atolls.",
  },
  islandGuides: {
    title: "Maldives Island Guides | Detailed Island Information | Isle Nomads",
    description:
      "Comprehensive Maldives island guides with detailed information about 129+ islands. Activities, dining, transportation, accommodations, and travel tips for each island.",
    keywords:
      "Maldives island guides, island information, island activities, island dining, island travel, island guides",
    ogTitle: "Maldives Island Guides | Detailed Island Information | Isle Nomads",
    ogDescription:
      "Comprehensive Maldives island guides with detailed information about 129+ islands, activities, dining, and travel tips.",
  },
  atolls: {
    title: "Maldives Atolls | 20 Atoll Guides & Information | Isle Nomads",
    description:
      "Explore all 20 Maldives atolls with Isle Nomads. Detailed atoll guides, island lists, resort information, and travel recommendations for each atoll.",
    keywords:
      "Maldives atolls, atoll guides, atoll information, atoll islands, atoll resorts, Maldives geography",
    ogTitle: "Maldives Atolls | 20 Atoll Guides & Information | Isle Nomads",
    ogDescription:
      "Explore all 20 Maldives atolls with detailed guides, island lists, resort information, and travel recommendations.",
  },
};

/**
 * Get SEO config for a specific page
 */
export function getSeoConfig(page: keyof typeof SEO_CONFIG) {
  return SEO_CONFIG[page] || SEO_CONFIG.home;
}

/**
 * Common keywords for all pages
 */
export const COMMON_KEYWORDS = [
  "Maldives",
  "luxury travel",
  "island vacation",
  "travel specialist",
  "Maldives tourism",
  "island resort",
  "tropical vacation",
  "water sports",
  "diving",
  "snorkeling",
];

/**
 * Local business information
 */
export const LOCAL_BUSINESS_INFO = {
  name: "Isle Nomads",
  description: "Luxury Maldives travel specialist offering premium vacation packages and personalized island experiences",
  address: {
    streetAddress: "Malé",
    addressLocality: "Malé",
    postalCode: "20026",
    addressCountry: "MV",
  },
  telephone: "+960-799-0636",
  email: "hello@islenomads.com",
  url: "https://islenomads.com",
  socialProfiles: [
    "https://www.facebook.com/islenomads",
    "https://www.instagram.com/islenomads",
    "https://www.twitter.com/islenomads",
  ],
};
