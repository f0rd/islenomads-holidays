import { getDb } from "../server/db";
import { 
  geographicalEntities, 
  entityDetails, 
  entityRelationships,
  entityMedia,
  places,
  islandGuides
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Migration Script: Consolidate 7 tables into unified geographical entities schema
 */

async function migrateToUnifiedSchema() {
  const db = await getDb();
  if (!db) {
    console.error("❌ Failed to connect to database");
    process.exit(1);
  }
  
  console.log("🚀 Starting migration to unified geographical entities schema...\n");
  
  try {
    // Phase 1: Migrate islands from places to geographical_entities
    console.log("📍 Phase 1: Migrating islands from places → geographical_entities");
    
    const placesData = await db.select().from(places);
    console.log(`   Found ${placesData.length} places to migrate`);
    
    let migratedEntities = 0;
    for (const place of placesData) {
      // Check if entity already exists
      const existing = await db.select().from(geographicalEntities)
        .where(eq(geographicalEntities.code, place.code || ""))
        .limit(1);
      
      if (existing.length === 0) {
        await db.insert(geographicalEntities).values({
          name: place.name,
          slug: place.name.toLowerCase().replace(/\s+/g, "-"),
          code: place.code || undefined,
          entityType: place.type as any,
          atollId: place.atollId || undefined,
          isActive: 1,
          published: 1,
        });
        migratedEntities++;
      }
    }
    console.log(`   ✓ Migrated ${migratedEntities} entities\n`);
    
    // Phase 2: Migrate guide content from islandGuides to entity_details
    console.log("📚 Phase 2: Migrating guide content from islandGuides → entity_details");
    
    const guidesData = await db.select().from(islandGuides);
    console.log(`   Found ${guidesData.length} guides to migrate`);
    
    let migratedDetails = 0;
    for (const guide of guidesData) {
      // Find corresponding entity
      const entityResult = await db.select().from(geographicalEntities)
        .where(eq(geographicalEntities.name, guide.name))
        .limit(1);
      const entity = entityResult[0];
      
      if (entity) {
        // Check if details already exist
        const existing = await db.select().from(entityDetails)
          .where(eq(entityDetails.entityId, entity.id))
          .limit(1);
        
        if (existing.length === 0) {
          await db.insert(entityDetails).values({
            entityId: entity.id,
            bestTimeToVisit: guide.bestTimeToVisit || undefined,
            currency: guide.currency || undefined,
            language: guide.language || undefined,
            flightInfo: guide.flightInfo || undefined,
            speedboatInfo: guide.speedboatInfo || undefined,
            ferryInfo: guide.ferryInfo || undefined,
            activities: guide.topThingsToDo || undefined,
            restaurants: guide.foodCafes || undefined,
            whatToPack: guide.whatToPack || undefined,
            healthTips: guide.healthTips || undefined,
            emergencyContacts: guide.emergencyContacts || undefined,
            attractions: guide.attractions || undefined,
            threeDayItinerary: guide.threeDayItinerary || undefined,
            fiveDayItinerary: guide.fiveDayItinerary || undefined,
            faq: guide.faq || undefined,
            quickFacts: guide.quickFacts || undefined,
          });
          migratedDetails++;
        }
      }
    }
    console.log(`   ✓ Migrated ${migratedDetails} guide details\n`);
    
    // Phase 3: Migrate nearby dive sites and surf spots to entity_relationships
    console.log("🤿 Phase 3: Migrating nearby dive/surf sites to entity_relationships");
    
    let migratedRelationships = 0;
    
    for (const guide of guidesData) {
      const sourceEntityResult = await db.select().from(geographicalEntities)
        .where(eq(geographicalEntities.name, guide.name))
        .limit(1);
      const sourceEntity = sourceEntityResult[0];
      
      if (!sourceEntity) continue;
      
      // Migrate nearby dive sites
      if (guide.nearbyDiveSites) {
        try {
          const diveSites = typeof guide.nearbyDiveSites === "string" 
            ? JSON.parse(guide.nearbyDiveSites) 
            : guide.nearbyDiveSites;
          
          if (Array.isArray(diveSites)) {
            for (const site of diveSites) {
              // Find or create target entity for dive site
              const targetResult = await db.select().from(geographicalEntities)
                .where(eq(geographicalEntities.name, site.name))
                .limit(1);
              let targetEntity = targetResult[0];
              
              if (!targetEntity) {
                await db.insert(geographicalEntities).values({
                  name: site.name,
                  slug: site.name.toLowerCase().replace(/\s+/g, "-"),
                  entityType: "dive_site",
                  description: site.description || undefined,
                  isActive: 1,
                  published: 1,
                });
                const newResult = await db.select().from(geographicalEntities)
                  .where(eq(geographicalEntities.name, site.name))
                  .limit(1);
                targetEntity = newResult[0];
              }
              
              if (targetEntity) {
                // Check if relationship already exists
                const existing = await db.select().from(entityRelationships)
                  .where(eq(entityRelationships.sourceEntityId, sourceEntity.id))
                  .limit(1);
                
                if (existing.length === 0) {
                  await db.insert(entityRelationships).values({
                    sourceEntityId: sourceEntity.id,
                    targetEntityId: targetEntity.id,
                    relationshipType: "nearby_dive_site",
                    distance: site.distance || undefined,
                    difficulty: site.difficulty || undefined,
                    notes: site.description || undefined,
                  });
                  migratedRelationships++;
                }
              }
            }
          }
        } catch (e) {
          console.log(`   ⚠ Error parsing dive sites for ${guide.name}: ${e}`);
        }
      }
      
      // Migrate nearby surf spots
      if (guide.nearbySurfSpots) {
        try {
          const surfSpots = typeof guide.nearbySurfSpots === "string" 
            ? JSON.parse(guide.nearbySurfSpots) 
            : guide.nearbySurfSpots;
          
          if (Array.isArray(surfSpots)) {
            for (const spot of surfSpots) {
              // Find or create target entity for surf spot
              const targetResult = await db.select().from(geographicalEntities)
                .where(eq(geographicalEntities.name, spot.name))
                .limit(1);
              let targetEntity = targetResult[0];
              
              if (!targetEntity) {
                await db.insert(geographicalEntities).values({
                  name: spot.name,
                  slug: spot.name.toLowerCase().replace(/\s+/g, "-"),
                  entityType: "surf_spot",
                  description: spot.description || undefined,
                  isActive: 1,
                  published: 1,
                });
                const newResult = await db.select().from(geographicalEntities)
                  .where(eq(geographicalEntities.name, spot.name))
                  .limit(1);
                targetEntity = newResult[0];
              }
              
              if (targetEntity) {
                // Check if relationship already exists
                const existing = await db.select().from(entityRelationships)
                  .where(eq(entityRelationships.sourceEntityId, sourceEntity.id))
                  .limit(1);
                
                if (existing.length === 0) {
                  await db.insert(entityRelationships).values({
                    sourceEntityId: sourceEntity.id,
                    targetEntityId: targetEntity.id,
                    relationshipType: "nearby_surf_spot",
                    distance: spot.distance || undefined,
                    difficulty: spot.difficulty || undefined,
                    notes: spot.description || undefined,
                  });
                  migratedRelationships++;
                }
              }
            }
          }
        } catch (e) {
          console.log(`   ⚠ Error parsing surf spots for ${guide.name}: ${e}`);
        }
      }
    }
    console.log(`   ✓ Migrated ${migratedRelationships} relationships\n`);
    
    // Phase 4: Migrate images to entity_media
    console.log("🖼️  Phase 4: Migrating images to entity_media");
    
    let migratedMedia = 0;
    
    for (const guide of guidesData) {
      const entityResult = await db.select().from(geographicalEntities)
        .where(eq(geographicalEntities.name, guide.name))
        .limit(1);
      const entity = entityResult[0];
      
      if (!entity) continue;
      
      // Migrate hero image
      if (guide.heroImage) {
        const existing = await db.select().from(entityMedia)
          .where(eq(entityMedia.entityId, entity.id))
          .limit(1);
        
        if (existing.length === 0) {
          await db.insert(entityMedia).values({
            entityId: entity.id,
            mediaType: "image",
            url: guide.heroImage,
            caption: `${guide.name} Hero Image`,
            displayOrder: 0,
          });
          migratedMedia++;
        }
      }
      
      // Migrate other images
      if (guide.images) {
        try {
          const images = typeof guide.images === "string" 
            ? JSON.parse(guide.images) 
            : guide.images;
          
          if (Array.isArray(images)) {
            for (let i = 0; i < images.length; i++) {
              const img = images[i];
              await db.insert(entityMedia).values({
                entityId: entity.id,
                mediaType: "image",
                url: img.url || img,
                caption: img.caption || `${guide.name} Image ${i + 1}`,
                displayOrder: i + 1,
              });
              migratedMedia++;
            }
          }
        } catch (e) {
          console.log(`   ⚠ Error parsing images for ${guide.name}: ${e}`);
        }
      }
    }
    console.log(`   ✓ Migrated ${migratedMedia} media files\n`);
    
    // Summary
    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • Entities migrated: ${migratedEntities}`);
    console.log(`   • Entity details migrated: ${migratedDetails}`);
    console.log(`   • Relationships migrated: ${migratedRelationships}`);
    console.log(`   • Media files migrated: ${migratedMedia}\n`);
    
    console.log("⚠️  Next steps:");
    console.log("   1. Verify data in new tables");
    console.log("   2. Update application queries to use new schema");
    console.log("   3. Test all features thoroughly");
    console.log("   4. Archive old tables as backup");
    console.log("   5. Delete old tables after verification\n");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateToUnifiedSchema();
