# Database Tables Analysis - 7 Overlapping Geographical Entity Tables

## Overview
The database has 7 tables that store overlapping geographical entity data, causing redundancy and confusion about the source of truth.

---

## Table 1: `mapLocations`
**Purpose:** Store location data for map display
**Key Fields:**
- `id` (PK)
- `name` - Location name
- `latitude`, `longitude` - Coordinates
- `type` - Location type
- `description` - Location description
- `icon` - Map icon

**Current Status:** Used for map functionality
**Data Count:** Unknown (likely has islands, resorts, dive sites)

---

## Table 2: `places`
**Purpose:** Basic geographical entity registry
**Key Fields:**
- `id` (PK)
- `atollId` (FK)
- `name` - Place name
- `code` - Unique place code
- `type` - ENUM: island, dive_site, surf_spot, snorkeling_spot, poi
- `createdAt`, `updatedAt`

**Current Status:** Populated with 129 islands + 3 POIs (132 total)
**Data Count:** 132 records
**Problem:** Only basic info, no content or details

---

## Table 3: `islandGuides`
**Purpose:** Store comprehensive island guide content
**Key Fields:**
- `id` (PK)
- `placeId` (FK to places)
- `name` - Island name
- `atoll` - Atoll name
- `overview` - Island description
- `flightInfo`, `speedboatInfo`, `ferryInfo` - Transportation
- `topThingsToDo` - JSON array of activities
- `foodCafes` - JSON array of restaurants
- `whatToPack`, `healthTips`, `emergencyContacts` - JSON arrays
- `threeDayItinerary`, `fiveDayItinerary` - JSON arrays
- `faq` - JSON array
- `nearbyDiveSites` - JSON array (LLM-generated)
- `nearbySurfSpots` - JSON array (LLM-generated)
- `heroImage`, `images` - Image URLs

**Current Status:** Populated with 129 guides (all with complete content)
**Data Count:** 129 records
**Problem:** Duplicate island data from `places` table; nearby spots stored as JSON instead of normalized records

---

## Table 4: `activitySpots`
**Purpose:** Store detailed information about dive sites, surf spots, snorkeling spots
**Key Fields:**
- `id` (PK)
- `placeId` (FK to places)
- `islandGuideId` (FK to islandGuides)
- `atollId` (FK)
- `primaryTypeId` (FK to activityTypes)
- `name` - Spot name
- `slug` - URL-friendly name
- `spotType` - ENUM: surf_spot, dive_site, snorkeling_spot
- `category` - e.g., "Beginner Dive Sites", "Advanced Surf Breaks"
- `description` - Detailed description
- `difficulty` - ENUM: beginner, intermediate, advanced
- `latitude`, `longitude` - Coordinates
- `accessInfo` - How to reach
- `bestSeason`, `bestTime` - Timing info
- `waterConditions` - Current conditions
- `maxDepth`, `minDepth` - For dive sites
- `marineLife` - JSON array
- `waveHeight`, `waveType` - For surf spots
- `coralCoverage`, `fishSpecies` - For snorkeling
- `tips`, `facilities`, `images` - JSON arrays
- `rating`, `reviewCount`

**Current Status:** EMPTY (no data)
**Data Count:** 0 records
**Problem:** Designed but never populated; nearby spots data is in `islandGuides` instead

---

## Table 5: `activityTypes`
**Purpose:** Store activity type categories (diving, snorkeling, surfing, etc.)
**Key Fields:**
- `id` (PK)
- `key` - Unique key (e.g., "diving", "snorkeling", "surfing")
- `name` - Display name
- `icon` - Icon class or emoji
- `description` - Description
- `sortOrder` - Display order

**Current Status:** Likely empty or minimal data
**Data Count:** Unknown
**Problem:** Separate table for what could be an ENUM; adds unnecessary complexity

---

## Table 6: `islandSpotAccess`
**Purpose:** Many-to-many relationship between islands and activity spots with access metadata
**Key Fields:**
- `id` (PK)
- `islandId` (FK)
- `spotId` (FK to activitySpots)
- `distanceKm` - Distance from island
- `travelTimeMin` - Travel time in minutes
- `transferType` - ENUM: dhoni, speedboat, public_ferry, walk, mixed
- `priceFromUsd` - Cost of transfer
- `operatorNotes` - Notes about access
- `recommended` - Boolean flag
- `sortOrder` - Display order

**Current Status:** EMPTY (no data)
**Data Count:** 0 records
**Problem:** Designed for normalized relationships but never used; nearby spots are in `islandGuides` as JSON

---

## Table 7: `islandExperiences`
**Purpose:** Many-to-many relationship between islands and experiences
**Key Fields:**
- `islandId` (FK)
- `experienceId` (FK)
- `sortOrder` - Display order
- Composite PK: (islandId, experienceId)

**Current Status:** EMPTY (no data)
**Data Count:** 0 records
**Problem:** Designed but never populated; unclear what "experiences" are

---

## Data Redundancy Issues

### Issue 1: Island Identity Stored in Multiple Tables
- **mapLocations** - May have island coordinates
- **places** - Has island name, code, type
- **islandGuides** - Has island name, atoll, and all content

**Solution:** Consolidate into single `geographical_entities` table

### Issue 2: Activity Spots Data Split Across Tables
- **islandGuides.nearbyDiveSites** - JSON array (populated)
- **islandGuides.nearbySurfSpots** - JSON array (populated)
- **activitySpots** - Empty table designed for this data

**Solution:** Migrate JSON data to `activitySpots` table or use new `entity_relationships` table

### Issue 3: Unused Tables
- **activitySpots** - Empty (designed but never populated)
- **islandSpotAccess** - Empty (designed but never populated)
- **islandExperiences** - Empty (designed but never populated)
- **activityTypes** - Likely empty or minimal

**Solution:** Remove or properly populate these tables

### Issue 4: Coordinates Scattered
- **mapLocations** - latitude, longitude
- **activitySpots** - latitude, longitude
- **places** - No coordinates

**Solution:** Centralize coordinates in single table

---

## Current Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ Frontend: IslandGuide Component                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Backend: trpc.islandGuides.getByIslandId                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Database: islandGuides table                             │
│ - Contains ALL island data                              │
│ - Including nearbyDiveSites (JSON)                      │
│ - Including nearbySurfSpots (JSON)                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ├─ References places table (placeId)
                   │
                   └─ References mapLocations (maybe)
```

---

## Recommended Consolidation

### Keep These Tables:
1. **geographical_entities** (new) - Single source of truth for all locations
2. **entity_details** (new) - Extended content for islands
3. **entity_relationships** (new) - Links between entities (nearby spots, etc.)
4. **entity_media** (new) - Images and media for entities

### Archive/Delete These Tables:
- `mapLocations` - Migrate to geographical_entities
- `places` - Migrate to geographical_entities
- `activitySpots` - Migrate to entity_relationships
- `activityTypes` - Convert to ENUM or small lookup table
- `islandSpotAccess` - Migrate to entity_relationships
- `islandExperiences` - Clarify purpose or delete
- `islandGuides` - Migrate to entity_details

---

## Benefits of Consolidation

| Aspect | Current | After Consolidation |
|--------|---------|-------------------|
| Single Source of Truth | No (7 tables) | Yes (1 main table) |
| Data Redundancy | High | Low |
| Query Complexity | High (many JOINs) | Low (fewer JOINs) |
| Maintenance Burden | High | Low |
| Scalability | Limited | Excellent |
| Feature Addition | Difficult | Easy |
| Data Integrity | At Risk | Guaranteed |

