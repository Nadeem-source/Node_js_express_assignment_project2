const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function createUser(name, email, password) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return { id: result.insertId, name, email };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
