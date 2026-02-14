# Navigation Links Refactoring - Update Guide

This document provides code snippets for updating all navigation links throughout the application to use island IDs instead of slugs.

## 1. Update Home.tsx Island Links

**BEFORE:**
```tsx
<Link href={`/island/${guide.slug}`}>
  {guide.name}
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl } from "@/shared/locations";

<Link href={getIslandGuideUrl(guide.id)}>
  {guide.name}
</Link>
```

---

## 2. Update ExploreMaldives.tsx Island Links

**BEFORE:**
```tsx
{/* Featured Islands */}
<Link key={island.id} href={`/island/${island.slug}`}>
  <Card>
    <h3>{island.name}</h3>
  </Card>
</Link>

{/* POIs */}
<Link key={poi.id} href={`/island/${poi.slug}`}>
  <Card>
    <h3>{poi.name}</h3>
  </Card>
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl } from "@/shared/locations";

{/* Featured Islands */}
<Link key={island.id} href={getIslandGuideUrl(island.id)}>
  <Card>
    <h3>{island.name}</h3>
  </Card>
</Link>

{/* POIs */}
<Link key={poi.id} href={getIslandGuideUrl(poi.id)}>
  <Card>
    <h3>{poi.name}</h3>
  </Card>
</Link>
```

---

## 3. Update AtollDetail.tsx Island Links

**BEFORE:**
```tsx
<Link key={island.id} href={`/island/${island.slug}`}>
  {island.name}
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl } from "@/shared/locations";

<Link key={island.id} href={getIslandGuideUrl(island.id)}>
  {island.name}
</Link>
```

---

## 4. Update IslandGuides.tsx Island Links

**BEFORE:**
```tsx
<Link key={guide.id} href={`/island/${guide.slug}`}>
  <Card>
    <h3>{guide.name}</h3>
  </Card>
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl } from "@/shared/locations";

<Link key={guide.id} href={getIslandGuideUrl(guide.id)}>
  <Card>
    <h3>{guide.name}</h3>
  </Card>
</Link>
```

---

## 5. Update MaldivesMap.tsx Island Links

**BEFORE:**
```tsx
<Link href={`/island/${selectedIsland.slug}`}>
  View Guide
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl } from "@/shared/locations";

<Link href={getIslandGuideUrl(selectedIsland.id)}>
  View Guide
</Link>
```

---

## 6. Update MaldivesMapNew.tsx Island Links

**BEFORE:**
```tsx
<Link href={`/island/${(selectedLocation as any).guideSlug}`}>
  View Guide
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl } from "@/shared/locations";

<Link href={getIslandGuideUrl((selectedLocation as any).guideId)}>
  View Guide
</Link>
```

---

## 7. Update IslandDetail.tsx Navigation

**BEFORE:**
```tsx
import { ISLAND_NAVIGATION } from "./IslandGuide";

<Link href={`/island/${previousIsland.slug}`}>
  Previous
</Link>

<Link href={`/island/${nextIsland.slug}`}>
  Next
</Link>
```

**AFTER:**
```tsx
import { getIslandGuideUrl, getAdjacentIslands } from "@/shared/locations";

// Get adjacent islands
const adjacentIslands = getAdjacentIslands(currentIslandId);

{adjacentIslands.previous && (
  <Link href={getIslandGuideUrl(adjacentIslands.previous.id)}>
    Previous: {adjacentIslands.previous.name}
  </Link>
)}

{adjacentIslands.next && (
  <Link href={getIslandGuideUrl(adjacentIslands.next.id)}>
    Next: {adjacentIslands.next.name}
  </Link>
)}
```

---

## 8. Update App.tsx Routing

**BEFORE:**
```tsx
<Route path={"/island/:islandId"} component={IslandGuide} />
<Route path={"/island/:slug"} component={IslandDetail} />
```

**AFTER:**
```tsx
{/* Primary route: /island/:islandId (e.g., /island/1, /island/5) */}
<Route path={"/island/:islandId"} component={IslandGuide} />

{/* Fallback route for backward compatibility with slug-based URLs */}
<Route path={"/island-detail/:slug"} component={IslandDetail} />
```

---

## 9. Update Navigation Components

If you have a navigation component that lists islands:

**BEFORE:**
```tsx
const ISLAND_NAVIGATION = [
  { slug: "male-guide", name: "Male City" },
  { slug: "maafushi-island", name: "Maafushi Island" },
  { slug: "thoddoo-island", name: "Thoddoo Island" },
];

{ISLAND_NAVIGATION.map(island => (
  <Link key={island.slug} href={`/island/${island.slug}`}>
    {island.name}
  </Link>
))}
```

**AFTER:**
```tsx
import { getIslandNavigationLinks } from "@/shared/locations";

const navigationLinks = getIslandNavigationLinks();

{navigationLinks.map(link => (
  <Link key={link.id} href={link.url}>
    {link.name}
  </Link>
))}
```

---

## Helper Functions Available

All these functions are available from `@/shared/locations`:

```tsx
// Get island by ID
getIslandById(id: number): IslandLocation | undefined

// Get island by name
getIslandByName(name: string): IslandLocation | undefined

// Get island by slug (backward compatibility)
getIslandBySlug(slug: string): IslandLocation | undefined

// Build URL with island ID
getIslandGuideUrl(islandId: number): string
// Usage: getIslandGuideUrl(1) => '/island/1'

// Build URL with slug (deprecated)
getIslandGuideUrlBySlug(slug: string): string
// Usage: getIslandGuideUrlBySlug('male-guide') => '/island/male-guide'

// Get navigation links
getIslandNavigationLinks(): Array<{ id: number; name: string; url: string }>

// Get previous and next island
getAdjacentIslands(currentIslandId: number): {
  previous: IslandLocation | null;
  next: IslandLocation | null;
}
```

---

## Implementation Steps

1. **Create** `shared/locations.ts` with the unified island configuration
2. **Update** `server/db.ts` with `getIslandGuideByIslandId()` and `getPlaceWithGuide()`
3. **Update** `server/routers.ts` to add `getByIslandId` and `getPlaceWithGuide` procedures
4. **Replace** `client/src/App.tsx` with the updated routing
5. **Replace** `client/src/pages/IslandGuide.tsx` with the updated component
6. **Update** all other components using the snippets above
7. **Test** all navigation links to ensure they work correctly

---

## Backward Compatibility

During the transition period:
- Old slug-based URLs will still work via the `getBySlug` procedure
- The `getIslandGuideUrlBySlug()` helper is available for backward compatibility
- Gradually update components to use the new ID-based system
- Once all components are updated, the slug-based routes can be removed

---

## Benefits

✅ **Consistent ID usage** - All references use the same unified ID system  
✅ **No slug mismatches** - Eliminates "guraidhoo-island" vs "guraidhoo" issues  
✅ **Scalable** - Easy to add new islands without slug conflicts  
✅ **Type-safe** - TypeScript ensures correct usage  
✅ **Centralized** - All island data in one place for easy maintenance  
