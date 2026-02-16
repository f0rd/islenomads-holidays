import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Mapping of islands to their S3 image URLs
const islandImages = {
  'male': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/dgXkiuLQcwhVOmTu.jpg', // Male city aerial
  'hulhumale': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/wCapRvgbqBqtRkNw.jpg', // Hulhumale aerial
  'dhigurah': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ZwHrOXkLDnINpmPJ.webp', // Dhigurah island
  'maafushi': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/LEVYYHAHTduKeuRc.jpg', // Maafushi beach
  'rasdhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/dZVIydotkwKesweB.jpg', // Rasdhoo island
  'ukulhas': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/fyLJccfsnmoCKPNo.jpg', // Ukulhas aerial
  'thulusdhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/RQQnxUfPZAefRjUT.webp', // Thulusdhoo surfing
  'kandooma': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/fichrVcHyoYPcovH.jpg', // Kandooma resort
  'eydhafushi': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NZLjwCNilBsGUYsq.jpg', // Eydhafushi
  'felidhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ksmWodbSDulWznkg.jpg', // Felidhoo
  'guraidhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/9lHEKWPoyBh5.jpg', // Guraidhoo
  'villingili': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/pmzdCbtnSmXOIyDX.jpg', // Villingili
  'artificial-beach': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/mfOUjiLIQFJBYEZm.jpeg', // Artificial beach
  'veligandu': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/GlqikrOdjzgoUcTt.jpg', // Veligandu resort
  'fulidhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/pPjuMrEsbfzrQLxo.jpg', // Fulidhoo
  'olhuveli': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/zCWjLaGZGuaftdWV.jpg', // Olhuveli
  'cocoa-island': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/wecwEFZNFoawjuNP.jpg', // Cocoa island
  'embudu': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/JDJIhXpbDwuUJOid.jpg', // Embudu
  'thulhaadhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/lFMJifSTszMiJeyB.jpg', // Thulhaadhoo
  'dharavandhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FdWVukjywlLhwDSe.jpg', // Dharavandhoo
  'lhaviyani': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/cichSkfSXraoKizi.jpg', // Lhaviyani
  'vabbinfaru': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PwZosGUAeyguIYPC.jpg', // Vabbinfaru
  'naifaru': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/AluHsBmaFLFHZNSe.jpg', // Naifaru
  'fulhadhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/BLLoOWAXIbnNHjku.jpg', // Fulhadhoo
};

async function updateIslandImages() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Updating island guides with image URLs...\n');

    let updated = 0;

    for (const [slug, imageUrl] of Object.entries(islandImages)) {
      try {
        const result = await conn.execute(
          'UPDATE places SET heroImage = ? WHERE slug = ? AND type = "island"',
          [imageUrl, slug]
        );
        
        if (result[0].affectedRows > 0) {
          updated++;
          console.log(`✅ Updated ${slug}`);
        } else {
          console.log(`⚠️  Island not found: ${slug}`);
        }
      } catch (err) {
        console.error(`❌ Error updating ${slug}:`, err.message);
      }
    }

    // Verify updates
    const [withImages] = await conn.execute(
      'SELECT COUNT(*) as count FROM places WHERE type = "island" AND heroImage IS NOT NULL'
    );
    
    const [total] = await conn.execute(
      'SELECT COUNT(*) as count FROM places WHERE type = "island"'
    );

    await conn.end();
    
    console.log(`\n✅ Complete!`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Islands with images: ${withImages[0].count}/${total[0].count}`);
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

updateIslandImages();
