exports.getScrapList = `SELECT post_id FROM scraps WHERE user_id = ?`;
exports.getScrapPosts = `SELECT id as postId, title, category_id as categoryId, created_at as createdAt FROM posts WHERE id IN (?)`;
