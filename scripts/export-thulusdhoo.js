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
    const [spots] = await conn.execute("SELECT * FROM activity_spots WHERE islandGuideId IN (SELECT id FROM island_guides WHERE name LIKE '%Thulusdhoo%') ORDER BY name;");

    fs.mkdirSync('.manus/exports', { recursive: true });
    fs.writeFileSync('.manus/exports/thulusdhoo_island_guides.json', JSON.stringify(islands, null, 2));
    fs.writeFileSync('.manus/exports/thulusdhoo_activity_spots.json', JSON.stringify(spots, null, 2));

    console.log('Export complete —', islands.length, 'island rows and', spots.length, 'spot rows saved to .manus/exports/');
    await conn.end();
  } catch (err) {
    console.error('Error exporting Thulusdhoo data:', err);
    process.exit(1);
  }
})();
