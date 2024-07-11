exports.getScrapList = `SELECT post_id FROM scraps WHERE user_id = ?`;
exports.getScrapPosts = `SELECT id as postId, title, category_id as categoryId, created_at as createdAt FROM posts WHERE id IN (?)`;
exports.scrap = `INSERT INTO scraps (post_id, user_id) VALUES (?, ?)`;
exports.getScrapCount = `SELECT COUNT(*) as count FROM scraps WHERE post_id = ? AND user_id = ?`;
exports.deleteScrap = `DELETE FROM scraps WHERE user_id = ? AND post_id = ?`;
