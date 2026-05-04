const pool = require('../config/db');

async function createProduct(data, connection) {
  const query = `INSERT INTO products (name, price, quantity, manufactured_date, image_url)
    VALUES (?, ?, ?, ?, ?)`;
  const params = [data.name, data.price, data.quantity, data.manufactured_date, data.image_url || null];
  const [result] = await (connection || pool).execute(query, params);
  return result.insertId;
}

async function getProductById(id) {
  const [rows] = await pool.execute('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [id]);
  return rows[0];
}

async function updateProduct(id, data, connection) {
  const query = `UPDATE products SET name = ?, price = ?, quantity = ?, manufactured_date = ?, image_url = ?
    WHERE id = ? AND is_deleted = 0`;
  const params = [data.name, data.price, data.quantity, data.manufactured_date, data.image_url || null, id];
  const [result] = await (connection || pool).execute(query, params);
  return result.affectedRows;
}

async function softDeleteProduct(id, connection) {
  const [result] = await (connection || pool).execute(
    'UPDATE products SET is_deleted = 1 WHERE id = ? AND is_deleted = 0',
    [id]
  );
  return result.affectedRows;
}

async function findProducts(options) {
  const baseQuery = [];
  const params = [];
  baseQuery.push('FROM products WHERE is_deleted = 0');

  if (options.search) {
    baseQuery.push('AND name LIKE ?');
    params.push(`%${options.search}%`);
  }
  if (options.minPrice != null) {
    baseQuery.push('AND price >= ?');
    params.push(options.minPrice);
  }
  if (options.maxPrice != null) {
    baseQuery.push('AND price <= ?');
    params.push(options.maxPrice);
  }
  if (options.minQuantity != null) {
    baseQuery.push('AND quantity >= ?');
    params.push(options.minQuantity);
  }
  if (options.maxQuantity != null) {
    baseQuery.push('AND quantity <= ?');
    params.push(options.maxQuantity);
  }
  if (options.manufacturedDate) {
    baseQuery.push('AND manufactured_date = ?');
    params.push(options.manufacturedDate);
  }

  const countQuery = 'SELECT COUNT(*) as total ' + baseQuery.join(' ');
  const [countRows] = await pool.execute(countQuery, params);
  const total = countRows[0].total;

  const limit = Number(options.limit) || 10;
  const page = Number(options.page) || 1;
  const offset = (page - 1) * limit;

  const selectQuery = 'SELECT * ' + baseQuery.join(' ') + ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const [rows] = await pool.execute(selectQuery, [...params, limit, offset]);

  return { rows, total, page, limit };
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  softDeleteProduct,
  findProducts,
};
