const {
  createPost,
  getPostById,
  getPostsByUserId,
  getFeedPosts,
  updatePost,
  searchPosts,
  deletePost,
} = require("../models/post.js");

const logger = require("../utils/logger");

/**
 * Create a new post
 */
// const create = async (req, res) => {
//   try {
//     const { content, media_url, comments_enabled } = req.validatedData;
//     const userId = req.user.id;

//     const post = await createPost({
//       user_id: userId,
//       content,
//       media_url,
//       comments_enabled,
//     });

//     logger.verbose(`User ${userId} created post ${post.id}`);

//     res.status(201).json({
//       message: "Post created successfully",
//       post,
//     });
//   } catch (error) {
//     logger.critical("Create post error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled, scheduled_at } = req.body;
    const user_id = req.user.id;

    const is_published = scheduled_at ? false : true;

    const post = await createPost({
      user_id,
      content,
      media_url,
      comments_enabled,
      scheduled_at,
      is_published,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    logger.critical("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single post by ID
 */
const getById = async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await getPostById(parseInt(post_id));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    logger.critical("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts by a specific user
 */
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(parseInt(user_id), limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get user posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user's posts
 */
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get my posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a post
 */
const remove = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;

    const success = await deletePost(parseInt(post_id), userId);

    if (!success) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    logger.verbose(`User ${userId} deleted post ${post_id}`);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.critical("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get feed posts (from followed users)
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const feedPosts = await getFeedPosts(userId, limit, offset);

    res.json({
      posts: feedPosts,
      pagination: {
        page,
        limit,
        hasMore: feedPosts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get feed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a post
 */
const update = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;
    const { content, media_url, comments_enabled } = req.body;

    const updatedPost = await updatePost(
      parseInt(post_id),
      userId,
      { content, media_url, comments_enabled }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.json({ message: "Post updated", post: updatedPost });
  } catch (error) {
    logger.critical("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search posts by content
 */
const search = async (req, res) => {
  try {
    const query = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const results = await searchPosts(query, limit, offset);

    res.json({
      results,
      pagination: {
        page,
        limit,
        hasMore: results.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Search posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  update,
  search,
};
