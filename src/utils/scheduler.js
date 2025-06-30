const { query } = require("./database");
const logger = require("./logger");

async function publishScheduledPosts() {
    try {
        const result = await query(
            `UPDATE posts 
			 SET is_published = TRUE 
			 WHERE is_published = FALSE 
			 AND scheduled_at IS NOT NULL 
			 AND scheduled_at <= CURRENT_TIMESTAMP 
			 RETURNING id, content`
        );

        if (result.rows.length > 0) {
            logger.verbose(`Published ${result.rows.length} scheduled post(s)`);
        }
    } catch (error) {
        logger.critical("Error publishing scheduled posts:", error);
    }
}

module.exports = { publishScheduledPosts };

