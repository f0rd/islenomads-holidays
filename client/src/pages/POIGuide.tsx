import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Waves, Users, Calendar, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface POIGuideData {
  id: number;
  name: string;
  type: 'dive_site' | 'reef' | 'channel' | 'thila';
  atoll: string;
  description: string;
  longDescription: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  depth: string;
  bestSeason: string;
  marineLife: string[];
  highlights: string[];
  safetyTips: string[];
  image: string;
  coordinates?: { lat: number; lng: number };
}

const POI_GUIDES: Record<number, POIGuideData> = {
  9: {
    id: 9,
    name: 'Maaya Thila',
    type: 'thila',
    atoll: 'Ari Atoll',
    description: 'World-class dive site featuring dramatic underwater topography with vertical walls and over 200 species of fish.',
    longDescription: `Maaya Thila is one of the most spectacular dive sites in the Maldives, renowned for its dramatic underwater mountain formation. This thila (underwater mountain) rises from depths of 30+ meters and features stunning vertical walls, swim-throughs, and overhangs covered in vibrant coral and sponges. The site is famous for its abundant marine life, including reef sharks, groupers, snappers, and schools of jacks and trevally.

The dive site is suitable for intermediate to advanced divers due to strong currents that can occur. The best time to visit is during the dry season when visibility is excellent and marine life is most active. Night dives at Maaya Thila are particularly spectacular, with nocturnal creatures emerging from their daytime hiding spots.`,
    difficulty: 'Intermediate',
    depth: '5-40m',
    bestSeason: 'November to April',
    marineLife: ['Reef Sharks', 'Groupers', 'Snappers', 'Jacks', 'Trevally', 'Moray Eels', 'Octopus'],
    highlights: [
      'Dramatic vertical walls and overhangs',
      'Abundant pelagic fish schools',
      'Excellent coral formations',
      'Strong currents attract large fish',
      'Spectacular night diving'
    ],
    safetyTips: [
      'Check current conditions before diving',
      'Maintain good buoyancy control',
      'Stay close to your dive buddy',
      'Be aware of strong currents',
      'Watch for larger marine animals'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
  },
  4: {
    id: 4,
    name: 'HP Reef',
    type: 'reef',
    atoll: 'Kaafu Atoll',
    description: 'Pristine coral reef with excellent visibility and diverse marine life, perfect for all diving levels.',
    longDescription: `HP Reef is a beautiful coral reef system in Kaafu Atoll, known for its pristine condition and excellent visibility. The reef features a gradual slope from 5 meters to 30+ meters, making it accessible for divers of all levels. The site is characterized by healthy hard and soft corals, abundant fish life, and excellent photo opportunities.

The reef is particularly popular for daytime dives, offering consistent conditions and reliable marine life encounters. The site is less crowded than some other popular reefs, making it an excellent choice for those seeking a more peaceful diving experience. The reef's shallow sections are also ideal for snorkeling.`,
    difficulty: 'Beginner',
    depth: '5-35m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Butterflyfish', 'Angelfish', 'Wrasses', 'Groupers', 'Snappers', 'Sea Turtles'],
    highlights: [
      'Pristine coral formations',
      'Excellent visibility',
      'Suitable for all levels',
      'Abundant fish life',
      'Great for photography'
    ],
    safetyTips: [
      'Follow the reef contour',
      'Maintain proper buoyancy',
      'Watch for boat traffic',
      'Respect the coral',
      'Stay within your depth limits'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  26: {
    id: 26,
    name: 'Kandooma Thila',
    type: 'thila',
    atoll: 'Kaafu Atoll',
    description: 'Beautiful underwater mountain with excellent coral coverage and diverse fish populations.',
    longDescription: `Kandooma Thila is a stunning underwater mountain located in Kaafu Atoll, featuring excellent coral formations and abundant marine life. The thila rises from depths of 20+ meters and is covered with vibrant hard and soft corals. The site is known for its healthy ecosystem and consistent marine life encounters.

The dive site offers multiple entry points and can be dived at various depths, making it suitable for intermediate divers. The currents are generally moderate, and visibility is usually excellent. The site is less crowded than some other popular thilas, offering a more intimate diving experience.`,
    difficulty: 'Intermediate',
    depth: '10-40m',
    bestSeason: 'November to April',
    marineLife: ['Reef Sharks', 'Groupers', 'Snappers', 'Jacks', 'Fusiliers', 'Trevally', 'Moray Eels'],
    highlights: [
      'Excellent coral formations',
      'Abundant fish life',
      'Multiple dive routes',
      'Moderate currents',
      'Great for macro photography'
    ],
    safetyTips: [
      'Plan your dive route',
      'Monitor your air consumption',
      'Stay with your dive buddy',
      'Be aware of current direction',
      'Watch for larger fish'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  66: {
    id: 66,
    name: 'Thoddoo House Reef',
    type: 'reef',
    atoll: 'Kaafu Atoll',
    description: 'House reef of Thoddoo Island offering convenient diving and excellent marine biodiversity.',
    longDescription: `Thoddoo House Reef is a convenient diving option for those staying on or visiting Thoddoo Island. The reef features a gradual slope from the shallow lagoon to deeper waters, with excellent coral formations and diverse fish life. The site is accessible year-round and offers consistent diving conditions.

The house reef is particularly popular for early morning and sunset dives, when the light is ideal for photography. The shallow sections are perfect for snorkeling, while deeper areas offer more challenging diving. The reef's proximity to the island makes it an excellent choice for shore dives.`,
    difficulty: 'Beginner',
    depth: '5-30m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Wrasses', 'Groupers', 'Snappers', 'Sea Turtles', 'Rays', 'Octopus'],
    highlights: [
      'Shore dive access',
      'Excellent coral coverage',
      'Great for all levels',
      'Abundant fish life',
      'Perfect for photography'
    ],
    safetyTips: [
      'Check entry and exit points',
      'Be aware of boat traffic',
      'Maintain proper buoyancy',
      'Respect the reef',
      'Follow island guidelines'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  69: {
    id: 69,
    name: 'Ukulhas House Reef',
    type: 'reef',
    atoll: 'Kaafu Atoll',
    description: 'Beautiful house reef with diverse coral and fish species, ideal for all diving levels.',
    longDescription: `Ukulhas House Reef offers excellent diving opportunities for those staying on Ukulhas Island. The reef features healthy coral formations and abundant marine life, with a gradual slope suitable for divers of all levels. The site is known for its consistent conditions and reliable fish encounters.

The house reef is particularly popular for night dives, when nocturnal creatures become active. The shallow sections are ideal for snorkeling and macro photography, while deeper areas offer more challenging diving experiences.`,
    difficulty: 'Beginner',
    depth: '5-30m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Butterflyfish', 'Wrasses', 'Groupers', 'Sea Turtles', 'Rays', 'Octopus'],
    highlights: [
      'Shore dive access',
      'Excellent coral formations',
      'Suitable for all levels',
      'Great for night diving',
      'Abundant macro life'
    ],
    safetyTips: [
      'Check entry and exit points',
      'Maintain proper buoyancy',
      'Watch for boat traffic',
      'Respect the reef',
      'Use proper lighting for night dives'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  70: {
    id: 70,
    name: 'Veligandu Reef',
    type: 'reef',
    atoll: 'Kaafu Atoll',
    description: 'Pristine reef system with excellent visibility and abundant marine biodiversity.',
    longDescription: `Veligandu Reef is a beautiful and well-preserved reef system known for its excellent visibility and abundant marine life. The reef features healthy coral formations and consistent fish populations, making it a reliable dive site throughout the year. The site is suitable for divers of all levels and offers excellent photo opportunities.

The reef's shallow sections are ideal for snorkeling, while deeper areas provide more challenging diving. The site is less crowded than some other popular reefs, offering a more peaceful diving experience.`,
    difficulty: 'Beginner',
    depth: '5-35m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Angelfish', 'Wrasses', 'Groupers', 'Snappers', 'Sea Turtles', 'Rays'],
    highlights: [
      'Excellent visibility',
      'Pristine coral formations',
      'Suitable for all levels',
      'Abundant fish life',
      'Great for photography'
    ],
    safetyTips: [
      'Follow the reef contour',
      'Maintain proper buoyancy',
      'Watch for boat traffic',
      'Respect the coral',
      'Stay within your depth limits'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  100: {
    id: 100,
    name: 'Banana Reef',
    type: 'reef',
    atoll: 'Kaafu Atoll',
    description: 'Famous reef named for its distinctive shape, offering excellent diving and snorkeling.',
    longDescription: `Banana Reef is one of the most famous dive sites in Kaafu Atoll, named for its distinctive curved shape. The reef is known for its excellent coral formations and abundant marine life, making it a popular choice for divers of all levels. The site offers multiple dive routes and consistent diving conditions throughout the year.

The reef's shallow sections are ideal for snorkeling, while deeper areas provide more challenging diving. The site is particularly popular for daytime dives, offering excellent visibility and reliable fish encounters. Night dives at Banana Reef are also spectacular.`,
    difficulty: 'Beginner',
    depth: '5-35m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Butterflyfish', 'Wrasses', 'Groupers', 'Snappers', 'Sea Turtles', 'Rays'],
    highlights: [
      'Distinctive reef shape',
      'Excellent coral formations',
      'Suitable for all levels',
      'Multiple dive routes',
      'Great for photography'
    ],
    safetyTips: [
      'Plan your dive route',
      'Maintain proper buoyancy',
      'Watch for boat traffic',
      'Respect the coral',
      'Stay with your dive buddy'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  104: {
    id: 104,
    name: 'Dhigurah House Reef',
    type: 'reef',
    atoll: 'Vaavu Atoll',
    description: 'House reef of Dhigurah Island with excellent coral and diverse fish populations.',
    longDescription: `Dhigurah House Reef is a beautiful house reef offering convenient diving for those staying on Dhigurah Island. The reef features healthy coral formations and abundant marine life, with a gradual slope suitable for divers of all levels. The site is known for its consistent conditions and reliable fish encounters.

The house reef is particularly popular for shore dives and snorkeling. The shallow sections offer excellent macro photography opportunities, while deeper areas provide more challenging diving experiences.`,
    difficulty: 'Beginner',
    depth: '5-30m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Wrasses', 'Groupers', 'Snappers', 'Sea Turtles', 'Rays', 'Octopus'],
    highlights: [
      'Shore dive access',
      'Excellent coral coverage',
      'Great for all levels',
      'Abundant fish life',
      'Perfect for photography'
    ],
    safetyTips: [
      'Check entry and exit points',
      'Be aware of boat traffic',
      'Maintain proper buoyancy',
      'Respect the reef',
      'Follow island guidelines'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  },
  110: {
    id: 110,
    name: 'Fuvahmulah Tiger Shark',
    type: 'dive_site',
    atoll: 'Seenu Atoll',
    description: 'Unique dive site famous for tiger shark encounters and specialized diving experiences.',
    longDescription: `Fuvahmulah Tiger Shark is a unique and thrilling dive site located in Seenu Atoll, famous for its tiger shark encounters. The site offers specialized diving experiences, including tiger shark specialty courses. Divers have the opportunity to observe these magnificent creatures in their natural habitat.

The dive site requires intermediate to advanced diving skills and proper training. The site is best visited during specific seasons when tiger sharks are most active. This is an unforgettable experience for adventurous divers seeking a unique encounter with one of the ocean's most iconic predators.`,
    difficulty: 'Advanced',
    depth: '20-40m',
    bestSeason: 'August to October',
    marineLife: ['Tiger Sharks', 'Reef Sharks', 'Groupers', 'Snappers', 'Jacks', 'Trevally'],
    highlights: [
      'Tiger shark encounters',
      'Unique diving experience',
      'Specialized training available',
      'Thrilling marine encounters',
      'Unforgettable memories'
    ],
    safetyTips: [
      'Complete proper training',
      'Follow guide instructions carefully',
      'Maintain group cohesion',
      'Respect the animals',
      'Be aware of your surroundings'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
  },
  20: {
    id: 20,
    name: 'Felidhoo Kandu',
    type: 'channel',
    atoll: 'Vaavu Atoll',
    description: 'Channel dive site with strong currents and abundant pelagic marine life.',
    longDescription: `Felidhoo Kandu is a channel dive site known for its strong currents and abundant pelagic marine life. The channel connects the lagoon to the open ocean, creating ideal conditions for large fish encounters. The site is best dived during slack tide or when currents are moderate.

The channel offers excellent opportunities to observe large schools of fish, rays, and occasionally larger pelagic species. The site requires intermediate to advanced diving skills due to current conditions. Drift diving is a popular technique at this site.`,
    difficulty: 'Intermediate',
    depth: '10-40m',
    bestSeason: 'November to April',
    marineLife: ['Jacks', 'Trevally', 'Snappers', 'Groupers', 'Rays', 'Sharks', 'Tuna'],
    highlights: [
      'Strong currents attract large fish',
      'Excellent pelagic encounters',
      'Drift diving opportunities',
      'Abundant fish schools',
      'Thrilling diving experience'
    ],
    safetyTips: [
      'Check current conditions',
      'Use drift diving techniques',
      'Stay with your dive buddy',
      'Be aware of current direction',
      'Plan your exit point'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
  },
  42: {
    id: 42,
    name: 'Fulidhoo Kandu',
    type: 'channel',
    atoll: 'Vaavu Atoll',
    description: 'Channel with strong currents and excellent opportunities for pelagic encounters.',
    longDescription: `Fulidhoo Kandu is a channel dive site offering excellent opportunities for pelagic encounters. The channel's strong currents create ideal conditions for large fish aggregations, including jacks, trevally, and snappers. The site is best dived during slack tide or when currents are manageable.

The channel offers thrilling drift diving experiences and excellent photo opportunities. The site requires intermediate to advanced diving skills due to current conditions. Proper planning and current awareness are essential for safe diving.`,
    difficulty: 'Intermediate',
    depth: '10-40m',
    bestSeason: 'November to April',
    marineLife: ['Jacks', 'Trevally', 'Snappers', 'Groupers', 'Rays', 'Sharks', 'Tuna'],
    highlights: [
      'Strong currents attract large fish',
      'Excellent pelagic encounters',
      'Drift diving opportunities',
      'Abundant fish schools',
      'Thrilling diving experience'
    ],
    safetyTips: [
      'Check current conditions',
      'Use drift diving techniques',
      'Stay with your dive buddy',
      'Be aware of current direction',
      'Plan your exit point'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
  },
  92: {
    id: 92,
    name: 'Naifaru Kandu',
    type: 'channel',
    atoll: 'Lhaviyani Atoll',
    description: 'Channel dive site with strong currents and abundant marine life.',
    longDescription: `Naifaru Kandu is a channel dive site known for its strong currents and abundant marine life. The channel creates ideal conditions for pelagic fish encounters, including large schools of jacks, trevally, and snappers. The site is best dived during slack tide or when currents are moderate.

The channel offers excellent opportunities for drift diving and large fish encounters. The site requires intermediate to advanced diving skills due to current conditions. Proper planning and current awareness are essential for safe and enjoyable diving.`,
    difficulty: 'Intermediate',
    depth: '10-40m',
    bestSeason: 'November to April',
    marineLife: ['Jacks', 'Trevally', 'Snappers', 'Groupers', 'Rays', 'Sharks', 'Tuna'],
    highlights: [
      'Strong currents attract large fish',
      'Excellent pelagic encounters',
      'Drift diving opportunities',
      'Abundant fish schools',
      'Thrilling diving experience'
    ],
    safetyTips: [
      'Check current conditions',
      'Use drift diving techniques',
      'Stay with your dive buddy',
      'Be aware of current direction',
      'Plan your exit point'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
  },
  107: {
    id: 107,
    name: 'Fotteyo Kandu',
    type: 'channel',
    atoll: 'Lhaviyani Atoll',
    description: 'Channel with strong currents and excellent pelagic diving opportunities.',
    longDescription: `Fotteyo Kandu is a channel dive site offering excellent pelagic diving opportunities. The channel's strong currents create ideal conditions for large fish encounters and drift diving. The site is best dived during slack tide or when currents are manageable.

The channel is known for its thrilling diving experiences and excellent photo opportunities. The site requires intermediate to advanced diving skills due to current conditions. Proper planning and current awareness are essential for safe diving.`,
    difficulty: 'Intermediate',
    depth: '10-40m',
    bestSeason: 'November to April',
    marineLife: ['Jacks', 'Trevally', 'Snappers', 'Groupers', 'Rays', 'Sharks', 'Tuna'],
    highlights: [
      'Strong currents attract large fish',
      'Excellent pelagic encounters',
      'Drift diving opportunities',
      'Abundant fish schools',
      'Thrilling diving experience'
    ],
    safetyTips: [
      'Check current conditions',
      'Use drift diving techniques',
      'Stay with your dive buddy',
      'Be aware of current direction',
      'Plan your exit point'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
  },
  64: {
    id: 64,
    name: 'Rasdhoo Madivaru',
    type: 'reef',
    atoll: 'Alif Alif Atoll',
    description: 'Beautiful reef system with excellent coral and diverse fish populations.',
    longDescription: `Rasdhoo Madivaru is a beautiful reef system located in Alif Alif Atoll, known for its excellent coral formations and diverse fish populations. The reef features healthy hard and soft corals and consistent marine life encounters. The site is suitable for divers of all levels and offers excellent photo opportunities.

The reef's shallow sections are ideal for snorkeling, while deeper areas provide more challenging diving. The site is less crowded than some other popular reefs, offering a more peaceful diving experience.`,
    difficulty: 'Beginner',
    depth: '5-35m',
    bestSeason: 'Year-round',
    marineLife: ['Parrotfish', 'Angelfish', 'Wrasses', 'Groupers', 'Snappers', 'Sea Turtles', 'Rays'],
    highlights: [
      'Excellent coral formations',
      'Diverse fish populations',
      'Suitable for all levels',
      'Peaceful diving experience',
      'Great for photography'
    ],
    safetyTips: [
      'Follow the reef contour',
      'Maintain proper buoyancy',
      'Watch for boat traffic',
      'Respect the coral',
      'Stay within your depth limits'
    ],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop'
  }
};

export default function POIGuide() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const poiId = params.id ? parseInt(params.id) : null;
  
  if (!poiId || !POI_GUIDES[poiId]) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">POI Not Found</h1>
            <p className="text-muted-foreground mb-6">The point of interest you're looking for doesn't exist.</p>
            <Link href="/explore-maldives">
              <Button>Back to Explore Maldives</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const poi = POI_GUIDES[poiId];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${poi.image})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container relative h-full flex flex-col justify-end pb-8">
          <Link href="/explore-maldives">
            <Button variant="outline" size="sm" className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-5xl font-bold text-white mb-2">{poi.name}</h1>
          <p className="text-xl text-white/90">{poi.description}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{poi.longDescription}</p>
              </CardContent>
            </Card>

            {/* Marine Life */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="w-5 h-5" />
                  Marine Life
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {poi.marineLife.map((species) => (
                    <Badge key={species} variant="secondary">
                      {species}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {poi.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-accent mt-1">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <AlertCircle className="w-5 h-5" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {poi.safetyTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-yellow-900">
                      <span className="font-bold mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {poi.atoll}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <Badge className="capitalize">{poi.type.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                  <Badge variant="outline">{poi.difficulty}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Depth Range</p>
                  <p className="font-semibold">{poi.depth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Best Season
                  </p>
                  <p className="font-semibold">{poi.bestSeason}</p>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-accent">
              <CardContent className="pt-6">
                <p className="text-sm text-accent-foreground mb-4">
                  Ready to explore this amazing dive site?
                </p>
                <Link href="/trip-planner">
                  <Button className="w-full bg-white text-accent hover:bg-white/90">
                    Plan Your Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
