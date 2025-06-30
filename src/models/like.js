const { query } = require("../utils/database");

/**
 * Like a post
 */
const likePost = async ({ user_id, post_id }) => {
	const result = await query(
		`INSERT INTO likes (user_id, post_id)
		 VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
		[user_id, post_id]
	);
	return result.rows[0];
};

/**
 * Unlike a post
 */
async function unlikePost({ user_id, post_id }) {
	await query(
		`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
		[user_id, post_id]
	);
	return { success: true };
}


/**
 * Get all likes for a post
 */
async function getPostLikes(post_id) {
	const result = await query(
		`SELECT u.id, u.username FROM likes l
		 JOIN users u ON l.user_id = u.id
		 WHERE l.post_id = $1`,
		[post_id]
	);
	return result.rows;
}

/**
 * Get all posts liked by a user
 */
async function getUserLikes(user_id) {
	const result = await query(
		`SELECT p.id, p.content, p.media_url FROM likes l
		 JOIN posts p ON l.post_id = p.id
		 WHERE l.user_id = $1`,
		[user_id]
	);
	return result.rows;
}

/**
 * Check if user has liked a post
 */
const hasUserLikedPost = async ({ user_id, post_id }) => {
	const result = await query(
		`SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
		[user_id, post_id]
	);
	return result.rowCount > 0;
};


module.exports = {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
};
