#!/usr/bin/env node

/**
 * Rollback Script: Remove Boat Routes to Island Guides Links
 * 
 * This script removes all links created by the migration script
 * Useful if you need to revert the migration or re-run it
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

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

async function promptConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  let connection;
  try {
    console.log('⚠️  ROLLBACK: Boat Routes to Island Guides Links\n');
    console.log('This will remove ALL links between boat routes and island guides');
    console.log('created by the migration script.\n');
    
    const confirmed = await promptConfirmation('Are you sure you want to proceed? (yes/no): ');
    
    if (!confirmed) {
      console.log('Rollback cancelled.');
      process.exit(0);
    }
    
    connection = await mysql.createConnection(DB_CONFIG);
    
    // Get count of existing links
    console.log('\n📊 Checking existing links...');
    const [[{ count }]] = await connection.query(
      'SELECT COUNT(*) as count FROM island_guide_transports'
    );
    console.log(`   Found ${count} links to remove\n`);
    
    if (count === 0) {
      console.log('No links to remove. Exiting.');
      process.exit(0);
    }
    
    // Delete all links
    console.log('🗑️  Removing all island_guide_transports links...');
    const result = await connection.query('DELETE FROM island_guide_transports');
    console.log(`   ✓ Deleted ${result[0].affectedRows} links\n`);
    
    // Save rollback log
    const logPath = path.join(process.cwd(), 'migration-logs', `rollback-${Date.now()}.json`);
    
    if (!fs.existsSync(path.join(process.cwd(), 'migration-logs'))) {
      fs.mkdirSync(path.join(process.cwd(), 'migration-logs'), { recursive: true });
    }
    
    fs.writeFileSync(logPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      action: 'rollback',
      linksRemoved: result[0].affectedRows,
    }, null, 2));
    
    console.log(`📝 Rollback log saved to: ${logPath}\n`);
    console.log('✅ Rollback completed successfully!');
    
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
