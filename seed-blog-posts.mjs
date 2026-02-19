import { getDb } from './server/db.ts';
import { blogPosts } from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

const sampleBlogPosts = [
  {
    title: 'Ultimate Guide to Snorkeling in the Maldives: Best Spots and Tips for 2024',
    slug: 'ultimate-guide-snorkeling-maldives',
    author: 'Sarah Mitchell',
    category: 'water-sports',
    excerpt: 'Discover the world\'s most spectacular snorkeling destinations in the Maldives. From vibrant coral reefs to exotic marine life, learn where to find the best snorkeling spots and essential tips for an unforgettable underwater adventure.',
    content: 'The Maldives stands as one of the world\'s premier snorkeling destinations, offering crystal-clear waters, pristine coral reefs, and an abundance of marine biodiversity. The warm tropical waters maintain temperatures between 26-30°C year-round. With over 1,190 coral islands, each atoll presents unique snorkeling opportunities. Popular sites include Banana Reef in North Male Atoll, known for its distinctive shape and diverse fish populations, and Baa Atoll\'s Hanifaru Bay, where manta rays congregate seasonally.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    tags: 'snorkeling, maldives, water-sports, travel-guide, marine-life',
    metaTitle: 'Ultimate Guide to Snorkeling in the Maldives: Best Spots and Tips',
    metaDescription: 'Discover the best snorkeling spots in the Maldives with our comprehensive guide. Learn essential tips, seasonal insights, and marine life information for an unforgettable underwater adventure.',
    focusKeyword: 'snorkeling in the Maldives',
    ogTitle: 'Ultimate Guide to Snorkeling in the Maldives',
    ogDescription: 'Explore the world\'s best snorkeling destinations in the Maldives with expert tips and insider knowledge about coral reefs and marine life.',
    published: true,
  },
  {
    title: 'Luxury Overwater Bungalows: Experience the Ultimate Maldives Paradise',
    slug: 'luxury-overwater-bungalows-maldives',
    author: 'James Richardson',
    category: 'luxury',
    excerpt: 'Immerse yourself in the pinnacle of tropical luxury with our guide to the Maldives\' most exclusive overwater bungalows. Discover what makes these iconic accommodations the ultimate destination for honeymooners and luxury travelers.',
    content: 'The overwater bungalow represents the quintessential symbol of tropical luxury—a private sanctuary suspended above crystalline waters. The Maldives has perfected this concept, transforming simple wooden structures into architectural masterpieces. Modern Maldivian overwater bungalows showcase remarkable engineering and design innovation, featuring private infinity pools, underwater glass floor panels, and spa facilities that rival five-star resorts.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    tags: 'luxury, overwater-bungalows, maldives, resorts, honeymoon',
    metaTitle: 'Luxury Overwater Bungalows in the Maldives: Ultimate Paradise Experience',
    metaDescription: 'Explore luxury overwater bungalows in the Maldives. Discover architectural excellence, premium amenities, and why these iconic accommodations are perfect for honeymoons.',
    focusKeyword: 'overwater bungalows Maldives',
    ogTitle: 'Luxury Overwater Bungalows: Experience the Ultimate Maldives Paradise',
    ogDescription: 'Discover the epitome of tropical luxury with our comprehensive guide to Maldives overwater bungalows, perfect for honeymooners and luxury travelers.',
    published: true,
  },
  {
    title: 'Best Time to Visit the Maldives: Complete Seasonal Guide for 2024',
    slug: 'best-time-visit-maldives-seasonal-guide',
    author: 'Emma Thompson',
    category: 'travel-guide',
    excerpt: 'Planning a Maldives vacation? Our comprehensive seasonal guide breaks down weather patterns, activities, and pricing throughout the year to help you choose the perfect time for your island escape.',
    content: 'The Maldives operates on a tropical climate with two distinct monsoon seasons. The dry season (November to April) is characterized by stable weather, minimal rainfall, and excellent visibility. The northeast monsoon brings consistent dry conditions and calm seas, creating ideal snorkeling and diving environments. Peak season (January-March) commands premium pricing but offers consistently excellent weather. The wet season (May to October) brings increased rainfall but also spectacular manta ray aggregations.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: 'maldives, seasons, weather, travel-planning, when-to-visit',
    metaTitle: 'Best Time to Visit the Maldives: Seasonal Guide and Weather Patterns',
    metaDescription: 'Discover the best time to visit the Maldives with our seasonal guide. Learn about weather patterns, activities, and pricing for each season.',
    focusKeyword: 'best time to visit Maldives',
    ogTitle: 'Best Time to Visit the Maldives: Complete Seasonal Guide',
    ogDescription: 'Plan your Maldives vacation with our comprehensive seasonal guide covering weather, activities, and pricing throughout the year.',
    published: true,
  },
  {
    title: 'Island Hopping Adventure: Your Guide to Exploring Multiple Maldives Atolls',
    slug: 'island-hopping-maldives-atolls',
    author: 'Michael Chen',
    category: 'adventure',
    excerpt: 'Tired of staying in one resort? Discover how to plan an island-hopping adventure across the Maldives\' diverse atolls, experiencing local culture, pristine beaches, and authentic island life beyond resort boundaries.',
    content: 'Island hopping presents an alternative approach to experiencing the Maldives—one that emphasizes cultural immersion and exploration of the archipelago\'s remarkable diversity. The Maldives comprises 26 atolls containing over 1,190 coral islands. Transportation options include domestic flights, speedboats, local ferries, and private boat charters. Visit local fishing communities to understand traditional livelihoods, explore ancient mosques and historical monuments, and experience authentic Maldivian cuisine at guesthouses.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    tags: 'island-hopping, atolls, maldives, adventure, travel-itinerary',
    metaTitle: 'Island Hopping in the Maldives: Guide to Exploring Multiple Atolls',
    metaDescription: 'Discover how to plan an island-hopping adventure across Maldives atolls. Learn about transportation, local experiences, and authentic cultural encounters.',
    focusKeyword: 'island hopping Maldives',
    ogTitle: 'Island Hopping Adventure: Exploring Multiple Maldives Atolls',
    ogDescription: 'Experience authentic Maldives with our island-hopping guide covering local islands, cultural experiences, and adventure itineraries.',
    published: true,
  },
  {
    title: 'Diving in the Maldives: Complete Guide from Beginner to Advanced Divers',
    slug: 'diving-maldives-beginner-advanced',
    author: 'Lisa Anderson',
    category: 'water-sports',
    excerpt: 'Explore the underwater wonders of the Maldives with our comprehensive diving guide. From beginner certification courses to advanced technical dives, discover what makes the Maldives a world-class diving destination.',
    content: 'The Maldives stands among the world\'s premier diving destinations, offering extraordinary underwater landscapes and abundant marine biodiversity. The archipelago\'s atoll structure produces dramatic underwater topography featuring steep drop-offs and thriving coral gardens. Warm water temperatures, excellent visibility, and minimal pollution create ideal diving environments. Most resorts offer PADI Open Water certification courses requiring 3-4 days. Popular beginner sites include Banana Reef and Artificial Reef. Advanced divers can pursue technical diving certifications and explore deeper sites.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    tags: 'diving, scuba, maldives, water-sports, marine-life',
    metaTitle: 'Diving in the Maldives: Beginner to Advanced Guide',
    metaDescription: 'Comprehensive diving guide for the Maldives covering certification, dive sites, marine life, and safety tips for all experience levels.',
    focusKeyword: 'diving Maldives',
    ogTitle: 'Diving in the Maldives: Complete Guide from Beginner to Advanced',
    ogDescription: 'Explore underwater wonders in the Maldives with our complete diving guide featuring certification courses, dive sites, and marine encounters.',
    published: true,
  },
  {
    title: 'Sustainable Travel in the Maldives: Your Guide to Eco-Friendly Island Vacations',
    slug: 'sustainable-travel-maldives-eco-friendly',
    author: 'David Kumar',
    category: 'travel-guide',
    excerpt: 'Discover how to minimize your environmental impact while vacationing in the Maldives. Learn about eco-friendly resorts, sustainable practices, and conservation efforts that protect this fragile island paradise.',
    content: 'The Maldives faces unprecedented environmental challenges from climate change and rising sea levels. As travelers, we bear responsibility for minimizing our environmental footprint. Choose resorts holding recognized environmental certifications such as Green Globe. Prioritize resorts utilizing renewable energy sources and implementing water conservation programs. During your stay, reduce plastic consumption, use reef-safe sunscreen, maintain respectful distances from marine animals, and support local communities through direct spending.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    tags: 'sustainability, eco-friendly, maldives, conservation, responsible-travel',
    metaTitle: 'Sustainable Travel in the Maldives: Eco-Friendly Vacation Guide',
    metaDescription: 'Learn how to travel sustainably in the Maldives. Discover eco-friendly resorts, conservation practices, and responsible tourism activities.',
    focusKeyword: 'sustainable travel Maldives',
    ogTitle: 'Sustainable Travel in the Maldives: Your Eco-Friendly Guide',
    ogDescription: 'Minimize your environmental impact with our guide to sustainable travel in the Maldives, featuring eco-friendly resorts and conservation practices.',
    published: true,
  },
  {
    title: 'Culinary Journey: Exploring Maldivian Food and Island Dining Experiences',
    slug: 'maldivian-food-culinary-journey',
    author: 'Chef Patricia Lopez',
    category: 'travel-guide',
    excerpt: 'Discover the flavors of the Maldives through our culinary guide. From traditional island cuisine to world-class resort dining, explore the unique tastes that define Maldivian gastronomy.',
    content: 'Maldivian cuisine represents a fascinating fusion of Indian, Sri Lankan, Arab, and Southeast Asian influences. Traditional dishes include Garudhiya (iconic fish soup), Mas Huni (flaked fish salad), and Fihunu Mas (grilled marinated fish). Island dining experiences at family-run guesthouses serve authentic cuisine prepared using traditional methods. Luxury resorts employ world-class chefs preparing diverse cuisines with emphasis on fresh seafood. Engage with Maldivian culinary traditions through cooking classes offered by some resorts.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1504674900967-0ab60e2e4d6e?w=800',
    tags: 'food, cuisine, maldives, dining, culinary-experience',
    metaTitle: 'Maldivian Food and Culinary Experiences: Island Dining Guide',
    metaDescription: 'Explore Maldivian cuisine with our culinary guide covering traditional dishes, island dining, resort restaurants, and authentic food experiences.',
    focusKeyword: 'Maldivian food cuisine',
    ogTitle: 'Culinary Journey: Exploring Maldivian Food and Island Dining',
    ogDescription: 'Discover authentic Maldivian cuisine and island dining experiences with our comprehensive culinary guide to Maldives gastronomy.',
    published: true,
  },
];

async function seedBlogPosts() {
  try {
    console.log('Starting blog post seeding...');
    const db = await getDb();
    
    for (const post of sampleBlogPosts) {
      await db.insert(blogPosts).values({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✓ Created blog post: ${post.title}`);
    }
    
    console.log(`\n✅ Successfully seeded ${sampleBlogPosts.length} blog posts!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
    process.exit(1);
  }
}

seedBlogPosts();
