require("dotenv").config();
const conn = require("../database/mysql");
const { StatusCodes } = require("http-status-codes");
const commentQuery = require("../queries/commentQuery");
const CustomError = require("../utils/CustomError");

const writeComment = async (writerId, postId, content) => {
  let values = [content, writerId, postId];

  try {
    await conn.query(commentQuery.writeComment, values);

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
    const isCommentWriter = await conn.query(commentQuery.getCommentById, [
      writerId,
      commentId,
    ]);

    if (isCommentWriter.length > 0) {
      await conn.query(commentQuery.deleteComment, [commentId, writerId]);

      return {
        isSuccess: true,
        message: "댓글 삭제 성공",
      };
    } else {
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        "댓글을 삭제할 권한이 없습니다."
      );
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { writeComment, deleteComment };
