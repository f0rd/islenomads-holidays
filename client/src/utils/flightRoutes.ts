// Domestic Flight Routes Database for Maldives
// Based on Maldivian Airline and regional airports

export interface FlightRoute {
  id: string;
  from: string;
  to: string;
  airportCode: string;
  atoll: string;
  durationMinutes: number;
  priceUSD: number;
  airline: string;
  aircraft: string;
  capacity: number;
}

export const FLIGHT_ROUTES: FlightRoute[] = [
  // Short flights (20-40 min, ~$150-200)
  {
    id: "flight-male-dharavandhoo",
    from: "male",
    to: "dharavandhoo-island",
    airportCode: "DRV",
    atoll: "Baa",
    durationMinutes: 20,
    priceUSD: 160,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-maamigili",
    from: "male",
    to: "maamigili-island",
    airportCode: "VAM",
    atoll: "South Alifu",
    durationMinutes: 30,
    priceUSD: 180,
    airline: "Flyme",
    aircraft: "ATR 72-600",
    capacity: 70,
  },
  {
    id: "flight-male-ifuru",
    from: "male",
    to: "ifuru-island",
    airportCode: "IFU",
    atoll: "Raa",
    durationMinutes: 32,
    priceUSD: 175,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-kudahuvadhoo",
    from: "male",
    to: "kudahuvadhoo-island",
    airportCode: "DDD",
    atoll: "Dhaal",
    durationMinutes: 31,
    priceUSD: 170,
    airline: "Mantaair",
    aircraft: "ATR 72-500",
    capacity: 66,
  },
  {
    id: "flight-male-madivaru",
    from: "male",
    to: "madivaru-island",
    airportCode: "LMV",
    atoll: "Lhaviyani",
    durationMinutes: 38,
    priceUSD: 190,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },

  // Medium flights (40-50 min, ~$200-300)
  {
    id: "flight-male-maafaru",
    from: "male",
    to: "maafaru-island",
    airportCode: "NMF",
    atoll: "Noonu",
    durationMinutes: 40,
    priceUSD: 220,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-funadhoo",
    from: "male",
    to: "funadhoo-island",
    airportCode: "FND",
    atoll: "Shaviyani",
    durationMinutes: 40,
    priceUSD: 210,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-thimarafushi",
    from: "male",
    to: "thimarafushi-island",
    airportCode: "TMF",
    atoll: "Thaa",
    durationMinutes: 40,
    priceUSD: 215,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-kulhuduffushi",
    from: "male",
    to: "kulhuduffushi-island",
    airportCode: "HDK",
    atoll: "Haa Dhaal",
    durationMinutes: 48,
    priceUSD: 250,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-hanimadhoo",
    from: "male",
    to: "hanimadhoo-island",
    airportCode: "HAQ",
    atoll: "Haa Alif",
    durationMinutes: 50,
    priceUSD: 260,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },

  // Long flights (60+ min, ~$300-540)
  {
    id: "flight-male-maavarulu",
    from: "male",
    to: "maavarulu-island",
    airportCode: "RUL",
    atoll: "Gaaf Dhaal",
    durationMinutes: 75,
    priceUSD: 380,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-koodoo",
    from: "male",
    to: "koodoo-island",
    airportCode: "GKK",
    atoll: "Gaafu Alif",
    durationMinutes: 67,
    priceUSD: 340,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-kaadedhoo",
    from: "male",
    to: "kaadedhoo-island",
    airportCode: "KDM",
    atoll: "Gaafu Dhaal",
    durationMinutes: 73,
    priceUSD: 370,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-kadhdhoo",
    from: "male",
    to: "kadhdhoo-island",
    airportCode: "KDO",
    atoll: "Laamu",
    durationMinutes: 45,
    priceUSD: 240,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-fuvahmulaku",
    from: "male",
    to: "fuvahmulaku-island",
    airportCode: "FVM",
    atoll: "Gnaviyani",
    durationMinutes: 87,
    priceUSD: 450,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-gan",
    from: "male",
    to: "gan-island",
    airportCode: "GAN",
    atoll: "Addu/Seenu",
    durationMinutes: 95,
    priceUSD: 520,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
  {
    id: "flight-male-hoarafushi",
    from: "male",
    to: "hoarafushi-island",
    airportCode: "HRF",
    atoll: "Haa Alif",
    durationMinutes: 70,
    priceUSD: 360,
    airline: "Maldivian",
    aircraft: "Dash 8-300",
    capacity: 50,
  },
];

// Find flight route between two islands
export function findFlightRoute(fromId: string, toId: string): FlightRoute | undefined {
  return FLIGHT_ROUTES.find((route) => route.from === fromId && route.to === toId);
}

// Get all islands with flight connections to Male
export function getIslandsWithFlights(): string[] {
  const flightIslands = new Set<string>();
  FLIGHT_ROUTES.forEach((route) => {
    if (route.from === "male") {
      flightIslands.add(route.to);
    }
  });
  return Array.from(flightIslands);
}

// Get flight route details
export function getFlightDetails(fromId: string, toId: string) {
  const route = findFlightRoute(fromId, toId);
  if (!route) return null;

  return {
    id: route.id,
    from: route.from,
    to: route.to,
    duration: `${route.durationMinutes} min`,
    durationMinutes: route.durationMinutes,
    price: `$${route.priceUSD}`,
    priceAmount: route.priceUSD,
    airline: route.airline,
    aircraft: route.aircraft,
    capacity: route.capacity,
    airportCode: route.airportCode,
    atoll: route.atoll,
  };
}
