import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Info, Waves, Anchor, Building2, Palmtree, BookOpen, Star, Clock, Utensils, Activity, Calendar } from "lucide-react";
import { Link } from "wouter";
import { getDestinationInfo } from "@/utils/destinationInfo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LocationDetailPanel from "@/components/LocationDetailPanel";

// Maldives popular locations data
const MALDIVES_LOCATIONS = [
  {
    id: 1,
    name: "Malé City",
    type: "Capital",
    lat: 4.1748,
    lng: 73.5082,
    description: "The capital city of Maldives, gateway to the islands",
    highlights: ["National Museum", "Grand Friday Mosque", "Local Markets"],
    image: "/images/male-city.jpg",
  },
  {
    id: 2,
    name: "North Malé Atoll",
    type: "Atoll",
    lat: 4.3,
    lng: 73.5,
    description: "Popular atoll with luxury resorts and pristine beaches",
    highlights: ["Crystal Clear Waters", "Coral Reefs", "Water Sports"],
    image: "/images/north-male-atoll.jpg",
  },
  {
    id: 3,
    name: "South Malé Atoll",
    type: "Atoll",
    lat: 3.9,
    lng: 73.5,
    description: "Serene atoll with exclusive resorts and calm lagoons",
    highlights: ["Luxury Resorts", "Calm Lagoons", "Diving Spots"],
    image: "/images/south-male-atoll.jpg",
  },
  {
    id: 4,
    name: "Ari Atoll",
    type: "Atoll",
    lat: 4.2,
    lng: 72.8,
    description: "Famous for manta rays and whale sharks",
    highlights: ["Manta Ray Spotting", "Whale Sharks", "House Reef Diving"],
    image: "/images/ari-atoll.jpg",
  },
  {
    id: 5,
    name: "Baa Atoll",
    type: "Atoll",
    lat: 5.2,
    lng: 73.3,
    description: "UNESCO Biosphere Reserve with exceptional marine life",
    highlights: ["Hanifaru Bay", "Manta Rays", "Snorkeling"],
    image: "/images/baa-atoll.jpg",
  },
  {
    id: 6,
    name: "Vaavu Atoll",
    type: "Atoll",
    lat: 3.6,
    lng: 73.0,
    description: "Pristine diving destination with minimal crowds",
    highlights: ["Pristine Reefs", "Wreck Diving", "Shark Encounters"],
    image: "/images/vaavu-atoll.jpg",
  },
  {
    id: 7,
    name: "Meemu Atoll",
    type: "Atoll",
    lat: 3.2,
    lng: 72.9,
    description: "Tranquil atoll perfect for relaxation and diving",
    highlights: ["Quiet Beaches", "Excellent Diving", "Local Culture"],
    image: "/images/meemu-atoll.jpg",
  },
  {
    id: 8,
    name: "Addu Atoll",
    type: "Atoll",
    lat: 0.6,
    lng: 73.2,
    description: "Southernmost atoll with unique history and charm",
    highlights: ["Historical Sites", "Beautiful Lagoons", "Local Islands"],
    image: "/images/addu-atoll.jpg",
  },
  {
    id: 9,
    name: "Thiladhunmathi Atoll",
    type: "Atoll",
    lat: 6.0,
    lng: 73.2,
    description: "Northern atoll with exclusive resorts and pristine reefs",
    highlights: ["Exclusive Resorts", "Pristine Reefs", "Water Activities"],
    image: "/images/thiladhunmathi-atoll.jpg",
  },
  {
    id: 10,
    name: "Haa Alifu Atoll",
    type: "Atoll",
    lat: 6.8,
    lng: 73.0,
    description: "Northernmost atoll with untouched beauty",
    highlights: ["Untouched Beaches", "Rare Marine Life", "Adventure"],
    image: "/images/haa-alifu-atoll.jpg",
  },
];

// Popular Islands Data
const POPULAR_ISLANDS = [
  {
    id: "island-1",
    name: "Maafushi Island",
    type: "Island",
    lat: 4.25,
    lng: 73.42,
    category: "Local Island",
    slug: "maafushi",
    description: "Popular local island with budget-friendly guesthouses and vibrant culture",
    highlights: ["Local Atmosphere", "Budget Friendly", "Beach Bars", "Water Sports"],
    population: "~2000",
    rating: 4.4,
  },
  {
    id: "island-2",
    name: "Thoddoo Island",
    type: "Island",
    lat: 5.3,
    lng: 73.4,
    category: "Local Island",
    slug: "thoddoo",
    description: "Authentic local island known for agriculture and traditional culture",
    highlights: ["Watermelon Farms", "Local Markets", "Fishing Village", "Authentic Experience"],
    population: "~1500",
    rating: 4.3,
  },
  {
    id: "island-3",
    name: "Guraidhoo Island",
    type: "Island",
    lat: 3.95,
    lng: 73.52,
    category: "Local Island",
    slug: "guraidhoo",
    description: "Charming local island with excellent house reefs and friendly locals",
    highlights: ["House Reef Diving", "Local Restaurants", "Fishing Culture", "Peaceful"],
    population: "~800",
    rating: 4.5,
  },
  {
    id: "island-4",
    name: "Thulusdhoo Island",
    type: "Island",
    lat: 4.35,
    lng: 73.55,
    category: "Local Island",
    slug: "thulusdhoo",
    description: "Laid-back island famous for surfing and relaxed beach culture",
    highlights: ["Surf Breaks", "Beach Vibes", "Local Cafes", "Yoga Retreats"],
    population: "~1200",
    rating: 4.6,
  },
  {
    id: "island-5",
    name: "Kandooma Island",
    type: "Island",
    lat: 3.88,
    lng: 73.52,
    category: "Local Island",
    slug: "kandooma",
    description: "Scenic island with beautiful beaches and excellent diving spots",
    highlights: ["Scenic Beaches", "Dive Sites", "Snorkeling", "Island Hopping"],
    population: "~600",
    rating: 4.4,
  },
];

// Luxury Resorts Data
const LUXURY_RESORTS = [
  {
    id: "resort-1",
    name: "Soneva Jani",
    type: "Resort",
    lat: 4.25,
    lng: 73.35,
    category: "Ultra-Luxury",
    price: "$$$$$",
    description: "Iconic ultra-luxury resort with glass villas and private pools",
    amenities: ["Glass Villas", "Underwater Spa", "Private Pool", "Michelin-starred Dining"],
    rating: 4.9,
    pricePerNight: "$1500+",
  },
  {
    id: "resort-2",
    name: "The Muraka",
    type: "Resort",
    lat: 4.28,
    lng: 73.38,
    category: "Ultra-Luxury",
    price: "$$$$$",
    description: "Exclusive underwater villa experience with panoramic ocean views",
    amenities: ["Underwater Bedroom", "Private Yacht", "Infinity Pool", "Fine Dining"],
    rating: 4.9,
    pricePerNight: "$1800+",
  },
  {
    id: "resort-3",
    name: "Baros Maldives",
    type: "Resort",
    lat: 4.32,
    lng: 73.48,
    category: "Luxury",
    price: "$$$$",
    description: "Elegant luxury resort with pristine beaches and world-class diving",
    amenities: ["Overwater Villas", "Spa", "Fine Dining", "Diving Center"],
    rating: 4.8,
    pricePerNight: "$800-1200",
  },
  {
    id: "resort-4",
    name: "Angsana Ihuru",
    type: "Resort",
    lat: 4.35,
    lng: 73.52,
    category: "Mid-Range",
    price: "$$$",
    description: "Comfortable mid-range resort with excellent value and friendly service",
    amenities: ["Beach Villas", "Restaurant", "Snorkeling", "Water Sports"],
    rating: 4.5,
    pricePerNight: "$400-600",
  },
  {
    id: "resort-5",
    name: "Adaaran Select Meedhupparu",
    type: "Resort",
    lat: 5.15,
    lng: 73.28,
    category: "Luxury",
    price: "$$$$",
    description: "All-inclusive luxury resort in Baa Atoll with exceptional diving",
    amenities: ["All-Inclusive", "House Reef", "Spa", "Diving Packages"],
    rating: 4.7,
    pricePerNight: "$600-900",
  },
  {
    id: "resort-6",
    name: "Vakaaru Island Resort",
    type: "Resort",
    lat: 3.92,
    lng: 73.45,
    category: "Mid-Range",
    price: "$$$",
    description: "Boutique resort with personalized service and intimate atmosphere",
    amenities: ["Beach Villas", "Spa", "Restaurant", "Water Activities"],
    rating: 4.6,
    pricePerNight: "$500-700",
  },
  {
    id: "resort-7",
    name: "Kurumba Maldives",
    type: "Resort",
    lat: 4.38,
    lng: 73.52,
    category: "Luxury",
    price: "$$$$",
    description: "Iconic resort close to Malé with excellent facilities and service",
    amenities: ["Overwater Villas", "Spa", "Multiple Restaurants", "Watersports"],
    rating: 4.7,
    pricePerNight: "$700-1000",
  },
  {
    id: "resort-8",
    name: "Coco Bodu Hithi",
    type: "Resort",
    lat: 4.42,
    lng: 73.55,
    category: "Luxury",
    price: "$$$$",
    description: "Stylish luxury resort with contemporary design and excellent dining",
    amenities: ["Modern Villas", "Spa", "Fine Dining", "Diving"],
    rating: 4.8,
    pricePerNight: "$900-1300",
  },
];

// Dive Points Data
const DIVE_POINTS = [
  {
    id: "dive-1",
    name: "Banana Reef",
    type: "Dive Point",
    lat: 4.25,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "5-30m",
    description: "Iconic reef with excellent coral formations and tropical fish",
    highlights: ["Coral Gardens", "Reef Sharks", "Groupers"],
    rating: 4.8,
  },
  {
    id: "dive-2",
    name: "Maaya Thila",
    type: "Dive Point",
    lat: 4.28,
    lng: 73.48,
    difficulty: "Advanced",
    depth: "10-40m",
    description: "Dramatic underwater mountain with strong currents and large pelagics",
    highlights: ["Pelagic Fish", "Sharks", "Eagle Rays"],
    rating: 4.9,
  },
  {
    id: "dive-3",
    name: "Miyaru Kandu",
    type: "Dive Point",
    lat: 4.35,
    lng: 73.45,
    difficulty: "Advanced",
    depth: "15-40m",
    description: "Channel dive with strong currents and abundant marine life",
    highlights: ["Manta Rays", "Snappers", "Trevally"],
    rating: 4.7,
  },
  {
    id: "dive-4",
    name: "Hanifaru Bay",
    type: "Dive Point",
    lat: 5.25,
    lng: 73.32,
    difficulty: "Beginner",
    depth: "3-20m",
    description: "UNESCO site famous for manta ray aggregations",
    highlights: ["Manta Rays", "Whale Sharks", "Snorkeling"],
    rating: 4.9,
  },
  {
    id: "dive-5",
    name: "Fotteyo Kandu",
    type: "Dive Point",
    lat: 4.18,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "8-35m",
    description: "Channel with excellent visibility and diverse marine life",
    highlights: ["Reef Fish", "Rays", "Octopus"],
    rating: 4.6,
  },
  {
    id: "dive-6",
    name: "Okobe Thila",
    type: "Dive Point",
    lat: 3.95,
    lng: 73.48,
    difficulty: "Intermediate",
    depth: "12-30m",
    description: "Beautiful thila with colorful corals and schooling fish",
    highlights: ["Coral Formations", "Schooling Fish", "Turtles"],
    rating: 4.5,
  },
  {
    id: "dive-7",
    name: "Vaavu Wreck",
    type: "Dive Point",
    lat: 3.6,
    lng: 73.0,
    difficulty: "Advanced",
    depth: "20-40m",
    description: "Wreck dive with historical significance and marine life",
    highlights: ["Wreck Exploration", "Groupers", "Snappers"],
    rating: 4.4,
  },
  {
    id: "dive-8",
    name: "Kandooma Thila",
    type: "Dive Point",
    lat: 3.88,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "10-35m",
    description: "Popular thila with excellent coral and abundant fish",
    highlights: ["Coral Reefs", "Reef Sharks", "Jacks"],
    rating: 4.7,
  },
];

// Surf Spots Data
const SURF_SPOTS = [
  {
    id: "surf-1",
    name: "Pasta Point",
    type: "Surf Spot",
    lat: 4.15,
    lng: 73.45,
    difficulty: "Intermediate",
    waveHeight: "2-6ft",
    description: "Consistent reef break with long rides and friendly atmosphere",
    highlights: ["Consistent Waves", "Right Hander", "Reef Break"],
    rating: 4.6,
  },
  {
    id: "surf-2",
    name: "Chickens",
    type: "Surf Spot",
    lat: 4.12,
    lng: 73.42,
    difficulty: "Beginner",
    waveHeight: "1-4ft",
    description: "Mellow beach break perfect for beginners and learning",
    highlights: ["Beach Break", "Beginner Friendly", "Sandy Bottom"],
    rating: 4.3,
  },
  {
    id: "surf-3",
    name: "Riptide",
    type: "Surf Spot",
    lat: 4.18,
    lng: 73.48,
    difficulty: "Advanced",
    waveHeight: "3-8ft",
    description: "Powerful reef break with challenging conditions",
    highlights: ["Powerful Waves", "Reef Break", "Left Hander"],
    rating: 4.5,
  },
  {
    id: "surf-4",
    name: "Thalapathi",
    type: "Surf Spot",
    lat: 4.22,
    lng: 73.55,
    difficulty: "Intermediate",
    waveHeight: "2-5ft",
    description: "Consistent point break with smooth waves",
    highlights: ["Point Break", "Long Rides", "Scenic"],
    rating: 4.4,
  },
  {
    id: "surf-5",
    name: "Jailbreaks",
    type: "Surf Spot",
    lat: 4.08,
    lng: 73.38,
    difficulty: "Advanced",
    waveHeight: "3-7ft",
    description: "Challenging reef break with fast walls",
    highlights: ["Reef Break", "Fast Walls", "Barrels"],
    rating: 4.7,
  },
  {
    id: "surf-6",
    name: "Honky's",
    type: "Surf Spot",
    lat: 4.05,
    lng: 73.35,
    difficulty: "Intermediate",
    waveHeight: "2-6ft",
    description: "Fun reef break with multiple peaks",
    highlights: ["Multiple Peaks", "Reef Break", "Fun Waves"],
    rating: 4.5,
  },
];

// Airports Data
const AIRPORTS = [
  {
    id: "airport-1",
    name: "Malé International Airport",
    type: "Airport",
    lat: 4.1924,
    lng: 73.2285,
    code: "MLE",
    description: "Main international airport serving the Maldives",
    highlights: ["International Flights", "Seaplane Hub", "Customs & Immigration"],
    airlines: "Emirates, Qatar Airways, Singapore Airlines, Turkish Airlines",
    rating: 4.4,
  },
  {
    id: "airport-2",
    name: "Gan International Airport",
    type: "Airport",
    lat: 0.3842,
    lng: 73.1577,
    code: "GAN",
    description: "Secondary airport serving southern atolls",
    highlights: ["Southern Atolls Access", "Domestic Flights", "Regional Hub"],
    airlines: "FlyMe, Maldivian Airlines",
    rating: 4.2,
  },
  {
    id: "airport-3",
    name: "Hanimaadhoo Airport",
    type: "Airport",
    lat: 6.3833,
    lng: 73.1833,
    code: "HAQ",
    description: "Northern airport serving Haa Alifu and Haa Dhaalu atolls",
    highlights: ["Northern Atolls Access", "Regional Flights", "Scenic Location"],
    airlines: "Maldivian Airlines, FlyMe",
    rating: 4.1,
  },
];

export default function MaldivesMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<(typeof MALDIVES_LOCATIONS)[0] | null>(null);
  const [selectedDive, setSelectedDive] = useState<(typeof DIVE_POINTS)[0] | null>(null);
  const [selectedSurf, setSelectedSurf] = useState<(typeof SURF_SPOTS)[0] | null>(null);
  const [selectedIsland, setSelectedIsland] = useState<(typeof POPULAR_ISLANDS)[0] | null>(null);
  const [selectedResort, setSelectedResort] = useState<(typeof LUXURY_RESORTS)[0] | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<(typeof AIRPORTS)[0] | null>(null);
  const [filteredLocations, setFilteredLocations] = useState(MALDIVES_LOCATIONS);
  const [filteredDives, setFilteredDives] = useState(DIVE_POINTS);
  const [filteredSurfs, setFilteredSurfs] = useState(SURF_SPOTS);
  const [filteredIslands, setFilteredIslands] = useState(POPULAR_ISLANDS);
  const [filteredResorts, setFilteredResorts] = useState(LUXURY_RESORTS);
  const [filteredAirports, setFilteredAirports] = useState(AIRPORTS);
  const [activityFilter, setActivityFilter] = useState<"all" | "atolls" | "dives" | "surfs" | "islands" | "resorts" | "airports">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "luxury">("all");
  const [zoom, setZoom] = useState(1);
  const [selectedIslandInfo, setSelectedIslandInfo] = useState<string | null>(null);
  const islandInfo = selectedIslandInfo ? getDestinationInfo(selectedIslandInfo) : null;

  // Filter locations based on search and activity type
  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();
    
    const locations = MALDIVES_LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(searchLower) ||
        location.description.toLowerCase().includes(searchLower)
    );
    
    const dives = DIVE_POINTS.filter(
      (dive) =>
        dive.name.toLowerCase().includes(searchLower) ||
        dive.description.toLowerCase().includes(searchLower)
    );
    
    const surfs = SURF_SPOTS.filter(
      (surf) =>
        surf.name.toLowerCase().includes(searchLower) ||
        surf.description.toLowerCase().includes(searchLower)
    );

    const islands = POPULAR_ISLANDS.filter(
      (island) =>
        island.name.toLowerCase().includes(searchLower) ||
        island.description.toLowerCase().includes(searchLower)
    );

    let resorts = LUXURY_RESORTS.filter(
      (resort) =>
        resort.name.toLowerCase().includes(searchLower) ||
        resort.description.toLowerCase().includes(searchLower)
    );

    // Apply price filter to resorts
    if (priceFilter !== "all") {
      resorts = resorts.filter((resort) => {
        if (priceFilter === "budget") return resort.category === "Mid-Range";
        if (priceFilter === "mid") return resort.category === "Luxury";
        if (priceFilter === "luxury") return resort.category === "Ultra-Luxury";
        return true;
      });
    }

    const airports = AIRPORTS.filter(
      (airport) =>
        airport.name.toLowerCase().includes(searchLower) ||
        airport.code.toLowerCase().includes(searchLower) ||
        airport.description.toLowerCase().includes(searchLower)
    );

    setFilteredLocations(locations);
    setFilteredDives(dives);
    setFilteredSurfs(surfs);
    setFilteredIslands(islands);
    setFilteredResorts(resorts);
    setFilteredAirports(airports);
  }, [searchTerm, priceFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 py-12 bg-gradient-to-b from-background to-secondary/20 pt-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore the Maldives
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover atolls, islands, resorts, dive points, and surf spots across the Maldives. 
              Explore pristine beaches, vibrant coral reefs, and thrilling water sports.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <Input
              placeholder="Search locations, islands, resorts, dive sites, or surf spots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-base"
            />
            
            {/* Activity Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivityFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                All
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                  {filteredLocations.length + filteredIslands.length + filteredResorts.length + filteredDives.length + filteredSurfs.length}
                </span>
              </button>
              <button
                onClick={() => setActivityFilter("atolls")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "atolls"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <MapPin className="w-4 h-4" />
                Atolls
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{filteredLocations.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("islands")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "islands"
                    ? "bg-green-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Palmtree className="w-4 h-4" />
                Islands
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{filteredIslands.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("resorts")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "resorts"
                    ? "bg-purple-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Resorts
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{filteredResorts.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("dives")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "dives"
                    ? "bg-cyan-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Anchor className="w-4 h-4" />
                Dives
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{filteredDives.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("surfs")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "surfs"
                    ? "bg-amber-500 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Waves className="w-4 h-4" />
                Surfs
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{filteredSurfs.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("airports")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "airports"
                    ? "bg-indigo-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <MapPin className="w-4 h-4" />
                Airports
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{filteredAirports.length}</span>
              </button>
            </div>

            {/* Price Filter for Resorts */}
            {(activityFilter === "all" || activityFilter === "resorts") && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground self-center">Resort Price:</span>
                <button
                  onClick={() => setPriceFilter("all")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    priceFilter === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  All Prices
                </button>
                <button
                  onClick={() => setPriceFilter("budget")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    priceFilter === "budget"
                      ? "bg-green-600 text-white"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Budget ($400-700)
                </button>
                <button
                  onClick={() => setPriceFilter("mid")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    priceFilter === "mid"
                      ? "bg-blue-600 text-white"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Luxury ($700-1300)
                </button>
                <button
                  onClick={() => setPriceFilter("luxury")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    priceFilter === "luxury"
                      ? "bg-amber-600 text-white"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Ultra-Luxury ($1500+)
                </button>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <Card className="h-full overflow-hidden">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Maldives Interactive Map
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
                      className="px-3"
                    >
                      +
                    </Button>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
                      className="px-3"
                    >
                      −
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <div
                    ref={mapContainer}
                    className="w-full bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg overflow-auto flex items-center justify-center"
                    style={{ height: "600px" }}
                  >
                    {/* SVG Map Visualization */}
                    <svg
                      viewBox="0 0 400 600"
                      className="cursor-grab active:cursor-grabbing"
                      style={{
                        background: "linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 100%)",
                        width: "100%",
                        height: "100%",
                        maxWidth: "800px",
                        maxHeight: "600px"
                      }}
                    >
                      <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      {/* Ocean background */}
                      <rect width="400" height="600" fill="#87CEEB" opacity="0.3" />

                      {/* Render Atolls */}
                      {(activityFilter === "all" || activityFilter === "atolls") && filteredLocations.map((location) => {
                        const x = ((location.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - location.lat) / 7) * 550 + 25;

                        return (
                          <g key={location.id} filter="url(#shadow)" onClick={() => setSelectedLocation(location)} style={{ cursor: "pointer" }}>
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedLocation?.id === location.id ? 16 : 12}
                              fill="#0d9488"
                              stroke="white"
                              strokeWidth="3"
                              className="transition-all duration-300 hover:r-16"
                              style={{ 
                                cursor: "pointer",
                                filter: selectedLocation?.id === location.id ? "drop-shadow(0 0 8px rgba(13, 148, 136, 0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                                transition: "all 0.3s ease"
                              }}
                            />
                            <text
                              x={x}
                              y={y + 5}
                              textAnchor="middle"
                              fontSize="16"
                              className="pointer-events-none select-none"
                            >
                              🏝️
                            </text>
                            <text
                              x={x}
                              y={y - 22}
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="bold"
                              fill="#0d9488"
                              className="pointer-events-none bg-white px-1"
                              style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }}
                            >
                              {location.name}
                            </text>
                          </g>
                        );
                      })}

                      {/* Render Islands */}
                      {(activityFilter === "all" || activityFilter === "islands") && filteredIslands.map((island) => {
                        const x = ((island.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - island.lat) / 7) * 550 + 25;

                        return (
                          <g key={island.id} filter="url(#shadow)" onClick={() => setSelectedIsland(island)} style={{ cursor: "pointer" }}>
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedIsland?.id === island.id ? 14 : 10}
                              fill="#22c55e"
                              stroke="white"
                              strokeWidth="3"
                              style={{ 
                                cursor: "pointer",
                                filter: selectedIsland?.id === island.id ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                                transition: "all 0.3s ease"
                              }}
                            />
                            <text
                              x={x}
                              y={y + 5}
                              textAnchor="middle"
                              fontSize="16"
                              className="pointer-events-none select-none"
                            >
                              🏝️
                            </text>
                            <text
                              x={x}
                              y={y - 20}
                              textAnchor="middle"
                              fontSize="9"
                              fontWeight="bold"
                              fill="#15803d"
                              className="pointer-events-none"
                              style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }}
                            >
                              {island.name}
                            </text>
                          </g>
                        );
                      })}

                      {/* Render Resorts */}
                      {(activityFilter === "all" || activityFilter === "resorts") && filteredResorts.map((resort) => {
                        const x = ((resort.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - resort.lat) / 7) * 550 + 25;

                        return (
                          <g key={resort.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedResort?.id === resort.id ? 10 : 7}
                              fill="#a855f7"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer hover:opacity-80 transition-all"
                              onClick={() => setSelectedResort(resort)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y - 15}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="#a855f7"
                              className="pointer-events-none"
                            >
                              {resort.name.substring(0, 12)}
                            </text>
                            <text
                              x={x}
                              y={y + 2}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="white"
                              className="pointer-events-none"
                            >
                              🏨
                            </text>
                          </g>
                        );
                      })}

                      {/* Render Dive Points */}
                      {(activityFilter === "all" || activityFilter === "dives") && filteredDives.map((dive) => {
                        const x = ((dive.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - dive.lat) / 7) * 550 + 25;

                        return (
                          <g key={dive.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedDive?.id === dive.id ? 10 : 6}
                              fill="#0891b2"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer hover:opacity-80 transition-all"
                              onClick={() => setSelectedDive(dive)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              fontSize="7"
                              fontWeight="bold"
                              fill="#0891b2"
                              className="pointer-events-none"
                            >
                              {dive.name.substring(0, 10)}
                            </text>
                            <text
                              x={x}
                              y={y + 2}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="white"
                              className="pointer-events-none"
                            >
                              ⚓
                            </text>
                          </g>
                        );
                      })}

                      {/* Render Surf Spots */}
                      {(activityFilter === "all" || activityFilter === "surfs") && filteredSurfs.map((surf) => {
                        const x = ((surf.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - surf.lat) / 7) * 550 + 25;

                        return (
                          <g key={surf.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedSurf?.id === surf.id ? 10 : 6}
                              fill="#f59e0b"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer hover:opacity-80 transition-all"
                              onClick={() => setSelectedSurf(surf)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              fontSize="7"
                              fontWeight="bold"
                              fill="#f59e0b"
                              className="pointer-events-none"
                            >
                              {surf.name.substring(0, 10)}
                            </text>
                            <text
                              x={x}
                              y={y + 2}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="white"
                              className="pointer-events-none"
                            >
                              🌊
                            </text>
                          </g>
                        );
                      })}

                      {/* Render Airports */}
                      {(activityFilter === "all" || activityFilter === "airports") && filteredAirports.map((airport) => {
                        const x = ((airport.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - airport.lat) / 7) * 550 + 25;

                        return (
                          <g key={airport.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedAirport?.id === airport.id ? 11 : 7}
                              fill="#4f46e5"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer hover:opacity-80 transition-all"
                              onClick={() => setSelectedAirport(airport)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y - 14}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="#4f46e5"
                              className="pointer-events-none"
                            >
                              {airport.code}
                            </text>
                            <text
                              x={x}
                              y={y + 2}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="white"
                              className="pointer-events-none"
                            >
                              Plane
                            </text>
                          </g>
                        );
                      })}

                      {/* Legend */}
                      <g>
                        <rect x="10" y="10" width="140" height="130" fill="white" opacity="0.95" rx="4" />
                        <circle cx="25" cy="25" r="4" fill="#0d9488" />
                        <text x="35" y="30" fontSize="10" fill="#333" fontWeight="bold">
                          Atolls
                        </text>
                        <circle cx="25" cy="45" r="4" fill="#22c55e" />
                        <text x="35" y="50" fontSize="10" fill="#333" fontWeight="bold">
                          Islands
                        </text>
                        <circle cx="25" cy="65" r="4" fill="#a855f7" />
                        <text x="35" y="70" fontSize="10" fill="#333" fontWeight="bold">
                          Resorts
                        </text>
                        <circle cx="25" cy="85" r="4" fill="#0891b2" />
                        <text x="35" y="90" fontSize="10" fill="#333" fontWeight="bold">
                          Dives
                        </text>
                        <circle cx="25" cy="105" r="4" fill="#f59e0b" />
                        <text x="35" y="110" fontSize="10" fill="#333" fontWeight="bold">
                          Surfs
                        </text>
                        <circle cx="25" cy="125" r="4" fill="#4f46e5" />
                        <text x="35" y="130" fontSize="10" fill="#333" fontWeight="bold">
                          Airports
                        </text>
                      </g>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Lists */}
            <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
              {/* Islands List */}
              {(activityFilter === "all" || activityFilter === "islands") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palmtree className="w-4 h-4 text-green-600" />
                    Islands ({filteredIslands.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-40">
                    {filteredIslands.length > 0 ? (
                      filteredIslands.map((island) => (
                        <div
                          key={island.id}
                          onClick={() => setSelectedIsland(island)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedIsland?.id === island.id
                              ? "bg-green-600 text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{island.name}</div>
                          <div className="text-xs opacity-75">{island.category}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No islands found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Resorts List */}
              {(activityFilter === "all" || activityFilter === "resorts") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      Resorts ({filteredResorts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-40">
                    {filteredResorts.length > 0 ? (
                      filteredResorts.map((resort) => (
                        <div
                          key={resort.id}
                          onClick={() => setSelectedResort(resort)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedResort?.id === resort.id
                              ? "bg-purple-600 text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{resort.name}</div>
                          <div className="text-xs opacity-75">{resort.category} • {resort.pricePerNight}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No resorts found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Dive Points List */}
              {(activityFilter === "all" || activityFilter === "dives") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Anchor className="w-4 h-4 text-cyan-600" />
                      Dives ({filteredDives.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-40">
                    {filteredDives.length > 0 ? (
                      filteredDives.map((dive) => (
                        <div
                          key={dive.id}
                          onClick={() => setSelectedDive(dive)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedDive?.id === dive.id
                              ? "bg-cyan-600 text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{dive.name}</div>
                          <div className="text-xs opacity-75">{dive.difficulty} • {dive.depth}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No dive points found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Surf Spots List */}
              {(activityFilter === "all" || activityFilter === "surfs") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Waves className="w-4 h-4 text-amber-500" />
                      Surfs ({filteredSurfs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-40">
                    {filteredSurfs.length > 0 ? (
                      filteredSurfs.map((surf) => (
                        <div
                          key={surf.id}
                          onClick={() => setSelectedSurf(surf)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedSurf?.id === surf.id
                              ? "bg-amber-500 text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{surf.name}</div>
                          <div className="text-xs opacity-75">{surf.difficulty} • {surf.waveHeight}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No surf spots found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Details Sections */}
          {selectedIsland && (
            <LocationDetailPanel
              location={selectedIsland}
              type="island"
              onClose={() => setSelectedIsland(null)}
            />
          )}



          {selectedResort && (
            <LocationDetailPanel
              location={selectedResort}
              type="resort"
              onClose={() => setSelectedResort(null)}
            />
          )}


          {selectedLocation && (
            <LocationDetailPanel
              location={selectedLocation}
              type="atoll"
              onClose={() => setSelectedLocation(null)}
            />
          )}


          {selectedDive && (
            <LocationDetailPanel
              location={selectedDive}
              type="dive"
              onClose={() => setSelectedDive(null)}
            />
          )}


          {selectedSurf && (
            <LocationDetailPanel
              location={selectedSurf}
              type="surf"
              onClose={() => setSelectedSurf(null)}
            />
          )}


          {selectedAirport && (
            <LocationDetailPanel
              location={selectedAirport}
              type="airport"
              onClose={() => setSelectedAirport(null)}
            />
          )}

        </div>
      </section>

      {/* Island Info Modal */}
      <Dialog open={!!selectedIslandInfo} onOpenChange={() => setSelectedIslandInfo(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {islandInfo && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                  {islandInfo.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Atoll</p>
                    <p className="font-semibold text-foreground">{islandInfo.atoll}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold text-foreground capitalize">{islandInfo.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Distance from Male</p>
                    <p className="font-semibold text-foreground">{islandInfo.distanceFromMale} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <p className="font-semibold text-foreground">{islandInfo.rating}/5</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">About</p>
                  <p className="text-foreground">{islandInfo.description}</p>
                </div>

                {/* Travel Info */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    Travel Options
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Ferry:</span> <span className="font-medium text-foreground">{islandInfo.ferryDuration}</span></p>
                    {islandInfo.flightAvailable && islandInfo.flightDuration && (
                      <p><span className="text-muted-foreground">Flight:</span> <span className="font-medium text-foreground">{islandInfo.flightDuration}</span></p>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-cyan-600" />
                    Amenities
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {islandInfo.amenities.map((amenity, idx) => (
                      <p key={idx} className="text-sm text-foreground">• {amenity}</p>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">Guesthouses: <span className="font-semibold text-foreground">{islandInfo.guesthouses}</span></p>
                    <p className="text-muted-foreground">Resorts: <span className="font-semibold text-foreground">{islandInfo.resorts}</span></p>
                    <p className="text-muted-foreground">Restaurants: <span className="font-semibold text-foreground">{islandInfo.restaurants}</span></p>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-600" />
                    Activities
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {islandInfo.activities.map((activity, idx) => (
                      <p key={idx} className="text-sm text-foreground">• {activity}</p>
                    ))}
                  </div>
                </div>

                {/* Best Time to Visit */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    Best Time to Visit
                  </p>
                  <p className="text-sm text-foreground mb-2">{islandInfo.bestMonths.join(", ")}</p>
                  <p className="text-sm text-muted-foreground">{islandInfo.weatherSummary}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
