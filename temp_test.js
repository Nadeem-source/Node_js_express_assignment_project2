const pool = require('./config/db');

async function test() {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE is_deleted = 0');
    console.log('rows:', rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

test();
