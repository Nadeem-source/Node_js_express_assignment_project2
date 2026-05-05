const mysql = require('mysql2/promise');
const fs = require('fs');

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mehdi1214@786',
  });

  try {
    const sql = fs.readFileSync('D:\\CRUD-App\\sql\\setup.sql', 'utf8');
    const statements = sql.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await pool.query(stmt);
      }
    }
    console.log('Database setup completed');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
