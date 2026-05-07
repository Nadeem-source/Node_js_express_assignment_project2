// mysql2/promise for DB setup. Used to run setup queries. If not used, no setup. Alternatives: mysql2 sync.
const mysql = require('mysql2/promise');

// fs for file reading. Used to read SQL file. If not used, no SQL. Alternatives: Inline SQL.
const fs = require('fs');

// Async run function. Used to execute setup. If not used, no execution. Alternatives: Top level await.
async function run() {
  // Create pool for setup. Used to connect without DB. If not used, no connection. Alternatives: Single connection.
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mehdi1214@786',
  });

  // Try block for setup. Used to handle errors. If not used, unhandled errors. Alternatives: No try.
  try {
    // Read SQL file. Used to get setup commands. If not used, no setup. Alternatives: Hardcode SQL.
    const sql = fs.readFileSync('D:\\CRUD-App\\sql\\setup.sql', 'utf8');
    // Split into statements. Used to execute multiple. If not used, single query. Alternatives: Execute whole.
    const statements = sql.split(';').filter(s => s.trim());
    // Loop over statements. Used to run each. If not used, no execution. Alternatives: Single query.
    for (const stmt of statements) {
      if (stmt.trim()) {
        await pool.query(stmt);
      }
    }
    // Log success. Used to inform. If not used, silent. Alternatives: No log.
    console.log('Database setup completed');
  // Catch errors. Used to log and exit. If not used, silent fail. Alternatives: Throw.
  } catch (err) {
    console.error(err);
    process.exit(1);
  // Finally to close pool. Used to clean up. If not used, connection leak. Alternatives: No finally.
  } finally {
    await pool.end();
  }
}

// Call run. Used to start setup. If not used, nothing happens. Alternatives: IIFE.
run();
