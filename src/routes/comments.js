const express = require("express");
const { authenticateToken, optionalAuth } = require("../middleware/auth");
const {
    create,
    update,
    remove,
    list,
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// Create a comment on a post (Requires auth)
router.post("/", authenticateToken, create);

// Update a comment (Requires auth)
router.put("/:commentId", authenticateToken, update);

// Delete a comment (Requires auth)
router.delete("/:commentId", authenticateToken, remove);

// Get comments for a post (Optional auth)
router.get("/post/:postId", optionalAuth, list);

module.exports = router;
