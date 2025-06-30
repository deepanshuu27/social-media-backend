const {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
} = require("../models/comment");

const logger = require("../utils/logger");

/**
 * Create a comment on a post
 */
const create = async (req, res) => {
	try {
		const { post_id, content } = req.body;
		const user_id = req.user.id;

		const comment = await createComment({ post_id, user_id, content });

		logger.verbose(`User ${user_id} commented on post ${post_id}`);
		res.status(201).json({ message: "Comment added", comment });
	} catch (error) {
		logger.critical("Error creating comment:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Update a comment (only by owner)
 */
const update = async (req, res) => {
	try {
		const comment_id = req.params.commentId;
		const { content } = req.body;
		const user_id = req.user.id;

		const comment = await getCommentById(comment_id);
		if (!comment || comment.user_id !== user_id || comment.is_deleted) {
			return res.status(403).json({ error: "Not authorized to edit this comment" });
		}

		const updatedComment = await updateComment(comment_id, content);
		res.json({ message: "Comment updated", comment: updatedComment });
	} catch (error) {
		logger.critical("Error updating comment:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Delete a comment (only by owner)
 */
const remove = async (req, res) => {
	try {
		const comment_id = req.params.commentId;
		const user_id = req.user.id;

		const comment = await getCommentById(comment_id);
		if (!comment || comment.user_id !== user_id || comment.is_deleted) {
			return res.status(403).json({ error: "Not authorized to delete this comment" });
		}

		await deleteComment(comment_id);
		res.json({ message: "Comment deleted" });
	} catch (error) {
		logger.critical("Error deleting comment:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get comments on a post (with pagination)
 */
const list = async (req, res) => {
	try {
		const post_id = req.params.postId;
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.offset) || 0;

		const allComments = await getPostComments(post_id);
		const paginated = allComments.slice(offset, offset + limit);

		res.json({ comments: paginated, total: allComments.length });
	} catch (error) {
		logger.critical("Error fetching post comments:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	create,
	update,
	remove,
	list,
};
