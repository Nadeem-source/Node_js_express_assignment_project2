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
  const connection = await pool.getConnection();
  try {
    const limit = Math.max(1, Number(options.limit) || 10);
    const page = Math.max(1, Number(options.page) || 1);
    const offset = (page - 1) * limit;

    const [countRows] = await connection.query('SELECT COUNT(*) as total FROM products WHERE is_deleted = 0');
    const total = countRows[0].total;

    const [rows] = await connection.query(`SELECT id, name, quantity, manufactured_date, image_url, is_deleted, created_at FROM products WHERE is_deleted = 0 LIMIT ${limit} OFFSET ${offset}`);

    return { rows, total, page, limit };
  } catch (err) {
    console.error('findProducts error:', err.message);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  softDeleteProduct,
  findProducts,
};
