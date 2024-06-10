const conn = require("../database/mysql");
const {
  getCommentsByPostId,
  getCommentWriterById,
} = require("../queries/commentQuery");
const CustomError = require("./CustomError");

exports.getCommentsFromPost = async (postId) => {
  try {
    const [comments] = await conn.query(getCommentsByPostId, postId);

    // 댓글이 존재하지 않는 경우
    if (comments.length === 0) {
      throw new CustomError(400, "댓글 조회 실패");
    }

    const commentsData = [];
    for (const comment of comments) {
      const [writer] = await conn.query(
        getCommentWriterById,
        comment.writer_id
      );

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
