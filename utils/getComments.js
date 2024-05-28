const conn = require("../database/mysql");
const {
  getCommentsByPostId,
  getCommentWriterById,
} = require("../queries/commentQuery");

exports.getCommentsFromPost = async (postId) => {
  try {
    const [comments] = await conn.query(getCommentsByPostId, postId);

    const commentsData = [];
    for (const comment of comments) {
      const [writer] = await conn.query(
        getCommentWriterById,
        comment.writer_id
      );

      console.log(writer);
      const { id, name, level } = writer[0];

      commentsData.push({
        commentId: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        writer: {
          userId: id,
          nickname: name,
          level: level,
        },
      });
    }

    return {
      isSuccess: true,
      message: "댓글 조회 성공",
      result: commentsData,
    };
  } catch (err) {
    throw err;
  }
};
