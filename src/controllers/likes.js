const {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
} = require("../models/like");

const logger = require("../utils/logger");

/**
 * Like a post
 */
const like = async (req, res) => {
	try {
		const post_id = parseInt(req.params.postId); // Ensure it's a number
		const user_id = req.user.id;

		const alreadyLiked = await hasUserLikedPost({ post_id, user_id });
		if (alreadyLiked) {
			return res.status(400).json({ error: "Post already liked" });
		}

		const like = await likePost({ post_id, user_id });

		logger.verbose(`User ${user_id} liked post ${post_id}`);
		res.status(201).json({ message: "Post liked", like });
	}
	catch (error) {
		console.error("❌ Error stack trace:", error); // Add this
		logger.critical("Error liking post:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


/**
 * Unlike a post
 */
const unlike = async (req, res) => {
	try {
		const post_id = req.params.postId;
		const user_id = req.user.id;

		await unlikePost({ post_id, user_id });

		logger.verbose(`User ${user_id} unliked post ${post_id}`);
		res.json({ message: "Post unliked" });
	} catch (error) {
		logger.critical("Error unliking post:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get users who liked a post
 */
const getPostLikesController = async (req, res) => {
	try {
		const post_id = req.params.postId;
		const likes = await getPostLikes(post_id);
		res.json({ likes });
	} catch (error) {
		logger.critical("Error getting post likes:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get posts liked by a user
 */
const getUserLikesController = async (req, res) => {
	try {
		const user_id = req.params.userId;
		const likes = await getUserLikes(user_id);
		res.json({ likedPosts: likes });
	} catch (error) {
		logger.critical("Error getting user likes:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	likePost: like,
	unlikePost: unlike,
	getPostLikes: getPostLikesController,
	getUserLikes: getUserLikesController,
};

