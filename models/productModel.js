// pool is the DB pool. Used for queries. If not used, no DB. Alternatives: Direct connection.
const pool = require('../config/db');

// Async function to create product. Used for insertion. If not used, no create. Alternatives: Bulk insert.
async function createProduct(data, connection) {
  // Query string for INSERT. Used to define SQL. If not used, no query. Alternatives: Dynamic query.
  const query = `INSERT INTO products (name, price, quantity, manufactured_date, image_url)
    VALUES (?, ?, ?, ?, ?)`;
  // Params array for parameterized query. Used to prevent SQL injection. If not used, vulnerable. Alternatives: Concatenate, but bad.
  const params = [data.name, data.price, data.quantity, data.manufactured_date, data.image_url || null];
  // Execute query with connection or pool. Used to run SQL. If not used, no execution. Alternatives: pool.execute directly.
  const [result] = await (connection || pool).execute(query, params);
  // Return insert ID. Used to get new ID. If not used, no ID. Alternatives: Return result.
  return result.insertId;
}

// Async function to get product by ID. Used for fetching single. If not used, no get by ID. Alternatives: Get all.
async function getProductById(id) {
  // Execute SELECT with soft delete check. Used to get active product. If not used, deleted shown. Alternatives: Hard delete.
  const [rows] = await pool.execute('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [id]);
  return rows[0];
}

// Async function to update product. Used for modification. If not used, no update. Alternatives: Replace.
async function updateProduct(id, data, connection) {
  const query = `UPDATE products SET name = ?, price = ?, quantity = ?, manufactured_date = ?, image_url = ?
    WHERE id = ? AND is_deleted = 0`;
  const params = [data.name, data.price, data.quantity, data.manufactured_date, data.image_url || null, id];
  const [result] = await (connection || pool).execute(query, params);
  return result.affectedRows;
}

// Async function for soft delete. Used to mark deleted. If not used, hard delete. Alternatives: Hard delete.
async function softDeleteProduct(id, connection) {
  const [result] = await (connection || pool).execute(
    'UPDATE products SET is_deleted = 1 WHERE id = ? AND is_deleted = 0',
    [id]
  );
  return result.affectedRows;
}

// Async function to find products with filters. Used for listing. If not used, no list. Alternatives: Simple select.
async function findProducts(options) {
  // Get connection for transaction-like. Used for consistency. If not used, pool directly. Alternatives: Pool.
  const connection = await pool.getConnection();
  try {
    // Calculate limit and page. Used for pagination. If not used, no pagination. Alternatives: No limit.
    const limit = Math.max(1, Number(options.limit) || 10);
    const page = Math.max(1, Number(options.page) || 1);
    const offset = (page - 1) * limit;

    // Count total. Used for pagination info. If not used, no total. Alternatives: Count in same query.
    const [countRows] = await connection.query('SELECT COUNT(*) as total FROM products WHERE is_deleted = 0');
    const total = countRows[0].total;

    // Select with limit offset. Used to get paginated results. If not used, all rows. Alternatives: Cursor.
    const [rows] = await connection.query(`SELECT id, name, price, quantity, manufactured_date, image_url, is_deleted, created_at FROM products WHERE is_deleted = 0 LIMIT ${limit} OFFSET ${offset}`);

    // Return object with data. Used to include pagination. If not used, just rows. Alternatives: Return array.
    return { rows, total, page, limit };
  // Catch errors. Used to log and throw. If not used, silent fail. Alternatives: No catch.
  } catch (err) {
    console.error('findProducts error:', err.message);
    throw err;
  // Finally release. Used to free connection. If not used, leak. Alternatives: No finally.
  } finally {
    connection.release();
  }
}

// Export functions. Used to export. If not used, not available. Alternatives: Named exports.
module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  softDeleteProduct,
  findProducts,
};
