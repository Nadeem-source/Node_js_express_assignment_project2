// mysql2/promise for DB connection. Used for MySQL with promises. If not used, no DB. Alternatives: mysql2 without promise.
const mysql = require('mysql2/promise');

// dotenv to load env vars. Used for config. If not used, hardcode. Alternatives: Hardcode.
const dotenv = require('dotenv');

// Load env. Used to populate process.env. If not used, env not loaded. Alternatives: Manual set.
dotenv.config();

// Create pool. Used for connection pooling. If not used, single connection. Alternatives: Single connection.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Mehdi1214@786',
  database: process.env.DB_NAME || 'product_crud_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: false,
});

// Export pool. Used to use in models. If not used, not available. Alternatives: Export config.
module.exports = pool;
