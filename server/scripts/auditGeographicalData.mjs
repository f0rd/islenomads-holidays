/**
 * Data Audit Script for Geographical Consistency
 * Checks all islands in the database against reference data
 * Usage: node auditGeographicalData.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Reference data for validation
const VALID_ISLAND_ATOLL_MAPPINGS = {
  'male': 'Kaafu Atoll',
  'maafushi-island': 'Kaafu Atoll',
  'thoddoo-island': 'North Ari Atoll',
  'guraidhoo-island': 'Kaafu Atoll',
  'thulusdhoo-island': 'Kaafu Atoll',
  'kandooma-island': 'South Male Atoll',
  'fuvamulah-island': 'Gnaviyani Atoll',
};

// Maldives coordinate bounds
const COORDINATE_BOUNDS = {
  minLat: -0.7,
  maxLat: 6.5,
  minLon: 72.6,
  maxLon: 73.8,
};

// Valid distance range (0-400 km)
const DISTANCE_BOUNDS = {
  min: 0,
  max: 400,
};

async function auditGeographicalData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'islenomads',
  });

  try {
    console.log('🔍 Starting geographical data audit...\n');

    // Get all published islands
    const [islands] = await connection.query(
      'SELECT id, name, slug, atoll, published FROM island_guides WHERE published = 1 ORDER BY atoll, name'
    );

    console.log(`📊 Found ${islands.length} published islands\n`);

    const issues = [];
    const warnings = [];

    // Check each island
    for (const island of islands) {
      const { id, name, slug, atoll } = island;
      const normalizedSlug = slug.toLowerCase();

      // Check atoll assignment
      const expectedAtoll = VALID_ISLAND_ATOLL_MAPPINGS[normalizedSlug];
      if (expectedAtoll && atoll !== expectedAtoll) {
        issues.push({
          type: 'ATOLL_MISMATCH',
          islandId: id,
          islandName: name,
          slug,
          current: atoll,
          expected: expectedAtoll,
          severity: 'HIGH',
        });
      }

      // Check for duplicate islands in same atoll
      const duplicates = islands.filter(
        (i) => i.atoll === atoll && i.slug.toLowerCase().includes(normalizedSlug.split('-')[0])
      );
      if (duplicates.length > 1) {
        warnings.push({
          type: 'POTENTIAL_DUPLICATE',
          islandId: id,
          islandName: name,
          slug,
          atoll,
          duplicateCount: duplicates.length,
        });
      }
    }

    // Get islands with coordinates
    const [islandsWithCoords] = await connection.query(
      'SELECT id, name, slug, coordinates FROM island_guides WHERE published = 1 AND coordinates IS NOT NULL'
    );

    for (const island of islandsWithCoords) {
      try {
        const coords = JSON.parse(island.coordinates);
        const { latitude, longitude } = coords;

        // Check coordinate bounds
        if (
          latitude < COORDINATE_BOUNDS.minLat ||
          latitude > COORDINATE_BOUNDS.maxLat ||
          longitude < COORDINATE_BOUNDS.minLon ||
          longitude > COORDINATE_BOUNDS.maxLon
        ) {
          issues.push({
            type: 'INVALID_COORDINATES',
            islandId: island.id,
            islandName: island.name,
            slug: island.slug,
            coordinates: `${latitude}, ${longitude}`,
            severity: 'MEDIUM',
          });
        }
      } catch (e) {
        warnings.push({
          type: 'INVALID_COORDINATES_FORMAT',
          islandId: island.id,
          islandName: island.name,
          slug: island.slug,
          error: e.message,
        });
      }
    }

    // Report results
    console.log('═══════════════════════════════════════════════════════════\n');

    if (issues.length === 0) {
      console.log('✅ No critical issues found!\n');
    } else {
      console.log(`❌ Found ${issues.length} critical issue(s):\n`);

      // Group by type
      const byType = {};
      for (const issue of issues) {
        if (!byType[issue.type]) byType[issue.type] = [];
        byType[issue.type].push(issue);
      }

      for (const [type, typeIssues] of Object.entries(byType)) {
        console.log(`\n📍 ${type} (${typeIssues.length} issue${typeIssues.length > 1 ? 's' : ''}):`);
        for (const issue of typeIssues) {
          if (issue.type === 'ATOLL_MISMATCH') {
            console.log(
              `   - ${issue.islandName} (${issue.slug}): "${issue.current}" should be "${issue.expected}"`
            );
          } else if (issue.type === 'INVALID_COORDINATES') {
            console.log(
              `   - ${issue.islandName} (${issue.slug}): Coordinates ${issue.coordinates} out of bounds`
            );
          }
        }
      }
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  Found ${warnings.length} warning(s):\n`);
      for (const warning of warnings) {
        if (warning.type === 'POTENTIAL_DUPLICATE') {
          console.log(
            `   - ${warning.islandName} (${warning.slug}): ${warning.duplicateCount} similar islands in ${warning.atoll}`
          );
        } else if (warning.type === 'INVALID_COORDINATES_FORMAT') {
          console.log(`   - ${warning.islandName} (${warning.slug}): Invalid coordinates format`);
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`\n📈 Summary:`);
    console.log(`   Total Islands: ${islands.length}`);
    console.log(`   Critical Issues: ${issues.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Status: ${issues.length === 0 ? '✅ PASS' : '❌ FAIL'}\n`);

    if (issues.length > 0) {
      console.log('💡 Recommendations:');
      const atollMismatches = issues.filter((i) => i.type === 'ATOLL_MISMATCH');
      if (atollMismatches.length > 0) {
        console.log(`   - Fix ${atollMismatches.length} atoll assignment(s)`);
      }
      const coordIssues = issues.filter((i) => i.type === 'INVALID_COORDINATES');
      if (coordIssues.length > 0) {
        console.log(`   - Verify ${coordIssues.length} coordinate(s)`);
      }
    }

  } catch (error) {
    console.error('❌ Error during audit:', error.message);
  } finally {
    await connection.end();
  }
}

// Run the audit
auditGeographicalData().catch(console.error);
