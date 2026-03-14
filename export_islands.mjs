import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: 'root',
  password: process.env.DATABASE_URL?.split(':')[1]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'manus',
});

const [rows] = await connection.execute('SELECT id, name, atoll, featured FROM island_guides ORDER BY name');

console.log('ID,Name,Atoll,Featured');
rows.forEach(row => {
  console.log(`${row.id},"${row.name}","${row.atoll}",${row.featured}`);
});

await connection.end();
