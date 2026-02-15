# Data Consolidation Plan - Isle Nomads Database

## Current Redundant Structure

### Problem: Multiple tables storing overlapping geographical entity data

**Current Tables:**
1. `mapLocations` - Map-related location data
2. `places` - Basic place info (id, name, code, type)
3. `islandGuides` - Island guide content (overview, activities, food, etc.)
4. `activitySpots` - Detailed activity spots (dive sites, surf spots) - EMPTY
5. `activityTypes` - Activity type categories
6. `islandSpotAccess` - Access information for spots - EMPTY
7. `islandExperiences` - Island experiences - EMPTY

### Data Duplication Issues

- **Island identification**: Same island stored in `places`, `islandGuides`, and `mapLocations`
- **Activity spots**: Nearby dive sites and surf spots stored as JSON in `islandGuides.nearbyDiveSites/nearbySurfSpots` but `activitySpots` table is empty
- **Location data**: Geographic coordinates scattered across multiple tables
- **Type information**: Place types in `places` table, activity types in `activityTypes` table

## Proposed Unified Structure

### Single Source of Truth: `geographical_entities` table

```sql
CREATE TABLE geographical_entities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Identity
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE,
  
  -- Classification
  entityType ENUM('island', 'dive_site', 'surf_spot', 'snorkeling_spot', 'airport', 'resort', 'poi') NOT NULL,
  
  -- Location
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  atollId INT,
  
  -- Content
  description TEXT,
  overview TEXT,
  heroImage VARCHAR(255),
  
  -- Metadata
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (atollId) REFERENCES atolls(id)
);
```

### Supporting Tables (Normalized)

#### `entity_details` - Extended content for islands
```sql
CREATE TABLE entity_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entityId INT NOT NULL,
  
  -- Island-specific
  bestTimeToVisit VARCHAR(255),
  currency VARCHAR(10),
  language VARCHAR(100),
  
  -- Transportation
  flightInfo TEXT,
  speedboatInfo TEXT,
  ferryInfo TEXT,
  
  -- Content sections
  activities TEXT, -- JSON array
  restaurants TEXT, -- JSON array
  whatToPack TEXT, -- JSON array
  healthTips TEXT, -- JSON array
  emergencyContacts TEXT, -- JSON array
  
  -- Itineraries
  threeDayItinerary TEXT, -- JSON array
  fiveDayItinerary TEXT, -- JSON array
  
  -- FAQ
  faq TEXT, -- JSON array
  
  FOREIGN KEY (entityId) REFERENCES geographical_entities(id) ON DELETE CASCADE
);
```

#### `entity_relationships` - Links between entities (e.g., nearby dive sites)
```sql
CREATE TABLE entity_relationships (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sourceEntityId INT NOT NULL,
  targetEntityId INT NOT NULL,
  relationshipType ENUM('nearby_dive_site', 'nearby_surf_spot', 'nearby_snorkeling', 'airport_access', 'resort_access') NOT NULL,
  distance VARCHAR(50), -- e.g., "2 km"
  difficulty VARCHAR(50), -- e.g., "Beginner", "Intermediate", "Advanced"
  notes TEXT,
  
  UNIQUE KEY (sourceEntityId, targetEntityId, relationshipType),
  FOREIGN KEY (sourceEntityId) REFERENCES geographical_entities(id) ON DELETE CASCADE,
  FOREIGN KEY (targetEntityId) REFERENCES geographical_entities(id) ON DELETE CASCADE
);
```

#### `entity_media` - Images and media
```sql
CREATE TABLE entity_media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entityId INT NOT NULL,
  mediaType ENUM('image', 'video', 'audio') NOT NULL,
  url VARCHAR(255) NOT NULL,
  caption TEXT,
  displayOrder INT DEFAULT 0,
  
  FOREIGN KEY (entityId) REFERENCES geographical_entities(id) ON DELETE CASCADE
);
```

## Migration Strategy

### Phase 1: Create new unified structure
- Create `geographical_entities` table
- Create supporting tables
- Migrate data from `places` and `islandGuides`

### Phase 2: Populate relationships
- Migrate `nearbyDiveSites` from `islandGuides` to `entity_relationships`
- Migrate `nearbySurfSpots` from `islandGuides` to `entity_relationships`

### Phase 3: Deprecate old tables
- Keep old tables for reference (read-only)
- Update all queries to use new structure
- Test thoroughly

### Phase 4: Clean up
- Delete old tables after verification
- Update all foreign keys

## Benefits of Consolidation

1. **Single source of truth** - All geographical entities in one table
2. **Reduced redundancy** - No duplicate data across tables
3. **Flexible relationships** - Easy to add new entity types and relationships
4. **Better scalability** - Easier to add new features (reviews, ratings, etc.)
5. **Cleaner queries** - Simpler JOINs and fewer table lookups
6. **Consistent IDs** - All entities use same ID system

## Implementation Timeline

- **Week 1**: Design finalization and review
- **Week 2**: Create new tables and migration scripts
- **Week 3**: Migrate data and test
- **Week 4**: Update application code and deploy
- **Week 5**: Monitor and clean up old tables
