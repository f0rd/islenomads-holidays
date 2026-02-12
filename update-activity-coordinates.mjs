import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Accurate GPS coordinates for Maldives activity spots
const activitySpotCoordinates = {
  // Dive Sites
  'hanifaru-bay': { lat: 5.0333, lng: 73.1833 }, // Dharavandhoo
  'fish-head': { lat: 4.3667, lng: 73.5167 }, // Rasdhoo
  'maaya-thila': { lat: 4.3833, lng: 73.5333 }, // Rasdhoo
  'kuda-rah-thila': { lat: 3.7667, lng: 73.3333 }, // Dhigurah
  'fotteyo-kandu': { lat: 3.9167, lng: 73.5167 }, // Felidhoo
  'bathala-thila': { lat: 4.3667, lng: 73.5333 }, // Rasdhoo
  'maradhoo-kandu': { lat: 0.6167, lng: 73.1667 }, // Hithadhoo
  'banana-reef': { lat: 4.1667, lng: 73.5333 }, // Rasdhoo area

  // Surf Spots
  'cokes': { lat: 4.33, lng: 73.56 }, // Thulusdhoo
  'pasta-point': { lat: 4.1833, lng: 73.4833 }, // Pasta Point area
  'riptide': { lat: 4.2, lng: 73.5 }, // North Male Atoll
  'sultans': { lat: 4.2667, lng: 73.5 }, // North Male Atoll
  'jailbreaks': { lat: 4.15, lng: 73.45 }, // Himmafushi area
  'foxys': { lat: 5.2667, lng: 73.2 }, // Lhaviyani Atoll
  'yeyye': { lat: 0.8, lng: 73.1667 }, // Laamu Atoll
  'two-ways': { lat: 0.7667, lng: 73.1667 }, // Laamu Atoll

  // Snorkeling Spots
  'maafushi-house-reef': { lat: 4.4, lng: 73.4333 }, // Maafushi
  'thulusdhoo-reef': { lat: 4.33, lng: 73.56 }, // Thulusdhoo
  'dhigurah-reef': { lat: 3.7667, lng: 73.3333 }, // Dhigurah
  'fulidhoo-reef': { lat: 2.9333, lng: 73.3667 }, // Fulidhoo
  'veligandu-reef': { lat: 4.5167, lng: 73.4167 }, // Veligandu
  'rasdhoo-reef': { lat: 4.3667, lng: 73.5167 }, // Rasdhoo
};

async function updateCoordinates() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'islenomads',
  });

  try {
    let updated = 0;
    let notFound = 0;

    for (const [slug, coords] of Object.entries(activitySpotCoordinates)) {
      const [result] = await connection.execute(
        'UPDATE activity_spots SET latitude = ?, longitude = ? WHERE slug = ?',
        [coords.lat.toString(), coords.lng.toString(), slug]
      );

      if (result.affectedRows > 0) {
        console.log(`✓ Updated ${slug}: ${coords.lat}, ${coords.lng}`);
        updated++;
      } else {
        console.log(`✗ Not found: ${slug}`);
        notFound++;
      }
    }

    console.log(`\n✓ Successfully updated ${updated} activity spots`);
    if (notFound > 0) {
      console.log(`⚠ ${notFound} activity spots not found in database`);
    }
  } finally {
    await connection.end();
  }
}

updateCoordinates().catch(console.error);
