import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Info, Waves, Anchor, Building2, Palmtree, BookOpen, X } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

// Location data constants
const MALDIVES_LOCATIONS = [
  {
    id: 1,
    name: "Male City",
    type: "Capital",
    lat: 4.1748,
    lng: 73.5082,
    description: "The capital city of Maldives, gateway to the islands",
    highlights: ["National Museum", "Grand Friday Mosque", "Local Markets"],
    image: "/images/male-city.jpg",
    activities: ["relaxation"],
  },
  {
    id: 2,
    name: "North Male Atoll",
    type: "Atoll",
    lat: 4.25,
    lng: 73.45,
    description: "Popular atoll with luxury resorts and pristine beaches",
    highlights: ["Crystal Clear Waters", "Coral Reefs", "Water Sports"],
    image: "/images/north-male-atoll.jpg",
    activities: ["diving", "snorkeling", "water-sports"],
  },
  {
    id: 3,
    name: "South Male Atoll",
    type: "Atoll",
    lat: 3.95,
    lng: 73.50,
    description: "Serene atoll with exclusive resorts and calm lagoons",
    highlights: ["Luxury Resorts", "Calm Lagoons", "Diving Spots"],
    image: "/images/south-male-atoll.jpg",
    activities: ["diving", "relaxation"],
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
    activities: ["diving", "snorkeling"],
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
    activities: ["snorkeling", "diving"],
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
    activities: ["diving"],
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
    activities: ["diving", "relaxation"],
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
    activities: ["relaxation", "snorkeling"],
  },
  {
    id: 9,
    name: "Thiladhunmathi Atoll",
    type: "Atoll",
    lat: 5.8,
    lng: 73.2,
    description: "Remote atoll with pristine reefs and minimal tourism",
    highlights: ["Pristine Reefs", "Minimal Crowds", "House Reefs"],
    image: "/images/thiladhunmathi-atoll.jpg",
    activities: ["diving", "snorkeling"],
  },
];

const POPULAR_ISLANDS = [
  {
    id: "island-maafushi",
    name: "Maafushi Island",
    type: "Island",
    lat: 4.38,
    lng: 73.4,
    category: "Local Island",
    slug: "maafushi",
    guideSlug: "maafushi-island",
    description: "Popular local island with budget-friendly guesthouses and vibrant culture",
    highlights: ["Local Atmosphere", "Budget Friendly", "Beach Bars", "Water Sports"],
    population: "~2000",
    rating: 4.4,
    activities: ["water-sports", "snorkeling"],
  },
  {
    id: "island-thoddoo",
    name: "Thoddoo Island",
    type: "Island",
    lat: 5.3,
    lng: 73.4,
    category: "Local Island",
    slug: "thoddoo",
    guideSlug: "thoddoo-island",
    description: "Authentic local island known for agriculture and traditional culture",
    highlights: ["Watermelon Farms", "Local Markets", "Fishing Village", "Authentic Experience"],
    population: "~1500",
    rating: 4.3,
    activities: ["relaxation"],
  },
  {
    id: "island-guraidhoo",
    name: "Guraidhoo Island",
    type: "Island",
    lat: 3.95,
    lng: 73.52,
    category: "Local Island",
    slug: "guraidhoo",
    guideSlug: "guraidhoo-island",
    description: "Charming local island with excellent house reefs and friendly locals",
    highlights: ["House Reef Diving", "Local Restaurants", "Fishing Culture", "Peaceful"],
    population: "~800",
    rating: 4.5,
    activities: ["diving", "snorkeling"],
  },
  {
    id: "island-thulusdhoo",
    name: "Thulusdhoo Island",
    type: "Island",
    lat: 4.35,
    lng: 73.55,
    category: "Local Island",
    slug: "thulusdhoo",
    guideSlug: "thulusdhoo-island",
    description: "Laid-back island famous for surfing and relaxed beach culture",
    highlights: ["Surf Breaks", "Beach Vibes", "Local Cafes", "Yoga Retreats"],
    population: "~1200",
    rating: 4.6,
    activities: ["surfing", "relaxation"],
  },
  {
    id: "island-kandooma",
    name: "Kandooma Island",
    type: "Island",
    lat: 3.88,
    lng: 73.52,
    category: "Local Island",
    slug: "kandooma",
    guideSlug: "kandooma-island",
    description: "Scenic island with beautiful beaches and excellent diving spots",
    highlights: ["Scenic Beaches", "Dive Sites", "Snorkeling", "Island Hopping"],
    population: "~600",
    rating: 4.4,
    activities: ["diving", "snorkeling"],
  },
];

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
    activities: ["relaxation", "water-sports"],
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
    activities: ["relaxation", "diving"],
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
    activities: ["diving", "snorkeling"],
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
    activities: ["snorkeling", "water-sports"],
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
    activities: ["diving", "snorkeling", "relaxation"],
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
    activities: ["water-sports", "relaxation"],
    pricePerNight: "$500-800",
  },
  {
    id: "resort-7",
    name: "Kurumba Maldives",
    type: "Resort",
    lat: 4.38,
    lng: 73.52,
    category: "Luxury",
    price: "$$$$",
    description: "Iconic resort close to Male with excellent facilities and service",
    amenities: ["Overwater Villas", "Spa", "Multiple Restaurants", "Watersports"],
    rating: 4.7,
    pricePerNight: "$700-1000",
    activities: ["water-sports", "diving"],
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
    activities: ["diving", "snorkeling"],
  },
];

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
    activities: ["diving", "snorkeling"],
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
    activities: ["diving"],
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
    activities: ["diving"],
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
    activities: ["diving", "snorkeling"],
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
    activities: ["diving", "snorkeling"],
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
    activities: ["diving"],
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
    activities: ["diving"],
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
    activities: ["diving", "snorkeling"],
  },
];

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
    activities: ["surfing"],
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
    activities: ["surfing"],
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
    activities: ["surfing"],
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
    activities: ["surfing"],
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
    activities: ["surfing"],
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
    activities: ["surfing"],
  },
];

const AIRPORTS = [
  {
    id: "airport-1",
    name: "Male International Airport",
    type: "Airport",
    lat: 4.1924,
    lng: 73.2285,
    code: "MLE",
    description: "Main international airport serving the Maldives",
    highlights: ["International Flights", "Seaplane Hub", "Customs & Immigration"],
    airlines: "Emirates, Qatar Airways, Singapore Airlines, Turkish Airlines",
    rating: 4.4,
    activities: ["relaxation"],
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
    activities: ["relaxation"],
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
    activities: ["relaxation"],
  },
];

type LocationType = 
  | typeof MALDIVES_LOCATIONS[0] 
  | typeof POPULAR_ISLANDS[0] 
  | typeof LUXURY_RESORTS[0] 
  | typeof DIVE_POINTS[0] 
  | typeof SURF_SPOTS[0] 
  | typeof AIRPORTS[0];

const MARKER_ICONS = {
  atoll: "🏝️",
  island: "🏝️",
  resort: "🏨",
  dive_point: "🤿",
  surf_spot: "🏄",
  airport: "✈️",
};

export default function MaldivesMapNew() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ marker: mapboxgl.Marker; element: HTMLElement; location: LocationType }[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all" | "atolls" | "dives" | "surfs" | "islands" | "resorts" | "airports">("all");
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());

  // Activity filter options
  const activityOptions = [
    { id: "diving", label: "Diving", icon: "🤿" },
    { id: "surfing", label: "Surfing", icon: "🏄" },
    { id: "snorkeling", label: "Snorkeling", icon: "🤽" },
    { id: "water-sports", label: "Water Sports", icon: "🚤" },
    { id: "relaxation", label: "Relaxation", icon: "🏖️" },
  ];

  const toggleActivity = (activityId: string) => {
    const newActivities = new Set(selectedActivities);
    if (newActivities.has(activityId)) {
      newActivities.delete(activityId);
    } else {
      newActivities.add(activityId);
    }
    setSelectedActivities(newActivities);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [73.5, 4.0],
      zoom: 6,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add markers to map
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    // Close existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    const createMarkerElement = (icon: string): HTMLElement => {
      const el = document.createElement("div");
      el.style.fontSize = "32px";
      el.style.cursor = "pointer";
      el.style.userSelect = "none";
      el.textContent = icon;
      return el;
    };

    const addMarker = (location: LocationType, icon: string) => {
      const el = createMarkerElement(icon);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current!);

      // Add click event listener
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Update selected location
        setSelectedLocation(location);

        // Zoom animation
        if (map.current) {
          map.current.flyTo({
            center: [location.lng, location.lat],
            zoom: 12,
            duration: 1500,
            essential: true,
          });
        }

        // Create and show popup
        if (popupRef.current) {
          popupRef.current.remove();
        }

        const popupContent = document.createElement("div");
        popupContent.className = "p-3 bg-white rounded-lg shadow-lg max-w-xs";

        // Build popup HTML
        const highlights = (location as any).highlights || [];
        const highlightsHtml =
          highlights.length > 0
            ? `<ul class="text-xs text-gray-600 mb-2 space-y-1">${highlights.map((h: string) => `<li>• ${h}</li>`).join("")}</ul>`
            : "";

        let additionalInfo = "";
        const loc = location as any;
        if (loc.rating) {
          additionalInfo += `<p class="text-sm mb-1"><strong>Rating:</strong> ⭐ ${loc.rating}</p>`;
        }
        if (loc.pricePerNight) {
          additionalInfo += `<p class="text-sm mb-1"><strong>Price:</strong> ${loc.pricePerNight}</p>`;
        }
        if (loc.difficulty) {
          additionalInfo += `<p class="text-sm mb-1"><strong>Difficulty:</strong> ${loc.difficulty}</p>`;
        }
        if (loc.waveHeight) {
          additionalInfo += `<p class="text-sm mb-1"><strong>Wave Height:</strong> ${loc.waveHeight}</p>`;
        }
        if (loc.code) {
          additionalInfo += `<p class="text-sm mb-1"><strong>Code:</strong> ${loc.code}</p>`;
        }

        popupContent.innerHTML = `
          <h3 class="font-bold text-base mb-1">${location.name}</h3>
          <p class="text-xs text-gray-500 mb-2">${location.type}</p>
          <p class="text-sm text-gray-700 mb-2">${location.description}</p>
          ${highlightsHtml}
          ${additionalInfo}
        `;

        popupRef.current = new mapboxgl.Popup({ offset: 25, maxWidth: "300px" })
          .setDOMContent(popupContent)
          .setLngLat([location.lng, location.lat])
          .addTo(map.current!);
      });

      markersRef.current.push({ marker, element: el, location });
    };

    // Filter locations by search term and activities
    const filterBySearch = (locations: LocationType[]) => {
      let filtered = locations;
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (loc: any) =>
            loc.name.toLowerCase().includes(term) ||
            loc.description?.toLowerCase().includes(term) ||
            loc.highlights?.some((h: string) => h.toLowerCase().includes(term))
        );
      }
      
      // Filter by selected activities
      if (selectedActivities.size > 0) {
        filtered = filtered.filter((loc: any) => {
          const locActivities = loc.activities || [];
          return Array.from(selectedActivities).some(activity =>
            locActivities.includes(activity)
          );
        });
      }
      
      return filtered;
    };

    // Add markers based on filter
    if (activityFilter === "all" || activityFilter === "atolls") {
      filterBySearch(MALDIVES_LOCATIONS).forEach((loc) => {
        addMarker(loc, MARKER_ICONS.atoll);
      });
    }
    if (activityFilter === "all" || activityFilter === "islands") {
      filterBySearch(POPULAR_ISLANDS).forEach((loc) => {
        addMarker(loc, MARKER_ICONS.island);
      });
    }
    if (activityFilter === "all" || activityFilter === "resorts") {
      filterBySearch(LUXURY_RESORTS).forEach((loc) => {
        addMarker(loc, MARKER_ICONS.resort);
      });
    }
    if (activityFilter === "all" || activityFilter === "dives") {
      filterBySearch(DIVE_POINTS).forEach((loc) => {
        addMarker(loc, MARKER_ICONS.dive_point);
      });
    }
    if (activityFilter === "all" || activityFilter === "surfs") {
      filterBySearch(SURF_SPOTS).forEach((loc) => {
        addMarker(loc, MARKER_ICONS.surf_spot);
      });
    }
    if (activityFilter === "all" || activityFilter === "airports") {
      filterBySearch(AIRPORTS).forEach((loc) => {
        addMarker(loc, MARKER_ICONS.airport);
      });
    }
  }, [activityFilter, searchTerm, selectedActivities]);

  const getMarkerCount = () => {
    let count = 0;
    if (activityFilter === "all" || activityFilter === "atolls") count += MALDIVES_LOCATIONS.length;
    if (activityFilter === "all" || activityFilter === "islands") count += POPULAR_ISLANDS.length;
    if (activityFilter === "all" || activityFilter === "resorts") count += LUXURY_RESORTS.length;
    if (activityFilter === "all" || activityFilter === "dives") count += DIVE_POINTS.length;
    if (activityFilter === "all" || activityFilter === "surfs") count += SURF_SPOTS.length;
    if (activityFilter === "all" || activityFilter === "airports") count += AIRPORTS.length;
    return count;
  };

  // Count locations for each activity
  const getActivityCount = (activityId: string): number => {
    const allLocations = [
      ...MALDIVES_LOCATIONS,
      ...POPULAR_ISLANDS,
      ...LUXURY_RESORTS,
      ...DIVE_POINTS,
      ...SURF_SPOTS,
      ...AIRPORTS,
    ];
    
    return allLocations.filter((loc: any) => {
      const locActivities = loc.activities || [];
      return locActivities.includes(activityId);
    }).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 py-12 bg-gradient-to-b from-background to-secondary/20 pt-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore the Maldives
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover atolls, islands, resorts, dive points, and surf spots across the Maldives. 
              Explore pristine beaches, vibrant coral reefs, and thrilling water sports.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search islands, atolls, resorts, dive sites, or surf spots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Map Container */}
            <div
              ref={mapContainer}
              className="w-full h-96 md:h-[600px] rounded-lg border border-border shadow-lg overflow-hidden"
            />

            {/* Activity Filter Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-foreground">Filter by Activity:</span>
              {activityOptions.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                    selectedActivities.has(activity.id)
                      ? "bg-cyan-600 text-white shadow-md"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <span>{activity.icon}</span>
                  {activity.label}
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {getActivityCount(activity.id)}
                  </span>
                </button>
              ))}
              {selectedActivities.size > 0 && (
                <button
                  onClick={() => setSelectedActivities(new Set())}
                  className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm bg-red-500/20 text-red-600 hover:bg-red-500/30"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Location Type Filter Buttons */}
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
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{getMarkerCount()}</span>
              </button>
              <button
                onClick={() => setActivityFilter("atolls")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "atolls"
                    ? "bg-blue-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <MapPin className="w-4 h-4" />
                Atolls
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{MALDIVES_LOCATIONS.length}</span>
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
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{POPULAR_ISLANDS.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("resorts")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "resorts"
                    ? "bg-amber-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Resorts
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{LUXURY_RESORTS.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("dives")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "dives"
                    ? "bg-purple-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Anchor className="w-4 h-4" />
                Dive Sites
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{DIVE_POINTS.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("surfs")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "surfs"
                    ? "bg-orange-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Waves className="w-4 h-4" />
                Surf Spots
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{SURF_SPOTS.length}</span>
              </button>
              <button
                onClick={() => setActivityFilter("airports")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "airports"
                    ? "bg-indigo-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Info className="w-4 h-4" />
                Airports
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{AIRPORTS.length}</span>
              </button>
            </div>

            {/* Selected Location Details */}
            {selectedLocation && (
              <Card className="border-2 border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedLocation.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedLocation.type}</p>
                    </div>
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="p-1 hover:bg-secondary rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground">{selectedLocation.description}</p>
                  
                  {(selectedLocation as any).guideSlug && (
                    <Link href={`/island/${(selectedLocation as any).guideSlug}`}>
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Full Island Guide
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
