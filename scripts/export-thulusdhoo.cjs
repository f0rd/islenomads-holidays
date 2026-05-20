#!/usr/bin/env node
const fs = require('fs');
const { URL } = require('url');

(async () => {
  try {
    const env = fs.readFileSync('.env', 'utf8');
    const m = env.match(/^SOURCE_MYSQL_URL=(.+)$/m);
    if (!m) throw new Error('SOURCE_MYSQL_URL not found in .env');
    const urlStr = m[1].trim();
    const parsed = new URL(urlStr);

    const user = decodeURIComponent(parsed.username);
    const password = decodeURIComponent(parsed.password);
    const host = parsed.hostname;
    const port = parsed.port || 3306;
    const database = parsed.pathname.replace(/^\//, '');

    const sslParam = parsed.searchParams.get('ssl');
    let ssl = undefined;
    if (sslParam) {
      try {
        ssl = JSON.parse(sslParam);
      } catch (e) {
        // leave ssl undefined if parsing fails
      }
    }

    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({ host, port, user, password, database, ssl });

    const [islands] = await conn.execute("SELECT * FROM island_guides WHERE name LIKE '%Thulusdhoo%';");
    // If we found an island row, query activity_spots by that island id (more reliable)
    let spots = [];
    if (islands && islands.length > 0) {
      const islandId = islands[0].id;
      const [rows] = await conn.execute("SELECT * FROM activity_spots WHERE islandGuideId = ? ORDER BY name;", [islandId]);
      spots = rows;
    } else {
      const [rows] = await conn.execute("SELECT * FROM activity_spots WHERE islandGuideId IN (SELECT id FROM island_guides WHERE name LIKE '%Thulusdhoo%') ORDER BY name;");
      spots = rows;
    }

    // Diagnostics: activity_spots count and sample
    const [countRes] = await conn.execute('SELECT COUNT(*) as cnt FROM activity_spots;');
    const [sampleRows] = await conn.execute('SELECT * FROM activity_spots LIMIT 5;');

    fs.mkdirSync('.manus/exports', { recursive: true });
    fs.writeFileSync('.manus/exports/thulusdhoo_island_guides.json', JSON.stringify(islands, null, 2));
    fs.writeFileSync('.manus/exports/thulusdhoo_activity_spots.json', JSON.stringify(spots, null, 2));
    fs.writeFileSync('.manus/exports/activity_spots_count.json', JSON.stringify(countRes, null, 2));
    fs.writeFileSync('.manus/exports/activity_spots_sample.json', JSON.stringify(sampleRows, null, 2));

    // Extra: try to find well-known Thulusdhoo spots by name to locate their islandGuideId
    const [namedSpots] = await conn.execute("SELECT id,islandGuideId,name,slug,spotType FROM activity_spots WHERE name LIKE '%Cokes%' OR name LIKE '%Pasta%' OR name LIKE '%Thulusdhoo%' OR name LIKE '%Chickens%';");
    fs.writeFileSync('.manus/exports/activity_spots_named_matches.json', JSON.stringify(namedSpots, null, 2));

    const islandIds = Array.from(new Set(namedSpots.map((r) => r.islandGuideId).filter(Boolean)));
    let islandRows = [];
    if (islandIds.length > 0) {
      const placeholders = islandIds.map(() => '?').join(',');
      const [rows] = await conn.execute(`SELECT * FROM island_guides WHERE id IN (${placeholders});`, islandIds);
      islandRows = rows;
    }
    fs.writeFileSync('.manus/exports/activity_spots_island_matches.json', JSON.stringify(islandRows, null, 2));

    // Capture precise Thulusdhoo-related activity spots by exact history IDs and slug patterns.
    const thulusdhooSpotIds = [90001, 90002, 90004, 90054];
    const [thulusdhooPrecise] = await conn.execute(
      `SELECT * FROM activity_spots WHERE id IN (${thulusdhooSpotIds.map(() => '?').join(',')}) OR LOWER(slug) LIKE '%thulusdhoo%' ORDER BY name;`,
      thulusdhooSpotIds
    );
    fs.writeFileSync('.manus/exports/activity_spots_thulusdhoo_precise.json', JSON.stringify(thulusdhooPrecise, null, 2));

    // Also fetch the likely Thulusdhoo island guide records referenced by the old activity_spots rows.
    const islandGuideIds = [1, 210001];
    const [thulusdhooIslandGuides] = await conn.execute(
      `SELECT * FROM island_guides WHERE id IN (${islandGuideIds.map(() => '?').join(',')});`,
      islandGuideIds
    );
    fs.writeFileSync('.manus/exports/island_guides_thulusdhoo_precise.json', JSON.stringify(thulusdhooIslandGuides, null, 2));

    console.log('Export complete —', islands.length, 'island rows and', spots.length, 'spot rows saved to .manus/exports/');
    await conn.end();
  } catch (err) {
    console.error('Error exporting Thulusdhoo data:', err);
    process.exit(1);
  }
})();
