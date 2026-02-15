import { describe, it, expect } from 'vitest';

interface IslandGuideData {
  id: number;
  name: string;
  slug: string;
  atoll: string | null;
  overview: string | null;
  featured: number;
  published: number;
}

interface AtollData {
  id: number;
  name: string;
  slug: string;
  region: string;
  description: string | null;
  heroImage: string | null;
  overview: string | null;
  bestFor: string | null;
  highlights: string | null;
  activities: string | null;
  accommodation: string | null;
  transportation: string | null;
  bestSeason: string | null;
  published: number;
  createdAt: Date;
  updatedAt: Date;
}

// Simulate the filtering logic from AtollDetail component
function filterIslandsByAtoll(allIslands: IslandGuideData[], atollData: AtollData): IslandGuideData[] {
  return allIslands.filter(
    (island: IslandGuideData) => {
      // Ensure we have valid data
      if (!island.atoll || !island.name) return false;
      
      // Check if it's an actual island (not a dive site or attraction)
      const isDiveSite = island.name.toLowerCase().includes('reef') || 
                        island.name.toLowerCase().includes('thila') ||
                        island.name.toLowerCase().includes('kandu') ||
                        island.name.toLowerCase().includes('shark') ||
                        island.name.toLowerCase().includes('bay') ||
                        island.name.toLowerCase().includes('madivaru');
      
      // Strict matching: atoll name must match exactly
      const atollMatches = island.atoll.trim() === atollData.name.trim();
      const isPublished = island.published === 1;
      
      return atollMatches && isPublished && !isDiveSite;
    }
  );
}

describe('AtollDetail - Island Filtering', () => {
  const mockAtoll: AtollData = {
    id: 1,
    name: 'Alif Alif Atoll',
    slug: 'alif-alif-atoll',
    region: 'North',
    description: 'Test atoll',
    heroImage: null,
    overview: 'Test overview',
    bestFor: 'Divers',
    highlights: null,
    activities: null,
    accommodation: null,
    transportation: null,
    bestSeason: 'November to April',
    published: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockIslands: IslandGuideData[] = [
    {
      id: 1,
      name: 'Ukulhas',
      slug: 'ukulhas',
      atoll: 'Alif Alif Atoll',
      overview: 'Clean island with great beaches',
      featured: 1,
      published: 1,
    },
    {
      id: 2,
      name: 'Rasdhoo',
      slug: 'rasdhoo',
      atoll: 'Alif Alif Atoll',
      overview: 'Capital island of Alif Alif Atoll',
      featured: 1,
      published: 1,
    },
    {
      id: 3,
      name: 'Dhigurah',
      slug: 'dhigurah',
      atoll: 'Alif Dhaal Atoll',
      overview: 'Long Island in Alif Dhaal Atoll',
      featured: 1,
      published: 1,
    },
    {
      id: 4,
      name: 'Feridhoo',
      slug: 'feridhoo',
      atoll: 'Alif Alif Atoll',
      overview: 'Remote island with beautiful reef',
      featured: 1,
      published: 1,
    },
    {
      id: 5,
      name: 'Shark Reef',
      slug: 'shark-reef',
      atoll: 'Alif Alif Atoll',
      overview: 'Dive site',
      featured: 0,
      published: 1,
    },
    {
      id: 6,
      name: 'Unpublished Island',
      slug: 'unpublished-island',
      atoll: 'Alif Alif Atoll',
      overview: 'Not published',
      featured: 0,
      published: 0,
    },
  ];

  it('should filter islands by correct atoll name', () => {
    const filtered = filterIslandsByAtoll(mockIslands, mockAtoll);
    
    expect(filtered.length).toBe(3);
    expect(filtered.map(i => i.name)).toEqual(['Ukulhas', 'Rasdhoo', 'Feridhoo']);
  });

  it('should exclude islands from other atolls', () => {
    const filtered = filterIslandsByAtoll(mockIslands, mockAtoll);
    
    const names = filtered.map(i => i.name);
    expect(names).not.toContain('Dhigurah');
  });

  it('should exclude dive sites and attractions', () => {
    const filtered = filterIslandsByAtoll(mockIslands, mockAtoll);
    
    const names = filtered.map(i => i.name);
    expect(names).not.toContain('Shark Reef');
  });

  it('should exclude unpublished islands', () => {
    const filtered = filterIslandsByAtoll(mockIslands, mockAtoll);
    
    const names = filtered.map(i => i.name);
    expect(names).not.toContain('Unpublished Island');
  });

  it('should handle atoll names with whitespace', () => {
    const atollWithSpace: AtollData = {
      ...mockAtoll,
      name: '  Alif Alif Atoll  ',
    };
    
    const filtered = filterIslandsByAtoll(mockIslands, atollWithSpace);
    
    expect(filtered.length).toBe(3);
    expect(filtered.map(i => i.name)).toEqual(['Ukulhas', 'Rasdhoo', 'Feridhoo']);
  });

  it('should return empty array for atoll with no islands', () => {
    const differentAtoll: AtollData = {
      ...mockAtoll,
      name: 'Vaavu Atoll',
    };
    
    const filtered = filterIslandsByAtoll(mockIslands, differentAtoll);
    
    expect(filtered.length).toBe(0);
  });

  it('should exclude islands with null atoll', () => {
    const islandsWithNull: IslandGuideData[] = [
      ...mockIslands,
      {
        id: 7,
        name: 'Unknown Island',
        slug: 'unknown-island',
        atoll: null,
        overview: 'Island with no atoll',
        featured: 1,
        published: 1,
      },
    ];
    
    const filtered = filterIslandsByAtoll(islandsWithNull, mockAtoll);
    
    expect(filtered.length).toBe(3);
    expect(filtered.map(i => i.name)).not.toContain('Unknown Island');
  });

  it('should exclude islands with null name', () => {
    const islandsWithNullName: IslandGuideData[] = [
      ...mockIslands,
      {
        id: 8,
        name: '',
        slug: 'empty-name',
        atoll: 'Alif Alif Atoll',
        overview: 'Island with empty name',
        featured: 1,
        published: 1,
      },
    ];
    
    const filtered = filterIslandsByAtoll(islandsWithNullName, mockAtoll);
    
    expect(filtered.length).toBe(3);
  });

  it('should handle multiple dive site keywords', () => {
    const islandsWithDiveSites: IslandGuideData[] = [
      ...mockIslands,
      {
        id: 9,
        name: 'Thila Reef',
        slug: 'thila-reef',
        atoll: 'Alif Alif Atoll',
        overview: 'Dive site',
        featured: 0,
        published: 1,
      },
      {
        id: 10,
        name: 'Kandu Channel',
        slug: 'kandu-channel',
        atoll: 'Alif Alif Atoll',
        overview: 'Dive site',
        featured: 0,
        published: 1,
      },
    ];
    
    const filtered = filterIslandsByAtoll(islandsWithDiveSites, mockAtoll);
    
    expect(filtered.length).toBe(3);
    expect(filtered.map(i => i.name)).not.toContain('Thila Reef');
    expect(filtered.map(i => i.name)).not.toContain('Kandu Channel');
  });
});
