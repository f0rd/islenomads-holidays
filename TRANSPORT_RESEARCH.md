# Maldives Transport Research - MTCC Ferry & Speedboat Data

## MTCC Ferry Services Overview

### Main Ferry Routes (from MTCC website)
1. **Hulhumalé Ferry** - Connects Hulhumalé to Malé
2. **Villimalé Ferry** - Connects Villimalé to Malé
3. **Greater Malé Cargo Ferry** - Cargo service in Greater Malé area
4. **Thilafushi Ferry** - Connects Thilafushi (waste management island)
5. **Gulhifalhu Ferry** - Connects Gulhifalhu island
6. **CFN Ferry – All Atolls** - Inter-atoll ferry service connecting all atolls
7. **Meemu Atoll Speed Ferry** - High-speed ferry for Meemu Atoll
8. **Thaa Laamu Speed Ferry** - High-speed ferry for Thaa Laamu Atoll
9. **Zone 6 Speed Ferry** - High-speed ferry for Zone 6 (Haa Dhaalu, Haa Alif)
10. **Kudagiri Ferry** - Connects Kudagiri island
11. **Cycle Ferry – Addu City** - Ferry service for Addu City

### Pricing Information
- **Public Ferry (MTCC)**: $1.50 - $4 USD per person (90 minutes typical)
- **Scheduled Speedboat**: $20-$25 USD per person (60 minutes)
- **Private Speedboat**: $150-$250 USD per person (45 minutes)
- **Resort Speedboat**: Variable pricing

### Key Details
- **Operator**: MTCC (Maldives Transport and Contracting Company)
- **Vessel Types**: 
  - Traditional wooden dhoni ferries (slow, budget-friendly)
  - High-speed ferries (modern speedboats)
- **Capacity**: Varies by vessel (typically 50-150+ passengers)
- **Amenities**: Basic seating, shade, some have air-conditioning on speedboats
- **Hotline**: 1650 (MTCC customer service)

### Ferry Schedule Information
- Schedules vary by season (Ramadan schedules, regular schedules)
- Multiple daily departures on main routes
- Schedules available as PDF documents on MTCC website
- Current schedules for Ramadan 1447 (Feb 2026) available

## Speedboat Operators

### Private Speedboat Services
- Multiple private operators available
- Price range: $20-$25 per person (scheduled services)
- $150-$250 per person (private charter)
- Travel time: 45-60 minutes depending on route
- Modern vessels with air-conditioning and comfortable seating

## Route Categories

### Inter-Island Routes
- Malé to nearby inhabited islands
- Island-to-island transfers within atolls

### Inter-Atoll Routes
- CFN Ferry connects all atolls
- Speed ferries for specific atoll zones

### Cargo Routes
- Greater Malé Cargo Ferry
- Thilafushi Cargo Ferry

## Data Collection Strategy

To populate boat_routes table, we need to:
1. Extract specific routes from each ferry schedule PDF
2. Document departure times and frequencies
3. Record pricing for each route
4. Identify vessel types (wooden ferry vs speedboat)
5. Note operator (MTCC vs private)
6. Calculate travel duration for each route

## Next Steps
- Download and parse specific ferry schedule PDFs
- Extract route-specific data (origin, destination, times, prices)
- Populate database with comprehensive transport information
- Create transport comparison UI for users
