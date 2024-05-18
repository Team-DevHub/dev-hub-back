exports.writeComment = `INSERT INTO comments (content, writer_id, post_id) VALUES (?,?,?);`;
exports.deleteComment = `DELETE FROM comments WHERE id = ? AND writer_id = ?;`;
exports.getCommentById = `SELECT * FROM comments WHERE writer_id = ? AND id = ?;`;
