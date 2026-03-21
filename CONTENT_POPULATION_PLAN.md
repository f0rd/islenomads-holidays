# Content Population Plan: Dive & Surf Guides

## Overview

This plan outlines how to populate the `dive_site_guides` and `surf_spot_guides` tables with rich, SEO-optimized content. The strategy prioritizes high-impact dive sites and surf spots first, then expands systematically.

---

## Phase 1: Foundation (Week 1-2) - Top 5 Dive Sites

### Priority Dive Sites
1. **Bathala Thila** (Baa Atoll)
2. **Fish Head** (Baa Atoll)
3. **Hanifaru Bay** (Baa Atoll)
4. **Miyaru Kandu** (Kaafu Atoll)
5. **Golden Wall** (Kaafu Atoll)

### Content Template for Each Dive Site

```json
{
  "placeId": 1,
  "name": "Bathala Thila",
  "slug": "bathala-thila",
  "difficulty": "beginner",
  "depthMin": 5,
  "depthMax": 30,
  "currentStrength": "weak",
  "visibilityMin": 20,
  "visibilityMax": 40,
  "bestTimeStart": 6,
  "bestTimeEnd": 11,
  "distanceFromIsland": 8,
  "boatTimeMinutes": 25,
  "description": "Bathala Thila is a stunning pinnacle dive site perfect for beginners and intermediate divers. The thila rises from 30m to just 5m below the surface, offering excellent coral formations and abundant marine life. The site is known for its healthy hard corals, schools of fusiliers, and frequent sightings of reef sharks and turtles.",
  "tips": "• Arrive early to avoid crowds\n• Watch for strong currents on the outer wall\n• Best photography during morning light\n• Keep an eye out for manta rays during monsoon season",
  "bestFor": "Beginners, Intermediate divers, Coral enthusiasts, Photographers",
  "marineLife": "Reef sharks, Turtles, Fusiliers, Jacks, Groupers, Snappers, Angelfish, Butterflyfish, Parrotfish, Moray eels, Octopus",
  "seasonalVariations": "June-November: Manta rays frequent the site\nDecember-May: Whale sharks occasionally spotted\nYear-round: Consistent shark and turtle sightings",
  "certifications": "Open Water or higher",
  "hazards": "Moderate currents on outer wall, Deep sections require proper buoyancy control",
  "images": "[\"bathala-thila-1.jpg\", \"bathala-thila-2.jpg\", \"bathala-thila-3.jpg\"]",
  "metaTitle": "Bathala Thila Dive Site - Baa Atoll, Maldives",
  "metaDescription": "Explore Bathala Thila, a beginner-friendly pinnacle dive in Baa Atoll with healthy corals, sharks, turtles, and seasonal manta rays.",
  "metaKeywords": "Bathala Thila, Baa Atoll diving, Maldives dive sites, thila diving",
  "published": 1,
  "featured": 1
}
```

### Content Sources
- **Existing dive site descriptions** from your places table
- **Islandii.com** - Reference their depth/current/visibility format
- **Dive operator feedback** - Partner with local dive shops for accuracy
- **User-generated content** - Collect from past divers

### Estimated Time per Site
- Research & writing: 2-3 hours
- Data entry: 30 minutes
- SEO optimization: 1 hour
- **Total: 3.5-4.5 hours per site**

---

## Phase 2: Expansion (Week 3-4) - Remaining Dive Sites (15 sites)

### Dive Sites by Atoll

**Baa Atoll (4 sites)**
- Kuda Rah Thila
- Dhonveli Kandu
- Veligandu Reef
- Villingili Reef

**Kaafu Atoll (6 sites)**
- Artificial Reef
- Banana Reef
- Coral Gardens
- Helengali Thila
- Kandooma Reef
- Maaya Thila

**Alif Alif Atoll (3 sites)**
- Rasdhoo Madivaru
- Madivaru Reef
- Ari Atoll sites

**Seenu Atoll (2 sites)**
- Gan Reef
- Hithadhoo Reef

**Vaavu Atoll (2 sites)**
- Felidhoo Reef
- Vaavu sites

### Content Strategy
- Use consistent template across all sites
- Highlight unique features (manta rays, macro life, wall dives, etc.)
- Include seasonal variations for each location
- Cross-reference related dive sites

### Batch Processing
- Group by atoll for consistency
- Assign 2-3 content writers per atoll
- Quality review before publishing
- **Timeline: 2 weeks for 15 sites**

---

## Phase 3: Surf Spots (Week 5-6) - Top 10 Surf Spots

### Priority Surf Spots
1. **Artificial Beach Break** (Kaafu Atoll)
2. **Chickens** (Kaafu Atoll)
3. **Cokes** (Kaafu Atoll)
4. **Pasta Point** (Kaafu Atoll)
5. **Scotts Head** (Kaafu Atoll)
6. **Riptide** (Kaafu Atoll)
7. **Jailbreaks** (Kaafu Atoll)
8. **Thalapati** (Kaafu Atoll)
9. **Nammos** (Kaafu Atoll)
10. **Honky Tonks** (Kaafu Atoll)

### Content Template for Each Surf Spot

```json
{
  "placeId": 101,
  "name": "Artificial Beach Break",
  "slug": "artificial-beach-break",
  "difficulty": "beginner",
  "waveHeightMin": 2,
  "waveHeightMax": 5,
  "waveType": "Beach break",
  "currentStrength": "weak",
  "windDirection": "Northeast",
  "bestTimeStart": 6,
  "bestTimeEnd": 9,
  "bestTimeOfDay": "Early morning",
  "distanceFromIsland": 3,
  "boatTimeMinutes": 15,
  "description": "Artificial Beach Break is the most accessible beginner-friendly surf spot in the Maldives. Located just 15 minutes from Male, this protected beach break offers consistent, mellow waves perfect for learning. The sandy bottom provides a forgiving landing, and the shallow water makes it ideal for beginners.",
  "tips": "• Go early before crowds\n• Check tide times for best waves\n• Bring reef shoes for sharp coral\n• Watch for local boat traffic\n• Best after monsoon swells",
  "bestFor": "Beginners, Lessons, Family groups, Wave learners",
  "marineLife": "Reef fish, Rays, Occasional sharks (harmless)",
  "seasonalVariations": "March-October: Best swell season\nNovember-February: Smaller, more consistent waves\nJune-September: Larger swells, stronger currents",
  "hazards": "Shallow coral in some areas, Boat traffic, Occasional strong currents",
  "images": "[\"artificial-beach-1.jpg\", \"artificial-beach-2.jpg\"]",
  "metaTitle": "Artificial Beach Break - Best Beginner Surf Spot, Maldives",
  "metaDescription": "Learn to surf at Artificial Beach Break, the most accessible beginner surf spot in the Maldives with mellow waves and sandy bottom.",
  "metaKeywords": "Artificial Beach Break, Maldives surf, beginner surfing, Kaafu Atoll",
  "published": 1,
  "featured": 1
}
```

### Surf Spot Content Sources
- **Local surf guides** - Partner with established surf schools
- **Seasonal data** - Collect from surfing communities
- **Wave forecasts** - Reference historical swell patterns
- **Video content** - Include links to surf spot videos

### Estimated Time per Spot
- Research & writing: 2-3 hours
- Data entry: 30 minutes
- SEO optimization: 1 hour
- **Total: 3.5-4.5 hours per spot**

---

## Phase 4: Enhancement (Week 7-8) - Content Enrichment

### Add to All Guides
- [ ] High-quality images (3-5 per site)
- [ ] Video links (YouTube, Vimeo)
- [ ] User reviews & ratings (when available)
- [ ] Difficulty progression paths
- [ ] Related sites recommendations

### SEO Optimization
- [ ] Optimize meta titles & descriptions
- [ ] Add focus keywords
- [ ] Internal linking between related sites
- [ ] Schema markup for rich snippets
- [ ] Mobile-friendly formatting

### Content Validation
- [ ] Fact-check all information
- [ ] Verify seasonal data accuracy
- [ ] Confirm depth & current ratings
- [ ] Review marine life lists
- [ ] Test all links and images

---

## Data Entry Methods

### Option 1: Direct SQL Inserts (Fastest)
```sql
INSERT INTO dive_site_guides (
  placeId, name, slug, difficulty, depthMin, depthMax,
  currentStrength, visibilityMin, visibilityMax, bestTimeStart, bestTimeEnd,
  distanceFromIsland, boatTimeMinutes, description, tips, bestFor,
  marineLife, seasonalVariations, certifications, hazards, images,
  metaTitle, metaDescription, metaKeywords, published, featured
) VALUES (
  1, 'Bathala Thila', 'bathala-thila', 'beginner', 5, 30,
  'weak', 20, 40, 6, 11, 8, 25,
  'Bathala Thila is a stunning pinnacle...',
  '• Arrive early to avoid crowds...',
  'Beginners, Intermediate divers...',
  'Reef sharks, Turtles, Fusiliers...',
  'June-November: Manta rays...',
  'Open Water or higher',
  'Moderate currents on outer wall...',
  '[\"bathala-thila-1.jpg\", \"bathala-thila-2.jpg\"]',
  'Bathala Thila Dive Site - Baa Atoll, Maldives',
  'Explore Bathala Thila, a beginner-friendly pinnacle...',
  'Bathala Thila, Baa Atoll diving, Maldives dive sites',
  1, 1
);
```

### Option 2: Admin Panel (Recommended)
- Create admin interface for guide creation
- Drag-and-drop image upload
- Rich text editor for descriptions
- Live preview
- Bulk import from CSV

### Option 3: Seed Script
```typescript
// seed-guides.ts
import { db } from './db';
import { diveSiteGuides, surfSpotGuides } from '../drizzle/schema';

const diveSitesData = [
  {
    placeId: 1,
    name: 'Bathala Thila',
    slug: 'bathala-thila',
    // ... rest of data
  },
  // More sites...
];

async function seedGuides() {
  for (const site of diveSitesData) {
    await db.insert(diveSiteGuides).values(site);
  }
  console.log('Guides seeded successfully');
}

seedGuides().catch(console.error);
```

---

## Timeline & Resource Allocation

| Phase | Duration | Sites | Resources | Status |
|-------|----------|-------|-----------|--------|
| Phase 1 | Week 1-2 | 5 dive sites | 1-2 writers | Not started |
| Phase 2 | Week 3-4 | 15 dive sites | 2-3 writers | Not started |
| Phase 3 | Week 5-6 | 10 surf spots | 1-2 writers | Not started |
| Phase 4 | Week 7-8 | All (30 total) | 1-2 editors | Not started |
| **Total** | **8 weeks** | **30 guides** | **2-3 people** | **Planned** |

---

## Quality Checklist

Before publishing each guide, verify:

- [ ] **Accuracy**: All facts verified with local sources
- [ ] **Completeness**: All required fields filled
- [ ] **Images**: 3-5 high-quality images included
- [ ] **SEO**: Meta tags optimized, keywords included
- [ ] **Formatting**: Consistent with template
- [ ] **Links**: All internal links working
- [ ] **Mobile**: Responsive on all devices
- [ ] **Readability**: Clear, concise, engaging writing
- [ ] **Seasonal Data**: Accurate for current season
- [ ] **Marine Life**: Realistic and verified

---

## Content Guidelines

### Writing Style
- **Tone**: Professional yet approachable
- **Length**: 300-500 words for main description
- **Voice**: Second person ("You will see...", "You should watch for...")
- **Sensory**: Include visual, tactile, and experiential details

### Difficulty Levels
- **Beginner**: 0-30m depth, weak currents, 20m+ visibility
- **Intermediate**: 30-40m depth, moderate currents, 15m+ visibility
- **Advanced**: 40m+ depth, strong currents, variable visibility

### Current Strength Scale
- **None**: Negligible water movement
- **Weak**: Gentle drift, easy to swim against
- **Moderate**: Noticeable drift, requires positioning
- **Strong**: Significant drift, requires experience
- **Very Strong**: Challenging, drift diving recommended

### Visibility Scale
- **Poor**: 5-10m (rare in Maldives)
- **Fair**: 10-15m
- **Good**: 15-25m
- **Excellent**: 25-40m
- **Outstanding**: 40m+

---

## Integration with Frontend

### Display Components Needed
1. **Guide Card** - Show name, difficulty, depth, current, visibility
2. **Expandable Sections** - Tips, marine life, seasonal info, hazards
3. **Related Guides** - Show similar difficulty or nearby sites
4. **Difficulty Badge** - Color-coded difficulty indicator
5. **Seasonal Indicator** - Highlight best times to visit

### tRPC Procedures to Create
```typescript
// Get guide by slug
trpc.guides.getDiveGuideBySlug.useQuery({ slug: 'bathala-thila' })

// Get guides by atoll
trpc.guides.getDiveGuidesByAtoll.useQuery({ atollId: 1 })

// Get featured guides
trpc.guides.getFeaturedDiveGuides.useQuery({ limit: 10 })

// Filter by difficulty
trpc.guides.getDiveGuidesByDifficulty.useQuery({ difficulty: 'beginner' })
```

---

## Success Metrics

Track these metrics to measure content population success:

- **Coverage**: % of dive sites with complete guides (Target: 100%)
- **Quality Score**: Average SEO score per guide (Target: 80+)
- **Engagement**: Guide page views & time on page (Target: 2+ min avg)
- **Completeness**: % of fields filled per guide (Target: 95%+)
- **Image Quality**: % guides with 3+ images (Target: 90%+)
- **Seasonal Accuracy**: % guides with accurate seasonal data (Target: 100%)

---

## Next Steps

1. **Week 1**: Assign content writers, gather reference materials
2. **Week 2**: Complete Phase 1 (5 dive sites)
3. **Week 3-4**: Complete Phase 2 (15 dive sites)
4. **Week 5-6**: Complete Phase 3 (10 surf spots)
5. **Week 7-8**: Quality review, SEO optimization, frontend integration

---

## Resources & References

- **Islandii.com** - Content structure & writing style reference
- **Local dive operators** - Accuracy verification & seasonal data
- **Surfing communities** - Swell patterns & spot conditions
- **Google Trends** - SEO keyword research
- **Maldives tourism board** - Official information sources
