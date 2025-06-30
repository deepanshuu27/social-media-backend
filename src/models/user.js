const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * User model for database operations
 */

// Create a new user
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name]
  );

  return result.rows[0];
};

// Find user by username
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0] || null;
};

// Find user by ID
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// Verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Search users by name (partial match with pagination)
const findUsersByName = async (nameQuery, limit = 10, offset = 0) => {
  const result = await query(
    `SELECT id, username, full_name FROM users
     WHERE full_name ILIKE $1
     ORDER BY full_name ASC
     LIMIT $2 OFFSET $3`,
    [`%${nameQuery}%`, limit, offset]
  );
  return result.rows;
};

// Get user profile with follower/following counts
const getUserProfile = async (userId) => {
  const userRes = await query(
    `SELECT id, username, email, full_name, created_at FROM users WHERE id = $1`,
    [userId]
  );

  if (!userRes.rows.length) return null;

  const [followersRes, followingRes] = await Promise.all([
    query("SELECT COUNT(*) FROM follows WHERE following_id = $1", [userId]),
    query("SELECT COUNT(*) FROM follows WHERE follower_id = $1", [userId]),
  ]);

  return {
    ...userRes.rows[0],
    followers: parseInt(followersRes.rows[0].count),
    following: parseInt(followingRes.rows[0].count),
  };
};

// Update user profile (optional fields: full_name, email)
const updateUserProfile = async (userId, { full_name, email }) => {
  const result = await query(
    `UPDATE users SET full_name = COALESCE($1, full_name),
                      email = COALESCE($2, email),
                      updated_at = NOW()
     WHERE id = $3 RETURNING id, username, email, full_name, updated_at`,
    [full_name, email, userId]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile,
};
