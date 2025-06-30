const { query } = require("../utils/database");

/**
 * Create a new comment
 */
async function createComment({ user_id, post_id, content }) {
	const result = await query(
		`INSERT INTO comments (user_id, post_id, content)
		 VALUES ($1, $2, $3) RETURNING *`,
		[user_id, post_id, content]
	);
	return result.rows[0];
}

/**
 * Update a comment by ID
 */
async function updateComment(comment_id, content) {
	const result = await query(
		`UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP 
		 WHERE id = $2 RETURNING *`,
		[content, comment_id]
	);
	return result.rows[0];
}

/**
 * Delete a comment by ID
 */
async function deleteComment(comment_id) {
	await query(
		`DELETE FROM comments WHERE id = $1`,
		[comment_id]
	);
	return { success: true };
}

/**
 * Get all comments for a post
 */
async function getPostComments(post_id) {
	const result = await query(
		`SELECT c.*, u.username FROM comments c
		 JOIN users u ON c.user_id = u.id
		 WHERE c.post_id = $1
		 ORDER BY c.created_at ASC`,
		[post_id]
	);
	return result.rows;
}

/**
 * Get a single comment by ID
 */
async function getCommentById(comment_id) {
	const result = await query(
		`SELECT * FROM comments WHERE id = $1`,
		[comment_id]
	);
	return result.rows[0];
}

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
};
