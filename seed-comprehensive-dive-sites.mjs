import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const diveData = [
  { id: 'DIVE-RASDHOOBE', name: 'Rasdhoo Beyru', slug: 'rasdhoo-beyru', diveStyles: 'Drift;Reef;Ocean', features: 'Pinnacle;Sandy bottom;Wall', marineLife: 'Jackfish, Leaffish, Napoleon fish, Barracuda, Whitetip reef shark, Blacktip reef shark, Grey Sharks, Silvertip sharks, Mobula rays, Eagle Rays, nudibranchs, Salpe, octopuses', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-KANDOOMT', name: 'Kandooma Thila', slug: 'kandooma-thila', diveStyles: 'Drift;Reef;Ocean', features: 'Pinnacle;Wall;Channel', marineLife: 'Napoleon fish, Barracuda, Tuna, Grouper, Whitetip reef shark, Eagle ray, Sting ray, Grey Sharks, Silvertip sharks, Hawksbill turtle, Green Turtle', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MIYARUKA', name: 'MIYARU KANDU', slug: 'miyaru-kandu', diveStyles: 'Drift', features: '', marineLife: 'Grey Sharks', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-TIGERPO', name: 'Tiger Port', slug: 'tiger-port', diveStyles: 'Reef;Ocean', features: 'Sandy bottom;Channel', marineLife: 'Bull shark, Hammerhead shark, Tiger shark, Guitar shark, Sand tiger shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-SOLHACO', name: 'Solha Corner', slug: 'solha-corner', diveStyles: 'Drift;Reef', features: 'Wall', marineLife: '', maxDepthM: null, maxDepthFt: null },
  { id: 'DIVE-MAAYATH', name: 'Maaya Thila', slug: 'maaya-thila', diveStyles: 'Reef', features: '', marineLife: '', maxDepthM: null, maxDepthFt: null },
  { id: 'DIVE-RASDCHN', name: 'Rasdhoo Channel', slug: 'rasdhoo-channel', diveStyles: 'Drift;Reef;Ocean', features: 'Pinnacle;Sandy bottom;Wall;Channel', marineLife: 'Tuna, Napoleon fish, Jackfish, Blacktip reef shark, Eagle ray, Sting ray, Grey Sharks, Silvertip sharks, Moray eel, Nudibranch, Coral, Brain coral', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MADIGA', name: 'Madigaa', slug: 'madigaa', diveStyles: 'Reef', features: 'Pinnacle', marineLife: 'Manta ray', maxDepthM: 14, maxDepthFt: 46 },
  { id: 'DIVE-VELIEA', name: 'VELIGANDU EAST', slug: 'veligandu-east', diveStyles: 'Drift', features: 'Wall', marineLife: 'Stonefish, Whitetip reef shark, Eagle ray, Mobula, Turtle', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MUNDOOK', name: 'Mundoo Kandu', slug: 'mundoo-kandu', diveStyles: '', features: 'Channel', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-VILCOR', name: 'Villingili Coral Garden', slug: 'villingili-coral-garden', diveStyles: 'Ocean', features: 'Coral garden', marineLife: 'Eagle ray, Hawksbill turtle', maxDepthM: 25, maxDepthFt: 82 },
  { id: 'DIVE-DEMONP', name: 'Demon Point', slug: 'demon-point', diveStyles: 'Drift;Ocean', features: '', marineLife: '', maxDepthM: 40, maxDepthFt: 131 },
  { id: 'DIVE-KOTTEYC', name: 'Kottey Corner', slug: 'kottey-corner', diveStyles: 'Drift;Reef', features: '', marineLife: '', maxDepthM: null, maxDepthFt: null },
  { id: 'DIVE-BRITLWR', name: 'British Loyalty Wreck', slug: 'british-loyalty-wreck', diveStyles: 'Ocean;Wreck', features: '', marineLife: 'Reef Fish', maxDepthM: 32, maxDepthFt: 105 },
  { id: 'DIVE-BODUHOH', name: 'Bodu Hohola', slug: 'bodu-hohola', diveStyles: 'Ocean', features: 'Wall;Cavern', marineLife: 'Hawksbill turtle, Reef Fish', maxDepthM: 40, maxDepthFt: 131 },
  { id: 'DIVE-MARCSDR', name: "Marc's Dream", slug: 'marcs-dream', diveStyles: 'Reef', features: '', marineLife: 'Hawksbill turtle, Eagle Rays', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-BATHATH', name: 'Bathala Thila', slug: 'bathala-thila', diveStyles: 'Drift;Reef', features: '', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MALECAV', name: "Male' Caves Divesite", slug: 'male-caves-divesite', diveStyles: 'Beach;Reef;Ocean', features: 'Cave;Wall', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-TIGERSD', name: 'Tiger shark dive site', slug: 'tiger-shark-dive-site', diveStyles: 'Reef', features: '', marineLife: 'Triggerfish, Barracuda, Bull shark, Tiger shark, Moray eel', maxDepthM: 8, maxDepthFt: 26 },
  { id: 'DIVE-ONEROCK', name: 'One Rock', slug: 'one-rock', diveStyles: '', features: 'Pinnacle', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MAAKANA', name: 'Maakana Corner', slug: 'maakana-corner', diveStyles: 'Drift;Ocean', features: 'Channel', marineLife: 'Tuna, Napoleon fish, Batfish, Eagle ray, mobula ray, Gray reef shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-HUDUTHI', name: 'Hudu thila', slug: 'hudu-thila', diveStyles: '', features: 'Pinnacle', marineLife: '', maxDepthM: null, maxDepthFt: null },
  { id: 'DIVE-FARIKPL', name: 'Farikede Plateau', slug: 'farikede-plateau', diveStyles: 'Drift;Reef;Ocean', features: '', marineLife: 'Tuna, Barracuda, Sunfish (mola mola), Silvertip sharks, Whitetip reef shark, Thresher shark, Whale shark, Mako shark, Hammerhead Shark, Trevally, Yellowfins tuna, Gray reef shark, Oceanic Manta', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-FALHOUR', name: 'Falhuma House Reef', slug: 'falhuma-house-reef', diveStyles: 'Reef;Ocean', features: '', marineLife: 'Whitetip reef shark, Green Sea Turtle, Zebra (Leopard) Shark', maxDepthM: 18, maxDepthFt: 59 },
  { id: 'DIVE-SOFTCPA', name: 'Soft Coral Pass', slug: 'soft-coral-pass', diveStyles: 'Reef', features: 'Wall', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-FUSHIFA', name: 'Fushi Faru', slug: 'fushi-faru', diveStyles: 'Reef', features: 'Wall', marineLife: '', maxDepthM: 25, maxDepthFt: 82 },
  { id: 'DIVE-BOAVAFR', name: 'Boava Faru', slug: 'boava-faru', diveStyles: 'Reef;Ocean', features: 'Pinnacle', marineLife: 'Whitetip reef shark, Eagle ray, Green Sea Turtle, Gray reef shark, Bluestripe Snapper (Invasive)', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-BLUEHOL', name: 'Blue Hole', slug: 'blue-hole', diveStyles: 'Reef', features: '', marineLife: '', maxDepthM: 25, maxDepthFt: 82 },
  { id: 'DIVE-FELIHOU', name: 'Felidhoo House Reef', slug: 'felidhoo-house-reef', diveStyles: 'Beach;Reef', features: 'Sandy bottom;Wall;Channel', marineLife: 'Grouper, Jackfish, Hawksbill turtle, Moray eel, Nudibranch, Reef Sharks, Fusilier, Stingrays', maxDepthM: 20, maxDepthFt: 66 },
  { id: 'DIVE-FARIKEDE', name: 'Farikede', slug: 'farikede', diveStyles: 'Drift;Reef;Ocean', features: '', marineLife: 'Barracuda, Tuna, Hammerhead shark, Silvertip sharks, Whale shark, Thresher shark, Oceanic Manta, Mola Mola, Trevally, Grey Reef Shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-DHONFTH', name: 'Dhonfanu Thila', slug: 'dhonfanu-thila', diveStyles: 'Ocean', features: 'Pinnacle', marineLife: 'Napoleon fish, Grey Sharks, Eaglerays, Fusilier, Tuna', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-ADDUMAN', name: 'Addu Manta Point', slug: 'addu-manta-point', diveStyles: 'Drift;Ocean', features: '', marineLife: 'Manta Rays', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-AQUAGIR', name: 'Aqua Giri', slug: 'aqua-giri', diveStyles: 'Reef', features: 'Pinnacle', marineLife: '', maxDepthM: 20, maxDepthFt: 66 },
  { id: 'DIVE-FULICAV', name: 'Fulidhoo Caves', slug: 'fulidhoo-caves', diveStyles: 'Drift;Reef', features: 'Cave;Wall', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-KUDIBFR', name: 'Kudiboli Faru', slug: 'kudiboli-faru', diveStyles: 'Drift;Reef', features: '', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MUNKOGD', name: "Munko's Garden", slug: 'munkos-garden', diveStyles: 'Reef', features: '', marineLife: '', maxDepthM: 20, maxDepthFt: 66 },
  { id: 'DIVE-GREENRF', name: 'Green Reef', slug: 'green-reef', diveStyles: 'Reef', features: 'Pinnacle', marineLife: '', maxDepthM: 20, maxDepthFt: 66 },
  { id: 'DIVE-CORALGD', name: 'Coral Garden', slug: 'coral-garden', diveStyles: 'Reef', features: 'Pinnacle', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-FUSHIFR', name: 'Fushifaru', slug: 'fushifaru', diveStyles: 'Drift;Reef', features: '', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MURAKGI', name: 'Muraka Giri', slug: 'muraka-giri', diveStyles: 'Drift;Reef', features: 'Pinnacle', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-ALIMHOU', name: 'Alimatha House reef', slug: 'alimatha-house-reef', diveStyles: 'Drift;Reef', features: '', marineLife: 'Blacktip reef shark, Nurse sharks, eagle ray', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-KANUHBR', name: 'Kanuhura Beru', slug: 'kanuhura-beru', diveStyles: 'Reef;Ocean', features: '', marineLife: 'Hawksbill turtle, Reef fish (Scorpionfish, boxfish, puffer fish, surgeonfish, angelfish, bannerfish, triggerfish, parrotfish, trumpetfish, pipefish, clown fish, sweetlips, snapper, grouper, lionfish etc)', maxDepthM: 150, maxDepthFt: 492, notes: 'Depth seems extreme—verify source before publishing' },
  { id: 'DIVE-PEAK', name: 'Peak', slug: 'peak', diveStyles: 'Drift;Reef;Ocean', features: 'Channel', marineLife: 'Silvertip sharks, Blacktip reef shark, Reef Fish, Stingray, Grey Reef Shark, Baracuda', maxDepthM: 40, maxDepthFt: 131 },
  { id: 'DIVE-WALL', name: 'Wall', slug: 'wall', diveStyles: 'Reef;Ocean', features: 'Wall', marineLife: 'Boxfish / pufferfish, Blacktip reef shark, Eagle ray, Hawksbill turtle, Nudibranch, Lobster, Green Sea Turtle', maxDepthM: 25, maxDepthFt: 82 },
  { id: 'DIVE-THUNDI', name: 'Thundi', slug: 'thundi', diveStyles: 'Drift;Reef', features: 'Wall', marineLife: 'Jackfish, Tuna, Leaffish, Whitetip reef shark, Thresher shark, Whale shark, Sand tiger shark, Turtle, Grey Reef Shark, Nudibranchs, Tiger Shark, Oceanic Manta, Lionfish, Octopus, scorpionfish, Hammerhead Shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-KUREDUEX', name: 'Kuredu Express', slug: 'kuredu-express', diveStyles: 'Drift;Reef;Ocean', features: 'Channel', marineLife: '', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-KUREDCAV', name: 'Kuredu Caves (Turtles airport)', slug: 'kuredu-caves-turtles-airport', diveStyles: 'Reef;Ocean', features: 'Cave;Wall', marineLife: 'Eagle Ray, Green Sea Turtle, Grey Reef Shark, Black Tip Reef Shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-MUHDHOO', name: 'Muhdhoo House Reef', slug: 'muhdhoo-house-reef', diveStyles: 'Beach;Reef', features: 'Wall', marineLife: 'Tuna, Grouper, Jackfish, Parrotfish, Surgeonfish, Boxfish / pufferfish, Scorpionfish, Lionfish, Trumpetfish / pipefish, Batfish, Bannerfish, Triggerfish, Sweetlips, Snapper, Rays, Sharks, Eagle ray, Eels, Starfish, Sea cucumber, Lobster, Clam, Shrimp, Crab, Nudibranch, Octopus, Coral, Sea anemone', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-KUDHIMWR', name: 'Kudhima Wreck', slug: 'kudhima-wreck', diveStyles: 'Reef;Wreck', features: '', marineLife: 'Tuna, Stonefish, Frogfish, Grouper, Jackfish, Boxfish / pufferfish, Lionfish, Batfish, Triggerfish, Sting ray, Rays, Nurse sharks, Moray eel, Garden eels, Nudibranch, Shrimp, Crab', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-BROKENR', name: 'Broken Rock', slug: 'broken-rock', diveStyles: '', features: 'Pinnacle', marineLife: 'Clownfish, Grouper, Jackfish, Parrotfish, Lionfish, Bannerfish, Triggerfish, Butterflyfish, Sweetlips, Tuna, Napoleon fish, Rays, Whitetip reef shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-SEVENTH', name: 'Seventh Heaven', slug: 'seventh-heaven', diveStyles: '', features: 'Pinnacle', marineLife: 'Tuna, Barracuda, Napoleon fish, Grouper, Jackfish, Bannerfish, Butterflyfish, Eagle ray, Whitetip reef shark, Grey Sharks', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-FIVERCK', name: 'Five Rock', slug: 'five-rock', diveStyles: '', features: 'Pinnacle', marineLife: 'Batfish, Tuna, Barracuda, Napoleon fish, Clownfish, Grouper, Jackfish, Parrotfish, Lionfish, Bannerfish, Triggerfish, Butterflyfish, Sweetlips, Pelagic Fish, Snapper, Whitetip reef shark, Grey Sharks, Eagle ray', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-DHIGARC', name: 'Dhigurah Arches', slug: 'dhigurah-arches', diveStyles: 'Reef', features: '', marineLife: 'Tuna, Grouper, Jackfish, Parrotfish, Butterflyfish, Sting ray, Manta ray, Whitetip reef shark, Nurse sharks, Guitar shark', maxDepthM: 30, maxDepthFt: 98 },
  { id: 'DIVE-VILAMTH', name: 'Vilamendhoo Thila', slug: 'vilamendhoo-thila', diveStyles: '', features: 'Pinnacle', marineLife: 'Tuna, Barracuda, Napoleon fish, Clownfish, Grouper, Jackfish, Parrotfish, Butterflyfish, Grey Sharks, Eagle ray, Whitetip reef shark', maxDepthM: 30, maxDepthFt: 98 },
];

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

try {
  console.log('Starting to seed comprehensive dive sites...');

  for (const dive of diveData) {
    // Find island guide by slug
    const [islands] = await connection.query(
      'SELECT id FROM island_guides WHERE slug = ? LIMIT 1',
      [dive.slug]
    );

    if (islands.length === 0) {
      console.log(`⚠️  Skipped: ${dive.name} (island slug not found: ${dive.slug})`);
      continue;
    }

    const islandGuideId = islands[0].id;

    // Insert activity spot
    try {
      await connection.query(
        `INSERT INTO activity_spots 
        (name, slug, spotType, description, difficulty, bestSeason, islandGuideId, diveStyles, features, marineLife, maxDepthM, maxDepthFt, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dive.name,
          dive.slug,
          'dive_site',
          dive.marineLife || null,
          'Intermediate',
          'Year-round',
          islandGuideId,
          dive.diveStyles || null,
          dive.features || null,
          dive.marineLife || null,
          dive.maxDepthM || null,
          dive.maxDepthFt || null,
          dive.notes || null,
        ]
      );
      console.log(`✅ Added: ${dive.name}`);
    } catch (err) {
      console.error(`❌ Error adding ${dive.name}:`, err.message);
    }
  }

  console.log('✅ Dive sites seeding completed!');
} catch (error) {
  console.error('Fatal error:', error);
} finally {
  await connection.end();
}
