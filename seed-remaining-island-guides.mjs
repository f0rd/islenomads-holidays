import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const connectionConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'islenomads',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log('Connecting to database...');
console.log(`Host: ${connectionConfig.host}`);
console.log(`Database: ${connectionConfig.database}`);

let connection;
try {
  connection = await mysql.createConnection(connectionConfig);
  console.log('✓ Connected to database');
} catch (error) {
  console.error('✗ Failed to connect to database:', error.message);
  process.exit(1);
}

const islandGuides = [
  {
    name: 'Kendhoo',
    slug: 'kendhoo',
    overview: 'Unique local island in Baa Atoll, relatively new to tourism, offering authentic Maldivian culture and pristine natural beauty with stunning snorkeling opportunities.',
    topThingsToDo: JSON.stringify([
      { title: 'Snorkeling at Pristine Spots', description: 'Explore pristine snorkeling locations with abundant underwater life including tropical fish, turtles, and sharks.' },
      { title: 'Manta Ray Viewing at Hanifaru Bay', description: 'Visit Hanifaru Bay (15 minutes away) during late summer and fall to witness manta rays dancing on the surface, especially during full and new moon.' },
      { title: 'Visit Kendhoo Mosque', description: 'Explore the ancient Kendhoo Mosque built in the 16th century from coral stone, one of the first Islamic structures in the Maldives.' },
      { title: 'Fishing Trips', description: 'Join local fishermen on traditional fishing expeditions to experience authentic Maldivian fishing culture.' },
      { title: 'Island Exploration', description: 'Explore uninhabited islands nearby and experience pristine natural environments.' },
      { title: 'Traditional Medicine Consultation', description: 'Visit the renowned Maldivian medicine healer known for treating infertility and arthritis.' }
    ]),
    attractions: JSON.stringify([
      { title: 'Kendhoo Mosque', description: '16th century coral stone mosque, one of the first Islamic structures in the Maldives' },
      { title: 'Hanifaru Bay', description: 'UNESCO protected manta ray sanctuary 15 minutes away, peak season August-October' },
      { title: 'Pristine Coral Gardens', description: 'Thriving coral reefs with diverse marine life' },
      { title: 'Uninhabited Islands', description: 'Nearby pristine islands for exploration' }
    ]),
    foodCafes: JSON.stringify([
      { title: 'Local Guesthouses', description: 'Traditional Maldivian cuisine prepared by local families' },
      { title: 'Fresh Seafood', description: 'Daily fresh catch from local fishermen' }
    ]),
    quickFacts: JSON.stringify([
      { label: 'Atoll', value: 'Baa Atoll' },
      { label: 'Best Time to Visit', value: 'August-October (manta rays)' },
      { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)' },
      { label: 'Language', value: 'Dhivehi' },
      { label: 'Accommodation', value: 'Guesthouses $40-80/night' }
    ]),
    threeDayItinerary: JSON.stringify([
      { day: 1, activities: ['Arrive at Kendhoo', 'Settle into guesthouse', 'Explore island', 'Sunset beach walk'] },
      { day: 2, activities: ['Morning snorkeling at pristine spot', 'Visit Kendhoo Mosque', 'Lunch with local family', 'Afternoon island exploration'] },
      { day: 3, activities: ['Fishing trip with locals', 'Snorkeling', 'Cultural interactions', 'Departure'] }
    ]),
    faq: JSON.stringify([
      { question: 'When is the best time to see manta rays?', answer: 'Late summer and fall (August-October), especially during full and new moon when plankton rises to the surface.' },
      { question: 'How do I get to Kendhoo?', answer: '25-minute domestic flight from Malé to Dharavandhoo, then 30-minute speedboat. Or 2 hour 15 minute direct speedboat.' },
      { question: 'Is snorkeling safe here?', answer: 'Yes, snorkeling is safe with pristine reefs and abundant marine life. Always go with guides for best experience.' }
    ]),
    bestTimeToVisit: 'August-October',
    currency: 'MVR',
    language: 'Dhivehi'
  },
  {
    name: 'Dharavandhoo',
    slug: 'dharavandhoo',
    overview: 'Quaint island in Baa Atoll with sandy dirt roads, bikes everywhere, and long stretches of white sand. Home to the famous Hanifaru Bay manta ray sanctuary.',
    topThingsToDo: JSON.stringify([
      { title: 'Manta Ray Viewing at Hanifaru Bay', description: 'Visit Hanifaru Bay (15 minutes away) to see 100+ manta rays dancing during peak season (September-October).' },
      { title: 'Snorkeling with Turtles and Sharks', description: 'Explore excellent snorkeling spots with turtles, sharks, and colorful schools of fish.' },
      { title: 'Big Game Fishing', description: 'Fish for big game species in waters known for excellent fish migration patterns.' },
      { title: 'House Reef Snorkeling', description: 'Snorkel the thriving local house reef right off the coast.' },
      { title: 'Beach Relaxation', description: 'Enjoy pristine white sand beaches and crystal-clear waters.' },
      { title: 'Drone Manta Ray Spotting', description: 'Biosphere Inn uses drones during mornings and afternoons to spot manta rays for guests.' }
    ]),
    attractions: JSON.stringify([
      { title: 'Hanifaru Bay', description: 'UNESCO protected manta ray sanctuary with 100+ rays during peak season' },
      { title: 'Thriving House Reef', description: 'Pristine reef with diverse marine life right off the coast' },
      { title: 'Local Fishing Community', description: 'Experience authentic Maldivian fishing culture' }
    ]),
    foodCafes: JSON.stringify([
      { title: 'Biosphere Inn Restaurant', description: 'Quality dining with fresh seafood and local cuisine' },
      { title: 'Local Cafés', description: 'Traditional Maldivian meals and snacks' }
    ]),
    quickFacts: JSON.stringify([
      { label: 'Atoll', value: 'Baa Atoll' },
      { label: 'Best Time to Visit', value: 'September-October (manta rays)' },
      { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)' },
      { label: 'Language', value: 'Dhivehi' },
      { label: 'Distance from Malé', value: '2 hours by speedboat' }
    ]),
    threeDayItinerary: JSON.stringify([
      { day: 1, activities: ['Arrive at Dharavandhoo', 'Settle into guesthouse', 'Explore island', 'Sunset at beach'] },
      { day: 2, activities: ['Manta ray viewing at Hanifaru Bay', 'Snorkeling with turtles', 'Lunch', 'Afternoon beach relaxation'] },
      { day: 3, activities: ['Big game fishing', 'House reef snorkeling', 'Cultural exploration', 'Departure'] }
    ]),
    faq: JSON.stringify([
      { question: 'When can I see 100+ manta rays?', answer: 'During peak season (September-October), especially on full and new moon when plankton rises to the surface.' },
      { question: 'How far is Hanifaru Bay?', answer: 'Only 15 minutes from Dharavandhoo by speedboat.' },
      { question: 'Is the house reef good for snorkeling?', answer: 'Yes, the local house reef is thriving with diverse marine life and accessible right from the beach.' }
    ]),
    bestTimeToVisit: 'September-October',
    currency: 'MVR',
    language: 'Dhivehi'
  },
  {
    name: 'Maalhos',
    slug: 'maalhos',
    overview: 'Charming local island close to Dharavandhoo and Hanifaru Bay, known for beautiful bikini beach, stunning underwater life, and environmental initiatives.',
    topThingsToDo: JSON.stringify([
      { title: 'Snorkeling at Beautiful Reefs', description: 'Explore pristine reefs nearby with diverse marine life.' },
      { title: 'Manta Ray Viewing', description: 'Visit Hanifaru Bay (nearby) during season to see manta rays.' },
      { title: 'Bikini Beach Relaxation', description: 'Enjoy the beautiful bikini beach with white sand and clear waters.' },
      { title: 'Environmental Tourism', description: 'Learn about the island\'s environmental initiatives and conservation efforts.' },
      { title: 'Island Exploration', description: 'Explore the charming local island and experience authentic culture.' },
      { title: 'Diving', description: 'Dive at nearby sites with excellent visibility and marine life.' }
    ]),
    attractions: JSON.stringify([
      { title: 'Bikini Beach', description: 'Beautiful white sand beach with crystal-clear waters' },
      { title: 'Hanifaru Bay', description: 'Nearby UNESCO protected manta ray sanctuary' },
      { title: 'Pristine Reefs', description: 'Beautiful coral gardens nearby' },
      { title: 'Environmental Initiatives', description: 'Island-wide ban on single-use plastics and conservation programs' }
    ]),
    foodCafes: JSON.stringify([
      { title: 'Local Guesthouses', description: 'Traditional Maldivian cuisine' },
      { title: 'Fresh Seafood', description: 'Daily fresh catch from local fishermen' }
    ]),
    quickFacts: JSON.stringify([
      { label: 'Atoll', value: 'Baa Atoll' },
      { label: 'Best Time to Visit', value: 'September-October' },
      { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)' },
      { label: 'Language', value: 'Dhivehi' },
      { label: 'Environmental Focus', value: 'Ban on single-use plastics' }
    ]),
    threeDayItinerary: JSON.stringify([
      { day: 1, activities: ['Arrive at Maalhos', 'Beach relaxation', 'Sunset walk'] },
      { day: 2, activities: ['Snorkeling at nearby reefs', 'Bikini beach time', 'Cultural exploration'] },
      { day: 3, activities: ['Manta ray viewing at Hanifaru Bay', 'Diving', 'Departure'] }
    ]),
    faq: JSON.stringify([
      { question: 'Is the bikini beach really beautiful?', answer: 'Yes, Maalhos has a stunning bikini beach with white sand and pristine waters.' },
      { question: 'Can I visit Hanifaru Bay from here?', answer: 'Yes, Hanifaru Bay is nearby and easily accessible by speedboat.' },
      { question: 'What environmental initiatives does the island have?', answer: 'Maalhos has a complete ban on single-use plastics and active coral restoration programs.' }
    ]),
    bestTimeToVisit: 'September-October',
    currency: 'MVR',
    language: 'Dhivehi'
  },
  {
    name: 'Dhigurah',
    slug: 'dhigurah',
    overview: 'Long island (3km) in Alif Dhaal Atoll widely known for whale shark spotting and beautiful beaches with crystalline waters.',
    topThingsToDo: JSON.stringify([
      { title: 'Whale Shark Snorkeling', description: 'Snorkel with whale sharks visible year-round right off the coast - one of the best whale shark spots in the Maldives.' },
      { title: 'Turtle Spotting', description: 'Fantastic opportunities to see turtles in their natural habitat.' },
      { title: 'Manta Ray Viewing', description: 'Encounter manta rays in nearby waters.' },
      { title: 'Beach Relaxation', description: 'Enjoy 3km of beautiful white sand beaches.' },
      { title: 'Snorkeling', description: 'Explore pristine reefs with abundant marine life.' },
      { title: 'Diving', description: 'Dive at nearby sites with excellent visibility.' }
    ]),
    attractions: JSON.stringify([
      { title: 'Whale Shark Hotspot', description: 'Year-round whale shark presence right off the coast' },
      { title: 'Beautiful Beaches', description: '3km of pristine white sand beaches' },
      { title: 'Crystalline Waters', description: 'Clear turquoise waters perfect for snorkeling' },
      { title: 'Marine Sanctuary', description: 'Diverse marine life including turtles and manta rays' }
    ]),
    foodCafes: JSON.stringify([
      { title: 'Local Guesthouses', description: 'Traditional Maldivian cuisine' },
      { title: 'Fresh Seafood', description: 'Daily fresh catch' }
    ]),
    quickFacts: JSON.stringify([
      { label: 'Atoll', value: 'Alif Dhaal Atoll' },
      { label: 'Best Time to Visit', value: 'Year-round for whale sharks' },
      { label: 'Island Length', value: '3km' },
      { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)' },
      { label: 'Language', value: 'Dhivehi' }
    ]),
    threeDayItinerary: JSON.stringify([
      { day: 1, activities: ['Arrive at Dhigurah', 'Beach relaxation', 'Sunset walk'] },
      { day: 2, activities: ['Whale shark snorkeling', 'Turtle spotting', 'Beach time'] },
      { day: 3, activities: ['Manta ray viewing', 'Diving', 'Departure'] }
    ]),
    faq: JSON.stringify([
      { question: 'Can I see whale sharks year-round?', answer: 'Yes, whale sharks are visible right off the coast year-round, making it one of the best spots in the Maldives.' },
      { question: 'How long is the beach?', answer: 'The island stretches for 3km with beautiful white sand beaches throughout.' },
      { question: 'Are there other marine animals?', answer: 'Yes, you can also see turtles and manta rays in the surrounding waters.' }
    ]),
    bestTimeToVisit: 'Year-round',
    currency: 'MVR',
    language: 'Dhivehi'
  },
  {
    name: 'Thoddoo',
    slug: 'thoddoo',
    overview: 'Popular local island on its own atoll, boasting the longest and largest bikini beach of any local island, fresh water resources, and fresh produce.',
    topThingsToDo: JSON.stringify([
      { title: 'Bikini Beach Relaxation', description: 'Enjoy the longest and largest bikini beach of any local island, expanded yearly with fresh water showers and toilets.' },
      { title: 'Turtle Spotting', description: 'Snorkel the house reef to spot turtles swimming in their natural habitat.' },
      { title: 'Dolphin Watching', description: 'Explore nearby excellent reefs to see dolphins.' },
      { title: 'Nurse Shark Viewing', description: 'Encounter nurse sharks in nearby waters.' },
      { title: 'Fresh Water Swimming', description: 'Enjoy fresh water showers and facilities on the beach.' },
      { title: 'Local Produce Tasting', description: 'Enjoy fresh fruits and vegetables grown on the island.' }
    ]),
    attractions: JSON.stringify([
      { title: 'Longest Bikini Beach', description: 'Largest bikini beach of any local island with fresh water facilities' },
      { title: 'House Reef', description: 'Home to turtles and marine life' },
      { title: 'Nearby Excellent Reefs', description: 'Beautiful coral gardens with dolphins and nurse sharks' },
      { title: 'Fresh Water Well', description: 'Unique fresh water resource providing showers and toilets on beach' },
      { title: 'Local Farms', description: 'Island produces fresh fruits and vegetables' }
    ]),
    foodCafes: JSON.stringify([
      { title: 'Local Restaurants', description: 'Fresh produce and seafood from local sources' },
      { title: 'Guesthouse Dining', description: 'Traditional Maldivian meals' }
    ]),
    quickFacts: JSON.stringify([
      { label: 'Atoll', value: 'Thoddoo Atoll' },
      { label: 'Best Time to Visit', value: 'Year-round' },
      { label: 'Beach', value: 'Longest bikini beach of any local island' },
      { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)' },
      { label: 'Popular With', value: 'Russian tourists' }
    ]),
    threeDayItinerary: JSON.stringify([
      { day: 1, activities: ['Arrive at Thoddoo', 'Bikini beach relaxation', 'Fresh water swimming'] },
      { day: 2, activities: ['House reef snorkeling with turtles', 'Nearby reef exploration', 'Dolphin watching'] },
      { day: 3, activities: ['Nurse shark viewing', 'Local produce tasting', 'Departure'] }
    ]),
    faq: JSON.stringify([
      { question: 'Is the bikini beach really the longest?', answer: 'Yes, Thoddoo has the longest and largest bikini beach of any local island, which is expanded yearly.' },
      { question: 'Is the house reef good for snorkeling?', answer: 'The house reef has mostly dead corals until you reach the farthest reaches, but you can see turtles. Nearby reefs are excellent.' },
      { question: 'Why is there fresh water on the beach?', answer: 'Thoddoo has a well of fresh water under the island, providing showers and toilets on the beach.' }
    ]),
    bestTimeToVisit: 'Year-round',
    currency: 'MVR',
    language: 'Dhivehi'
  },
  {
    name: 'Ukulhas',
    slug: 'ukulhas',
    overview: 'Eco-friendly island in Alif Alif Atoll offering the perfect balance between authentic local experience and well-established tourism infrastructure.',
    topThingsToDo: JSON.stringify([
      { title: 'Manta Ray Viewing', description: 'Visit excellent manta ray spots nearby.' },
      { title: 'Snorkeling', description: 'Explore beautiful snorkeling sites with diverse marine life.' },
      { title: 'Diving', description: 'Dive at nearby sites with excellent visibility.' },
      { title: 'Beach Relaxation', description: 'Enjoy the stunning bikini beach.' },
      { title: 'Restaurant Dining', description: 'Explore good restaurants and local cuisine.' },
      { title: 'Environmental Tourism', description: 'Learn about the island\'s eco-friendly initiatives.' }
    ]),
    attractions: JSON.stringify([
      { title: 'Stunning Bikini Beach', description: 'Beautiful white sand beach maintained through environmental initiatives' },
      { title: 'Manta Ray Spot', description: 'Excellent location for manta ray viewing' },
      { title: 'Beautiful Reefs', description: 'Pristine coral gardens nearby' },
      { title: 'Eco-Friendly Island', description: 'Known as one of the Maldives\' most eco-friendly islands' }
    ]),
    foodCafes: JSON.stringify([
      { title: 'Local Restaurants', description: 'Good selection of dining options' },
      { title: 'Guesthouses', description: 'Quality meals and local cuisine' }
    ]),
    quickFacts: JSON.stringify([
      { label: 'Atoll', value: 'Alif Alif Atoll' },
      { label: 'Best Time to Visit', value: 'Year-round' },
      { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)' },
      { label: 'Language', value: 'Dhivehi' },
      { label: 'Tourism Level', value: 'Well-established, not too touristy' }
    ]),
    threeDayItinerary: JSON.stringify([
      { day: 1, activities: ['Arrive at Ukulhas', 'Beach relaxation', 'Restaurant dining'] },
      { day: 2, activities: ['Manta ray viewing', 'Snorkeling', 'Beach time'] },
      { day: 3, activities: ['Diving', 'Environmental tourism', 'Departure'] }
    ]),
    faq: JSON.stringify([
      { question: 'Is Ukulhas too touristy?', answer: 'No, it\'s the perfect balance - well-established with good restaurants but not overly touristy.' },
      { question: 'What makes it eco-friendly?', answer: 'Ukulhas is known as one of the Maldives\' most eco-friendly islands with environmental initiatives and a beautiful bikini beach.' },
      { question: 'Are there good restaurants?', answer: 'Yes, Ukulhas has a good selection of restaurants and dining options.' }
    ]),
    bestTimeToVisit: 'Year-round',
    currency: 'MVR',
    language: 'Dhivehi'
  }
];

console.log('Starting to populate island guides...\n');

let successCount = 0;
let errorCount = 0;

for (const guide of islandGuides) {
  try {
    const query = `
      UPDATE island_guides 
      SET 
        overview = ?,
        topThingsToDo = ?,
        attractions = ?,
        foodCafes = ?,
        quickFacts = ?,
        threeDayItinerary = ?,
        faq = ?,
        bestTimeToVisit = ?,
        currency = ?,
        language = ?
      WHERE slug = ?
    `;
    
    const values = [
      guide.overview,
      guide.topThingsToDo,
      guide.attractions,
      guide.foodCafes,
      guide.quickFacts,
      guide.threeDayItinerary,
      guide.faq,
      guide.bestTimeToVisit,
      guide.currency,
      guide.language,
      guide.slug
    ];

    const [result] = await connection.execute(query, values);
    if (result.affectedRows > 0) {
      console.log(`✓ Updated guide for ${guide.name}`);
      successCount++;
    } else {
      console.log(`⚠ No rows updated for ${guide.name} (island may not exist)`);
    }
  } catch (error) {
    console.error(`✗ Error updating ${guide.name}:`, error.message);
    errorCount++;
  }
}

console.log(`\n✓ Successfully updated: ${successCount} islands`);
if (errorCount > 0) {
  console.log(`✗ Errors: ${errorCount} islands`);
}
console.log('\nIsland guides population complete!');
await connection.end();
