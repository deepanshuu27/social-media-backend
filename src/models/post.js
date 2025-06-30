const { query } = require("../utils/database");

/**
 * Post model for managing user posts
 */

// Create a new post
// const createPost = async ({ user_id, content, media_url }) => {
//   const result = await query(
//     `INSERT INTO posts (user_id, content, media_url)
//      VALUES ($1, $2, $3)
//      RETURNING *`,
//     [user_id, content, media_url]
//   );
//   return result.rows[0];
// };


const createPost = async ({ user_id, content, media_url, scheduled_at }) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, scheduled_at, is_published)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, content, media_url, scheduled_at, scheduled_at ? false : true]
  );
  return result.rows[0];
};


// Get a single post by ID
const getPostById = async (postId) => {
  const result = await query(`SELECT * FROM posts WHERE id = $1`, [postId]);
  return result.rows[0];
};

// Get all posts by a user
const getPostsByUserId = async (userId) => {
  const result = await query(
    `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Delete a post
const deletePost = async (postId, userId) => {
  const result = await query(
    `DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *`,
    [postId, userId]
  );
  return result.rows[0];
};

// Get feed posts from followed users
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id IN (
       SELECT following_id FROM follows WHERE follower_id = $1
     )
     AND p.is_deleted = FALSE
     AND p.is_published = TRUE
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};


// Update a post's content
const updatePost = async (postId, userId, { content, media_url, comments_enabled }) => {
  const result = await query(
    `UPDATE posts
     SET content = $1,
         media_url = $2,
         comments_enabled = $3,
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [content, media_url, comments_enabled, postId, userId]
  );
  return result.rows[0] || null;
};

// Search posts by keyword
const searchPosts = async (keyword, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE '%' || $1 || '%'
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [keyword, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};
