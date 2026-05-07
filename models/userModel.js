// pool is the database connection pool. Used to execute queries. If not used, no DB access. Alternatives: Direct connection.
const pool = require('../config/db');

// Async function to find user by email. Used for login and registration checks. If not used, can't find users by email. Alternatives: Find by id only.
async function findUserByEmail(email) {
  // Execute SELECT query with parameterized query. Used to get user data safely. If not used, no data retrieved. Alternatives: Raw query, but insecure.
  const [rows] = await pool.execute('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
  // Return first row. Used to get single user. If not used, array returned. Alternatives: Return all rows.
  return rows[0];
}

// Async function to find user by id. Used for token verification. If not used, can't get user by id. Alternatives: Find by email only.
async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return rows[0];
}

// Async function to create user. Used for registration. If not used, can't create users. Alternatives: Update existing.
async function createUser(name, email, password) {
  // Execute INSERT query. Used to add user to DB. If not used, no insertion. Alternatives: Stored procedure.
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  // Return new user object. Used to get created user info. If not used, no return. Alternatives: Return result only.
  return { id: result.insertId, name, email };
}

// Export functions. Used to make available. If not used, not accessible. Alternatives: Export as object.
module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
