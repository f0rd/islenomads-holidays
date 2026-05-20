#!/usr/bin/env node
// One-shot migration: TiDB (MySQL) -> Supabase (Postgres).
// Run with:  node --env-file=.env scripts/migrate-mysql-to-supabase.mjs

import mysql from "mysql2/promise";
import postgres from "postgres";

const MYSQL_URL = process.env.SOURCE_MYSQL_URL;
const PG_URL = process.env.DATABASE_URL;
if (!MYSQL_URL || !PG_URL) {
  console.error("Need SOURCE_MYSQL_URL and DATABASE_URL in env");
  process.exit(1);
}

// Tables in dependency-safe order (FK parents before children).
const TABLES = [
  "users",
  "staff_roles",
  "staff",
  "atolls",
  "places",
  "island_guides",
  "packages",
  "airports",
  "airport_routes",
  "activity_types",
  "activity_spots",
  "island_spot_access",
  "experiences",
  "island_experiences",
  "spot_types",
  "media",
  "seo_metadata",
  "seo_meta_tags",
  "transports",
  "boat_routes",
  "blog_posts",
  "blog_comments",
  "branding",
  "crm_customers",
  "crm_queries",
  "crm_interactions",
  "activity_log",
  "attraction_guides",
  "attraction_island_links",
  "cms_pages",
  "hero_settings",
];

// Tables that have a numeric id sequence we need to bump after explicit-id inserts.
const TABLES_WITH_SERIAL_ID = TABLES.filter(
  (t) => t !== "island_experiences" && t !== "spot_types",
);

// Per-table column rename overrides (mysql_col -> pg_col). Empty means use same names.
const COLUMN_RENAME = {};

function quoteIdent(s) {
  return '"' + s.replace(/"/g, '""') + '"';
}

async function listMysqlColumns(mysqlConn, table) {
  const [rows] = await mysqlConn.query(
    `SELECT COLUMN_NAME, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION`,
    [table],
  );
  return rows.map((r) => ({ name: r.COLUMN_NAME, type: r.DATA_TYPE }));
}

async function listPgColumns(sql, table) {
  const rows = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${table}
    ORDER BY ordinal_position
  `;
  return rows.map((r) => ({ name: r.column_name, type: r.data_type }));
}

function coerceValue(val, pgType) {
  if (val === null || val === undefined) return null;
  // MySQL returns Date objects for timestamp/datetime; postgres lib handles Date directly.
  if (val instanceof Date) return val;
  // mysql2 returns Buffer for BINARY/BLOB; we shouldn't have those, but defensive.
  if (Buffer.isBuffer(val)) return val.toString("utf8");
  return val;
}

async function copyTable(mysqlConn, sql, table) {
  const renames = COLUMN_RENAME[table] || {};
  const mysqlCols = await listMysqlColumns(mysqlConn, table);
  const pgCols = await listPgColumns(sql, table);
  const pgColSet = new Set(pgCols.map((c) => c.name));
  const pgTypeMap = Object.fromEntries(pgCols.map((c) => [c.name, c.data_type]));

  // Build list of (mysqlCol, pgCol) pairs that exist in BOTH sides.
  const colPairs = [];
  for (const mc of mysqlCols) {
    const pgName = renames[mc.name] || mc.name;
    if (pgColSet.has(pgName)) colPairs.push({ my: mc.name, pg: pgName });
  }
  if (colPairs.length === 0) {
    console.log(`  ${table}: no matching columns, skipping`);
    return 0;
  }

  const mysqlColList = colPairs.map((p) => `\`${p.my}\``).join(", ");
  const [rows] = await mysqlConn.query(
    `SELECT ${mysqlColList} FROM \`${table}\``,
  );
  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows`);
    return 0;
  }

  // Build value rows aligned to pg column order.
  const pgColNames = colPairs.map((p) => p.pg);
  const values = rows.map((r) => {
    const out = {};
    for (const p of colPairs) {
      out[p.pg] = coerceValue(r[p.my], pgTypeMap[p.pg]);
    }
    return out;
  });

  // Insert in batches.
  const BATCH = 200;
  for (let i = 0; i < values.length; i += BATCH) {
    const slice = values.slice(i, i + BATCH);
    await sql`INSERT INTO ${sql(table)} ${sql(slice, ...pgColNames)}`;
  }
  console.log(`  ${table}: ${rows.length} rows`);
  return rows.length;
}

async function resetSequences(sql) {
  for (const t of TABLES_WITH_SERIAL_ID) {
    // Sequence name produced by SERIAL is "<table>_id_seq"
    const seq = `${t}_id_seq`;
    await sql.unsafe(
      `SELECT setval('${seq}', COALESCE((SELECT MAX(id) FROM "${t}"), 1), (SELECT MAX(id) IS NOT NULL FROM "${t}"))`,
    );
  }
}

async function main() {
  console.log("Connecting to MySQL source…");
  const mysqlConn = await mysql.createConnection(MYSQL_URL);
  console.log("Connecting to Postgres target…");
  const sql = postgres(PG_URL, { ssl: "require", max: 4 });

  try {
    let total = 0;
    for (const t of TABLES) {
      total += await copyTable(mysqlConn, sql, t);
    }
    console.log(`\nTotal rows copied: ${total}`);

    console.log("\nResetting sequences…");
    await resetSequences(sql);
    console.log("Done.");
  } finally {
    await mysqlConn.end();
    await sql.end();
  }
}

main().catch((e) => {
  console.error("MIGRATION FAILED:", e);
  process.exit(1);
});
