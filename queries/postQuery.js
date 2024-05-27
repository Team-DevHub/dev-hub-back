exports.writePost = `INSERT INTO posts (writer_id, category_id, title, content) VALUES (?,?,?,?)`;
exports.writeLinks = `INSERT INTO links (post_id, link) VALUES ?`;
exports.getPosts = `SELECT * FROM posts WHERE writer_id = ?`;
exports.getAllPosts = `SELECT * FROM posts`;
exports.getPostsBySearch = `SELECT * FROM posts WHERE title LIKE ?`;
exports.getPostsByCategory = `SELECT * FROM posts WHERE category_id =?`;
exports.limitOffset = ` LIMIT ? OFFSET ?`;
exports.getPostWriterById = `SELECT * FROM users WHERE id = ?`;
exports.getTotalComments = `SELECT COUNT(*) as count FROM comments WHERE post_id = ?`;
exports.deletePost = `DELETE FROM posts WHERE writer_id =? AND id =?`;
exports.getPostById = `SELECT * FROM posts WHERE id = ?`;
exports.getCommentsByPostId = `SELECT * FROM comments WHERE post_id = ?`;
exports.getUserById = `SELECT * FROM users WHERE id = ?`;
exports.getLinksByPostId = `SELECT * FROM links WHERE post_id =?`;
