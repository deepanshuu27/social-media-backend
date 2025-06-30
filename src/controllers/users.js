const {
	followUser,
	unfollowUser,
	getFollowing,
	getFollowers,
	getFollowCounts,
} = require("../models/follow");
const logger = require("../utils/logger");
const { query: dbQuery } = require("../utils/database");

/**
 * Follow a user
 */
const follow = async (req, res) => {
	try {
		const followerId = req.user.id;
		const { followeeId } = req.body;

		if (followerId === followeeId) {
			return res.status(400).json({ error: "You cannot follow yourself" });
		}

		await followUser(followerId, followeeId);
		logger.verbose(`User ${followerId} followed user ${followeeId}`);

		res.status(200).json({ message: "Followed successfully" });
	} catch (error) {
		logger.critical("Follow error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
	try {
		const followerId = req.user.id;
		const { followeeId } = req.body;

		await unfollowUser(followerId, followeeId);
		logger.verbose(`User ${followerId} unfollowed user ${followeeId}`);

		res.status(200).json({ message: "Unfollowed successfully" });
	} catch (error) {
		logger.critical("Unfollow error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get users the current user is following
 */
const getMyFollowing = async (req, res) => {
	try {
		const userId = req.user.id;
		const following = await getFollowing(userId);

		res.status(200).json({ following });
	} catch (error) {
		logger.critical("Get following error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get users following the current user
 */
const getMyFollowers = async (req, res) => {
	try {
		const userId = req.user.id;
		const followers = await getFollowers(userId);

		res.status(200).json({ followers });
	} catch (error) {
		logger.critical("Get followers error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get follower/following counts
 */
const getMyFollowStats = async (req, res) => {
	try {
		const userId = req.user.id;
		const counts = await getFollowCounts(userId);

		res.status(200).json({ counts });
	} catch (error) {
		logger.critical("Get follow counts error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const searchUsers = async (req, res) => {
	try {
		const { query } = req.body;

		if (!query || query.trim() === "") {
			return res.status(400).json({ error: "Search query is required" });
		}

		const result = await dbQuery(
			`SELECT id, username, full_name FROM users 
			 WHERE is_deleted = FALSE AND 
			 (username ILIKE $1 OR full_name ILIKE $1)
			 ORDER BY username ASC
			 LIMIT 20`,
			[`%${query}%`]
		);

		res.status(200).json({ results: result.rows });
	} catch (error) {
		logger.critical("Search users error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


module.exports = {
	follow,
	unfollow,
	getMyFollowing,
	getMyFollowers,
	getMyFollowStats,
	searchUsers
};
