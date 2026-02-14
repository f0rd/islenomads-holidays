# Geographical Data Validation Layer

This document describes the data validation system implemented to prevent geographical data inconsistencies for atoll-island relationships.

## Overview

The validation layer ensures that:

1. **Island-Atoll Relationships** - Each island is assigned to the correct atoll
2. **Coordinate Validation** - Island coordinates are within Maldives geographical bounds
3. **Distance Validation** - Distance from Malé is within reasonable range
4. **Data Consistency** - All geographical data follows established standards

## Components

### 1. Reference Data (`shared/geographicalData.ts`)

Contains authoritative mappings and validation functions:

- **VALID_ISLAND_ATOLL_MAPPINGS** - Authoritative island-to-atoll mappings
- **ATOLL_REFERENCE_DATA** - Detailed atoll information
- **ISLAND_REFERENCE_DATA** - Detailed island information with coordinates and distances

**Key Functions:**

```typescript
// Validate island-atoll pair
isValidIslandAtollPair(islandSlug: string, atoll: string): boolean

// Get correct atoll for an island
getCorrectAtollForIsland(islandSlug: string): string | null

// Validate coordinates are within Maldives bounds
isValidIslandCoordinates(latitude: number, longitude: number): boolean

// Validate distance from Malé
isValidDistanceFromMale(distance: number): boolean

// Comprehensive validation
validateIslandData(data: {...}): { valid: boolean; errors: string[] }
```

### 2. Server-Side Validation (`server/validation/geographicalValidation.ts`)

Provides server-side validation functions for tRPC procedures:

```typescript
// Validate island data and return errors/warnings
validateIslandData(data: {...}): ValidationResult

// Throw TRPC error if validation fails
validateIslandDataOrThrow(data: {...}): void

// Validate specific aspects
validateAtollIslandPair(islandSlug: string, atoll: string): {...}
validateCoordinates(latitude: number, longitude: number): {...}
validateDistance(distance: number): {...}

// Batch validation
validateMultipleIslands(islands: Array<{...}>): Array<{...}>

// Get validation summary
getValidationSummary(validations: Array<{...}>): {...}
```

### 3. Data Audit Script (`server/scripts/auditGeographicalData.mjs`)

Checks all islands in the database against reference data.

**Usage:**

```bash
# Run the audit script
node server/scripts/auditGeographicalData.mjs
```

**Output:**

The script generates a report showing:

- ✅ Valid islands
- ❌ Critical issues (atoll mismatches, invalid coordinates)
- ⚠️ Warnings (potential duplicates, format issues)
- 📈 Summary statistics

**Example Output:**

```
🔍 Starting geographical data audit...

📊 Found 7 published islands

═══════════════════════════════════════════════════════════

✅ No critical issues found!

📈 Summary:
   Total Islands: 7
   Critical Issues: 0
   Warnings: 0
   Status: ✅ PASS
```

### 4. Validation Tests (`server/validation/geographicalValidation.test.ts`)

Comprehensive test suite covering all validation functions.

**Run tests:**

```bash
pnpm test -- server/validation/geographicalValidation.test.ts
```

## Usage Examples

### Example 1: Validate Island Data Before Saving

```typescript
import { validateIslandDataOrThrow } from '@server/validation/geographicalValidation';

// In your tRPC procedure
export const createIsland = protectedProcedure
  .input(islandSchema)
  .mutation(async ({ input }) => {
    // Validate geographical data
    validateIslandDataOrThrow({
      slug: input.slug,
      name: input.name,
      atoll: input.atoll,
      coordinates: input.coordinates,
      distanceFromMale: input.distanceFromMale,
    });

    // Save to database
    return db.insert(islandGuides).values(input);
  });
```

### Example 2: Get Validation Errors

```typescript
import { validateAtollIslandPair } from '@server/validation/geographicalValidation';

const validation = validateAtollIslandPair('thoddoo-island', 'Baa Atoll');

if (!validation.valid) {
  console.log(`Error: ${validation.message}`);
  console.log(`Suggested atoll: ${validation.suggestedAtoll}`);
  // Output:
  // Error: Island "thoddoo-island" does not belong to "Baa Atoll"
  // Suggested atoll: North Ari Atoll
}
```

### Example 3: Batch Validate Multiple Islands

```typescript
import { validateMultipleIslands, getValidationSummary } from '@server/validation/geographicalValidation';

const islands = [
  { slug: 'thoddoo-island', name: 'Thoddoo', atoll: 'North Ari Atoll', ... },
  { slug: 'maafushi-island', name: 'Maafushi', atoll: 'Kaafu Atoll', ... },
  // ... more islands
];

const validations = validateMultipleIslands(islands);
const summary = getValidationSummary(validations);

console.log(`Valid: ${summary.validIslands}/${summary.totalIslands}`);
console.log(`Errors: ${summary.totalErrors}`);
console.log(`Warnings: ${summary.totalWarnings}`);
```

## Reference Data

### Valid Island-Atoll Mappings

| Island | Atoll | Distance from Malé | Travel Method |
|--------|-------|-------------------|----------------|
| Malé | Kaafu Atoll | 0 km | - |
| Maafushi | Kaafu Atoll | 30 km | Speedboat |
| Thoddoo | North Ari Atoll | 67 km | Speedboat |
| Guraidhoo | Kaafu Atoll | 35 km | Speedboat |
| Thulusdhoo | Kaafu Atoll | 40 km | Speedboat |
| Kandooma | South Male Atoll | 25 km | Speedboat |
| Fuvamulah | Gnaviyani Atoll | 250 km | Domestic Flight |

### Geographical Bounds

- **Latitude Range:** -0.7° to 6.5°
- **Longitude Range:** 72.6° to 73.8°
- **Distance Range:** 0 to 400 km from Malé

## Fixing Data Issues

### Issue: Atoll Mismatch

**Problem:** Island is assigned to wrong atoll

**Solution:**

```sql
-- Update the island's atoll
UPDATE island_guides 
SET atoll = 'North Ari Atoll' 
WHERE slug = 'thoddoo-island';
```

### Issue: Invalid Coordinates

**Problem:** Coordinates are outside Maldives bounds

**Solution:**

1. Verify correct coordinates from reference data
2. Update the database:

```sql
UPDATE island_guides 
SET coordinates = JSON_OBJECT('latitude', 5.3, 'longitude', 73.4)
WHERE slug = 'thoddoo-island';
```

### Issue: Invalid Distance

**Problem:** Distance from Malé is outside valid range

**Solution:**

```sql
UPDATE island_guides 
SET distanceFromMale = 67 
WHERE slug = 'thoddoo-island';
```

## Maintenance

### Regular Audits

Run the audit script weekly to catch data inconsistencies:

```bash
# Schedule with cron
0 0 * * 0 cd /path/to/project && node server/scripts/auditGeographicalData.mjs
```

### Adding New Islands

When adding a new island:

1. Add to `VALID_ISLAND_ATOLL_MAPPINGS` in `shared/geographicalData.ts`
2. Add to `ISLAND_REFERENCE_DATA` with complete information
3. Run validation tests to ensure data is correct
4. Run audit script to verify database consistency

### Updating Reference Data

If geographical data changes:

1. Update `shared/geographicalData.ts` with new reference data
2. Run `pnpm test` to verify validation logic
3. Run audit script to find affected records
4. Update database records as needed

## Best Practices

1. **Always validate before saving** - Use `validateIslandDataOrThrow()` in tRPC procedures
2. **Run audits regularly** - Schedule weekly or monthly audits
3. **Keep reference data updated** - Update `geographicalData.ts` when reference data changes
4. **Test thoroughly** - Add tests when adding new validation rules
5. **Document changes** - Update this file when adding new validation rules

## Troubleshooting

### Audit Script Won't Run

**Error:** `ECONNREFUSED`

**Solution:** Ensure database connection variables are set:

```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=password
export DB_NAME=islenomads
node server/scripts/auditGeographicalData.mjs
```

### Validation Tests Fail

**Solution:** Run tests with verbose output:

```bash
pnpm test -- server/validation/geographicalValidation.test.ts --reporter=verbose
```

### Data Inconsistencies Found

**Solution:**

1. Review the audit report
2. Identify the issue type (atoll mismatch, invalid coordinates, etc.)
3. Use the "Fixing Data Issues" section above to correct
4. Re-run audit to verify fix

## Future Enhancements

- [ ] Add automatic coordinate validation from maps API
- [ ] Implement real-time validation in admin UI
- [ ] Add data versioning for audit trail
- [ ] Create admin dashboard for data validation status
- [ ] Add email alerts for validation failures
