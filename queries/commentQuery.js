exports.writeComment = `INSERT INTO comments (content, writer_id, post_id) VALUES (?,?,?);`;
exports.deleteComment = `DELETE FROM comments WHERE id = ? AND writer_id = ?;`;
exports.getCommentsByPostId = `SELECT * FROM comments WHERE post_id = ?;`;
exports.getCommentWriterById = `SELECT id, name, level FROM users WHERE id = ?;`;
exports.getCommentWriter = `SELECT writer_id FROM comments WHERE id = ?`;
