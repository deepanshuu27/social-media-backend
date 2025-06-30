const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
    follow,
    unfollow,
    getMyFollowing,
    getMyFollowers,
    getMyFollowStats,
    searchUsers,
} = require("../controllers/users");

const router = express.Router();

/**
 * User-related routes
 * TODO: Implement user routes when follow functionality is added
 */
/**
 * User-related routes
 */

// Follow a user
router.post("/follow", authenticateToken, follow);

// Unfollow a user
router.delete("/unfollow", authenticateToken, unfollow);

// Get users that current user follows
router.get("/following", authenticateToken, getMyFollowing);

// Get users that follow current user
router.get("/followers", authenticateToken, getMyFollowers);

// Get follow stats for current user
router.get("/stats", authenticateToken, getMyFollowStats);

// Find users by name (can be public or optional auth)
router.post("/search", authenticateToken, searchUsers);

module.exports = router;
