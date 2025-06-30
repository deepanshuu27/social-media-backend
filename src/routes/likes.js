const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
    likePost,
    unlikePost,
    getPostLikes,
    getUserLikes,
} = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 */

// Like a post (Requires auth)
router.post("/:postId", authenticateToken, likePost); // ✅ Fix: added :postId

// Unlike a post (Requires auth)
router.delete("/:postId", authenticateToken, unlikePost);

// Get likes for a post
router.get("/post/:postId", getPostLikes);

// Get posts liked by a user
router.get("/user/:userId", getUserLikes);

module.exports = router;
