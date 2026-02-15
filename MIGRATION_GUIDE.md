# Boat Routes to Island Guides Migration Guide

## Overview

This guide explains how to use the migration scripts to link existing boat routes to their corresponding island guides in the `island_guide_transports` table.

## Why This Migration?

The system is transitioning from having boat route information scattered across multiple tables to a unified approach where:
- **Boat Routes** (`boat_routes` table) store transportation details
- **Island Guides** (`island_guides` table) store island information
- **Island Guide Transports** (`island_guide_transports` table) creates the many-to-many relationship

This allows island guides to be linked to multiple transport options, and transports to serve multiple islands.

## Migration Scripts

### 1. **migrate-boat-routes.mjs** - Main Migration Script

Automatically links boat routes to island guides using multiple matching strategies.

#### Matching Strategies (in order of priority):

1. **Direct ID Matching** - Uses `fromIslandGuideId` and `toIslandGuideId` fields if available
2. **Location Name Matching** - Matches `fromLocation` and `toLocation` against island guide names and slugs
3. **No Match** - Logs routes that couldn't be matched for manual review

#### Usage:

```bash
# Make sure environment variables are set
export DB_HOST=your_host
export DB_USER=your_user
export DB_PASSWORD=your_password
export DB_NAME=your_database

# Run the migration
node migrate-boat-routes.mjs
```

#### Output:

- Console output showing migration progress
- Migration log saved to `migration-logs/boat-routes-{timestamp}.json`

#### Log File Contents:

```json
{
  "startTime": "2026-02-15T12:00:00.000Z",
  "endTime": "2026-02-15T12:05:00.000Z",
  "totalBoatRoutes": 45,
  "linkedRoutes": 42,
  "failedRoutes": 0,
  "operations": [
    {
      "boatRouteId": 1,
      "boatRouteName": "Male to Dhigurah",
      "islandGuideId": 5,
      "displayOrder": 0,
      "matchSource": "fromIslandGuideId",
      "status": "success"
    }
  ],
  "errors": []
}
```

### 2. **rollback-boat-routes.mjs** - Rollback Script

Safely removes all links created by the migration script.

#### Usage:

```bash
node rollback-boat-routes.mjs
```

The script will:
1. Show the number of links to be removed
2. Ask for confirmation
3. Delete all links from `island_guide_transports`
4. Save a rollback log

## Step-by-Step Migration Process

### Before Migration

1. **Backup your database** - Always backup before running migrations
   ```bash
   mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup-$(date +%Y%m%d-%H%M%S).sql
   ```

2. **Review existing data**
   ```sql
   -- Check boat routes
   SELECT COUNT(*) FROM boat_routes;
   
   -- Check island guides
   SELECT COUNT(*) FROM island_guides;
   
   -- Check if any links already exist
   SELECT COUNT(*) FROM island_guide_transports;
   ```

### Running the Migration

1. **Set environment variables**
   ```bash
   export DB_HOST=localhost
   export DB_USER=root
   export DB_PASSWORD=your_password
   export DB_NAME=islenomads_db
   ```

2. **Run the migration script**
   ```bash
   node migrate-boat-routes.mjs
   ```

3. **Review the output**
   - Check the console output for any warnings
   - Review the migration log file

### After Migration

1. **Verify the links**
   ```sql
   -- Check total links created
   SELECT COUNT(*) FROM island_guide_transports;
   
   -- View sample links
   SELECT igt.*, br.name as boat_route_name, ig.name as island_guide_name
   FROM island_guide_transports igt
   JOIN boat_routes br ON igt.transportId = br.id
   JOIN island_guides ig ON igt.islandGuideId = ig.id
   LIMIT 10;
   ```

2. **Test the application**
   - Navigate to the Island Guides admin page
   - Check if transports are now linked to guides
   - Verify the display order is correct

3. **Monitor for issues**
   - Check application logs for any errors
   - Verify that island guide pages display transport information correctly

## Troubleshooting

### Issue: "No matching island guide found" for many routes

**Cause:** Location names in boat routes don't match island guide names exactly

**Solution:**
1. Review the unmatched routes in the migration log
2. Manually update boat route location names to match island guide names
3. Re-run the migration

### Issue: Duplicate links created

**Cause:** Migration script was run multiple times

**Solution:**
1. Run the rollback script: `node rollback-boat-routes.mjs`
2. Fix any data issues
3. Re-run the migration

### Issue: Database connection refused

**Cause:** Environment variables not set or database not accessible

**Solution:**
1. Verify database is running
2. Check environment variables: `echo $DB_HOST $DB_USER $DB_NAME`
3. Test connection manually: `mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME`

## Manual Linking (If Needed)

If you need to manually link a boat route to an island guide:

```sql
INSERT INTO island_guide_transports (islandGuideId, transportId, displayOrder)
VALUES (
  5,    -- Island Guide ID
  1,    -- Boat Route ID (from transports table)
  0     -- Display Order
);
```

## Rollback Procedure

If you need to undo the migration:

1. **Using the rollback script**
   ```bash
   node rollback-boat-routes.mjs
   ```

2. **Manual rollback**
   ```sql
   DELETE FROM island_guide_transports;
   ```

3. **From backup** (if something went wrong)
   ```bash
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup-20260215-120000.sql
   ```

## Next Steps

After successful migration:

1. **Update Island Guides Admin UI** - Add transport selector component
2. **Update Island Guide Display** - Show linked transports on island pages
3. **Deprecate Old Fields** - Eventually remove `flightInfo`, `speedboatInfo`, `ferryInfo` from island guides
4. **Consolidate Tables** - After all data is migrated, consolidate boat_routes into transports table

## Support

For issues or questions:
1. Check the migration log file for detailed error information
2. Review this guide's troubleshooting section
3. Contact the development team with the migration log file

---

**Last Updated:** 2026-02-15  
**Version:** 1.0
