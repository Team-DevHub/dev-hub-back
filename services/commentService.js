require("dotenv").config();
const conn = require("../database/mysql");
const { StatusCodes } = require("http-status-codes");
const commentQuery = require("../queries/commentQuery");
const CustomError = require("../utils/CustomError");
const { updatePointsAndLevel } = require("../utils/updateLevel");

const writeComment = async (writerId, postId, content) => {
  let values = [content, writerId, postId];

  try {
    await conn.query(commentQuery.writeComment, values);

    await updatePointsAndLevel(writerId, 2);

    return {
      isSuccess: true,
      message: "댓글 작성 성공",
    };
  } catch (err) {
    throw err;
  }
};

const deleteComment = async (writerId, commentId) => {
  try {
    // 댓글 작성자 조회
    const commentWriterResult = await conn.query(
      commentQuery.getCommentWriter,
      commentId
    );
    const commentWriterId = commentWriterResult[0][0].writer_id;

    if (writerId !== commentWriterId) {
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        "댓글을 삭제할 권한이 없습니다."
      );
    }

    await conn.query(commentQuery.deleteComment, [commentId, writerId]);

    await updatePointsAndLevel(writerId, -2);

    return {
      isSuccess: true,
      message: "댓글 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { writeComment, deleteComment };
