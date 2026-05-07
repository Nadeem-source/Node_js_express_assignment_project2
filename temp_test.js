// pool from config. Used to test DB connection. If not used, no test. Alternatives: Direct connection.
const pool = require('./config/db');

// Async test function. Used to run test query. If not used, no test. Alternatives: Sync.
async function test() {
  // Try block for query. Used to handle errors. If not used, unhandled. Alternatives: No try.
  try {
    // Query products. Used to test select. If not used, no data. Alternatives: Other query.
    const [rows] = await pool.query('SELECT * FROM products WHERE is_deleted = 0');
    // Log rows. Used to see results. If not used, no output. Alternatives: Return.
    console.log('rows:', rows);
  // Catch errors. Used to log. If not used, silent. Alternatives: Throw.
  } catch (err) {
    console.error(err);
  // Finally to end pool. Used to close. If not used, leak. Alternatives: No finally.
  } finally {
    await pool.end();
  }
}

// Call test. Used to execute. If not used, nothing. Alternatives: IIFE.
test();
