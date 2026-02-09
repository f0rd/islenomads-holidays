// Ferry Routes Database for Maldives
// Based on actual public ferry routes

export interface FerryRoute {
  id: string;
  from: string;
  to: string;
  type: "ferry" | "speedboat";
  durationMinutes: number;
  priceUSD: number;
  operator: string;
  capacity: number;
}

export const FERRY_ROUTES: FerryRoute[] = [
  // Hub routes (Male City connections)
  {
    id: "male-thoddoo",
    from: "thoddoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 120,
    priceUSD: 8,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-mahibadhoo",
    from: "mahibadhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 180,
    priceUSD: 12,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-rasdhoo",
    from: "rasdhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 300,
    priceUSD: 15,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-kaashidhoo",
    from: "kaashidhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 240,
    priceUSD: 14,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-dhiffushi",
    from: "dhiffushi-island",
    to: "male",
    type: "ferry",
    durationMinutes: 90,
    priceUSD: 5,
    operator: "Public Ferry",
    capacity: 100,
  },
  {
    id: "male-guraidhoo",
    from: "guraidhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 60,
    priceUSD: 4,
    operator: "Public Ferry",
    capacity: 100,
  },
  {
    id: "male-maafushi",
    from: "maafushi-island",
    to: "male",
    type: "ferry",
    durationMinutes: 75,
    priceUSD: 5,
    operator: "Public Ferry",
    capacity: 100,
  },
  {
    id: "male-ukulhas",
    from: "ukulhas-island",
    to: "male",
    type: "ferry",
    durationMinutes: 120,
    priceUSD: 8,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-dhigurah",
    from: "dhigurah-island",
    to: "male",
    type: "ferry",
    durationMinutes: 150,
    priceUSD: 10,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-dharavandhoo",
    from: "dharavandhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 180,
    priceUSD: 12,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-eydhafushi",
    from: "eydhafushi-island",
    to: "male",
    type: "ferry",
    durationMinutes: 150,
    priceUSD: 10,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-goidhoo",
    from: "goidhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 200,
    priceUSD: 13,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-kendhoo",
    from: "kendhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 180,
    priceUSD: 12,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-hangnaameedhoo",
    from: "hangnaameedhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 240,
    priceUSD: 15,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-gan",
    from: "gan-island",
    to: "male",
    type: "ferry",
    durationMinutes: 360,
    priceUSD: 25,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-funadhoo",
    from: "funadhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 300,
    priceUSD: 20,
    operator: "Public Ferry",
    capacity: 80,
  },
  {
    id: "male-felidhoo",
    from: "felidhoo-island",
    to: "male",
    type: "ferry",
    durationMinutes: 270,
    priceUSD: 18,
    operator: "Public Ferry",
    capacity: 80,
  },

  // Inter-island routes (Baa Atoll)
  {
    id: "goidhoo-eydhafushi",
    from: "goidhoo-island",
    to: "eydhafushi-island",
    type: "ferry",
    durationMinutes: 45,
    priceUSD: 3,
    operator: "Local Ferry",
    capacity: 60,
  },
  {
    id: "kendhoo-eydhafushi",
    from: "kendhoo-island",
    to: "eydhafushi-island",
    type: "ferry",
    durationMinutes: 30,
    priceUSD: 2,
    operator: "Local Ferry",
    capacity: 60,
  },
  {
    id: "dharavandhoo-eydhafushi",
    from: "dharavandhoo-island",
    to: "eydhafushi-island",
    type: "ferry",
    durationMinutes: 60,
    priceUSD: 4,
    operator: "Local Ferry",
    capacity: 60,
  },

  // Inter-island routes (Alifu Alifu)
  {
    id: "velidhoo-manadhoo",
    from: "velidhoo-island",
    to: "manadhoo-island",
    type: "ferry",
    durationMinutes: 45,
    priceUSD: 3,
    operator: "Local Ferry",
    capacity: 60,
  },
  {
    id: "henbadhoo-manadhoo",
    from: "henbadhoo-island",
    to: "manadhoo-island",
    type: "ferry",
    durationMinutes: 30,
    priceUSD: 2,
    operator: "Local Ferry",
    capacity: 60,
  },

  // Inter-island routes (Alifu Dhaalu)
  {
    id: "himandhoo-rasdhoo",
    from: "himandhoo-island",
    to: "rasdhoo-island",
    type: "ferry",
    durationMinutes: 60,
    priceUSD: 4,
    operator: "Local Ferry",
    capacity: 60,
  },
  {
    id: "fenfushi-mahibadhoo",
    from: "fenfushi-island",
    to: "mahibadhoo-island",
    type: "ferry",
    durationMinutes: 45,
    priceUSD: 3,
    operator: "Local Ferry",
    capacity: 60,
  },
  {
    id: "mandhoo-mahibadhoo",
    from: "mandhoo-island",
    to: "mahibadhoo-island",
    type: "ferry",
    durationMinutes: 30,
    priceUSD: 2,
    operator: "Local Ferry",
    capacity: 60,
  },

  // Inter-island routes (Meemu Atoll)
  {
    id: "buruni-veymandhoo",
    from: "buruni-island",
    to: "veymandhoo-island",
    type: "ferry",
    durationMinutes: 45,
    priceUSD: 3,
    operator: "Local Ferry",
    capacity: 60,
  },
  {
    id: "kandoodhoo-thimarafushi",
    from: "kandoodhoo-island",
    to: "thimarafushi-island",
    type: "ferry",
    durationMinutes: 45,
    priceUSD: 3,
    operator: "Local Ferry",
    capacity: 60,
  },

  // Speedboat options (faster, more expensive)
  {
    id: "speedboat-male-rasdhoo",
    from: "rasdhoo-island",
    to: "male",
    type: "speedboat",
    durationMinutes: 90,
    priceUSD: 35,
    operator: "Speedboat Service",
    capacity: 20,
  },
  {
    id: "speedboat-male-mahibadhoo",
    from: "mahibadhoo-island",
    to: "male",
    type: "speedboat",
    durationMinutes: 60,
    priceUSD: 30,
    operator: "Speedboat Service",
    capacity: 20,
  },
];

// Find ferry route between two islands
export function findFerryRoute(
  fromId: string,
  toId: string
): FerryRoute | undefined {
  return FERRY_ROUTES.find((route) => route.from === fromId && route.to === toId);
}

// Find reverse ferry route
export function findReverseFerryRoute(
  fromId: string,
  toId: string
): FerryRoute | undefined {
  return FERRY_ROUTES.find((route) => route.from === toId && route.to === fromId);
}

// Check if two islands are directly connected
export function areIslandsDirectlyConnected(
  fromId: string,
  toId: string
): boolean {
  return (
    findFerryRoute(fromId, toId) !== undefined ||
    findReverseFerryRoute(fromId, toId) !== undefined
  );
}

// Get all islands that connect to Male
export function getIslandsConnectingToMale(): string[] {
  const maleConnections = new Set<string>();
  FERRY_ROUTES.forEach((route) => {
    if (route.to === "male") {
      maleConnections.add(route.from);
    }
    if (route.from === "male") {
      maleConnections.add(route.to);
    }
  });
  return Array.from(maleConnections);
}

// Calculate route between two islands (may include Male as hub)
export function calculateRoute(
  fromId: string,
  toId: string
): FerryRoute[] | null {
  // Direct route
  const directRoute = findFerryRoute(fromId, toId);
  if (directRoute) {
    return [directRoute];
  }

  const reverseRoute = findReverseFerryRoute(fromId, toId);
  if (reverseRoute) {
    return [reverseRoute];
  }

  // Route via Male (hub)
  const toMale = findFerryRoute(fromId, "male");
  const fromMale = findFerryRoute("male", toId);

  if (toMale && fromMale) {
    return [toMale, fromMale];
  }

  // Try reverse directions
  const toMaleReverse = findReverseFerryRoute(fromId, "male");
  const fromMaleReverse = findReverseFerryRoute("male", toId);

  if (toMaleReverse && fromMaleReverse) {
    return [toMaleReverse, fromMaleReverse];
  }

  return null;
}
