#!/usr/bin/env node

/**
 * Migration Script: Link Boat Routes to Island Guides
 * 
 * This script automatically links existing boat routes to their corresponding island guides
 * by matching boat route endpoints with island guide locations.
 * 
 * Strategy:
 * 1. For boat routes with fromIslandGuideId/toIslandGuideId: Use these direct references
 * 2. For boat routes with fromLocation/toLocation: Match against island guide names
 * 3. Create links in island_guide_transports table
 * 4. Log all operations for verification and rollback capability
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const MIGRATION_LOG = {
  startTime: new Date().toISOString(),
  totalBoatRoutes: 0,
  linkedRoutes: 0,
  failedRoutes: 0,
  operations: [],
  errors: [],
};

async function main() {
  let connection;
  try {
    console.log('🚀 Starting Boat Routes to Island Guides Migration...\n');
    
    connection = await mysql.createConnection(DB_CONFIG);
    
    // Step 1: Get all boat routes
    console.log('📊 Step 1: Fetching boat routes...');
    const [boatRoutes] = await connection.query(
      'SELECT id, name, fromIslandGuideId, toIslandGuideId, fromLocation, toLocation, published FROM boat_routes'
    );
    
    MIGRATION_LOG.totalBoatRoutes = boatRoutes.length;
    console.log(`   Found ${boatRoutes.length} boat routes\n`);
    
    // Step 2: Get all island guides for matching
    console.log('📋 Step 2: Fetching island guides...');
    const [islandGuides] = await connection.query(
      'SELECT id, name, slug FROM island_guides'
    );
    console.log(`   Found ${islandGuides.length} island guides\n`);
    
    // Create name lookup map for faster matching
    const guidesByName = new Map();
    const guidesBySlug = new Map();
    islandGuides.forEach(guide => {
      guidesByName.set(guide.name.toLowerCase(), guide);
      guidesBySlug.set(guide.slug.toLowerCase(), guide);
    });
    
    // Step 3: Process each boat route
    console.log('🔗 Step 3: Linking boat routes to island guides...\n');
    
    for (const route of boatRoutes) {
      try {
        const linkedGuides = [];
        
        // Strategy 1: Use direct fromIslandGuideId if available
        if (route.fromIslandGuideId) {
          const [guide] = await connection.query(
            'SELECT id FROM island_guides WHERE id = ?',
            [route.fromIslandGuideId]
          );
          if (guide.length > 0) {
            linkedGuides.push({
              islandGuideId: route.fromIslandGuideId,
              displayOrder: 0,
              source: 'fromIslandGuideId'
            });
          }
        }
        
        // Strategy 2: Use direct toIslandGuideId if available
        if (route.toIslandGuideId) {
          const [guide] = await connection.query(
            'SELECT id FROM island_guides WHERE id = ?',
            [route.toIslandGuideId]
          );
          if (guide.length > 0) {
            linkedGuides.push({
              islandGuideId: route.toIslandGuideId,
              displayOrder: 1,
              source: 'toIslandGuideId'
            });
          }
        }
        
        // Strategy 3: Match by location name if no direct IDs
        if (linkedGuides.length === 0) {
          // Try to match fromLocation
          if (route.fromLocation) {
            const fromGuide = guidesByName.get(route.fromLocation.toLowerCase()) ||
                             guidesBySlug.get(route.fromLocation.toLowerCase().replace(/\\s+/g, '-'));
            if (fromGuide) {
              linkedGuides.push({
                islandGuideId: fromGuide.id,
                displayOrder: 0,
                source: 'fromLocation'
              });
            }
          }
          
          // Try to match toLocation
          if (route.toLocation) {
            const toGuide = guidesByName.get(route.toLocation.toLowerCase()) ||
                           guidesBySlug.get(route.toLocation.toLowerCase().replace(/\\s+/g, '-'));
            if (toGuide && (!linkedGuides.length || toGuide.id !== linkedGuides[0].islandGuideId)) {
              linkedGuides.push({
                islandGuideId: toGuide.id,
                displayOrder: linkedGuides.length,
                source: 'toLocation'
              });
            }
          }
        }
        
        // Step 4: Insert links into island_guide_transports
        if (linkedGuides.length > 0) {
          for (const link of linkedGuides) {
            try {
              await connection.query(
                'INSERT INTO island_guide_transports (islandGuideId, transportId, displayOrder) VALUES (?, ?, ?)',
                [link.islandGuideId, route.id, link.displayOrder]
              );
              
              MIGRATION_LOG.operations.push({
                boatRouteId: route.id,
                boatRouteName: route.name,
                islandGuideId: link.islandGuideId,
                displayOrder: link.displayOrder,
                matchSource: link.source,
                status: 'success'
              });
              
              console.log(`   ✓ Route "${route.name}" (ID: ${route.id}) linked to guide ID ${link.islandGuideId}`);
            } catch (error) {
              if (error.code === 'ER_DUP_ENTRY') {
                // Link already exists, skip
                console.log(`   ⊘ Route "${route.name}" already linked to guide ID ${link.islandGuideId}`);
              } else {
                throw error;
              }
            }
          }
          MIGRATION_LOG.linkedRoutes++;
        } else {
          console.log(`   ✗ Route "${route.name}" (ID: ${route.id}) - No matching island guide found`);
          MIGRATION_LOG.operations.push({
            boatRouteId: route.id,
            boatRouteName: route.name,
            status: 'no_match',
            fromLocation: route.fromLocation,
            toLocation: route.toLocation
          });
        }
      } catch (error) {
        MIGRATION_LOG.failedRoutes++;
        MIGRATION_LOG.errors.push({
          boatRouteId: route.id,
          boatRouteName: route.name,
          error: error.message
        });
        console.log(`   ✗ Error processing route "${route.name}": ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total boat routes processed: ${MIGRATION_LOG.totalBoatRoutes}`);
    console.log(`Successfully linked: ${MIGRATION_LOG.linkedRoutes}`);
    console.log(`Failed to link: ${MIGRATION_LOG.failedRoutes}`);
    console.log(`No match found: ${MIGRATION_LOG.totalBoatRoutes - MIGRATION_LOG.linkedRoutes - MIGRATION_LOG.failedRoutes}`);
    console.log('='.repeat(60) + '\n');
    
    // Save migration log
    MIGRATION_LOG.endTime = new Date().toISOString();
    const logPath = path.join(process.cwd(), 'migration-logs', `boat-routes-${Date.now()}.json`);
    
    if (!fs.existsSync(path.join(process.cwd(), 'migration-logs'))) {
      fs.mkdirSync(path.join(process.cwd(), 'migration-logs'), { recursive: true });
    }
    
    fs.writeFileSync(logPath, JSON.stringify(MIGRATION_LOG, null, 2));
    console.log(`📝 Migration log saved to: ${logPath}\n`);
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    MIGRATION_LOG.errors.push({
      phase: 'main',
      error: error.message
    });
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
