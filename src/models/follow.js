const { query } = require("../utils/database");

/**
 * Follow a user
 */
async function followUser(follower_id, following_id) {
	const result = await query(
		`INSERT INTO follows (follower_id, following_id)
		 VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
		[follower_id, following_id]
	);
	return result.rows[0];
}

/**
 * Unfollow a user
 */
async function unfollowUser(follower_id, following_id) {
	await query(
		`DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
		[follower_id, following_id]
	);
	return { success: true };
}

/**
 * Get list of users that the given user is following
 */
async function getFollowing(user_id) {
	const result = await query(
		`SELECT u.id, u.username, u.full_name FROM follows f
		 JOIN users u ON f.following_id = u.id
		 WHERE f.follower_id = $1`,
		[user_id]
	);
	return result.rows;
}

/**
 * Get list of followers for a user
 */
async function getFollowers(user_id) {
	const result = await query(
		`SELECT u.id, u.username, u.full_name FROM follows f
		 JOIN users u ON f.follower_id = u.id
		 WHERE f.following_id = $1`,
		[user_id]
	);
	return result.rows;
}

/**
 * Get count of followers and following for a user
 */
async function getFollowCounts(user_id) {
	const result = await query(
		`SELECT 
			(SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following_count,
			(SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers_count`,
		[user_id]
	);
	return result.rows[0];
}

module.exports = {
	followUser,
	unfollowUser,
	getFollowing,
	getFollowers,
	getFollowCounts,
};
