const { StatusCodes } = require("http-status-codes"); // status code module
const commentService = require("../services/commentService");
const { verifyAccessToken } = require("../utils/verifyToken");
const valid = require("../utils/validation");
const { getCommentsFromPost } = require("../utils/getComments");

// 댓글 작성
const writeComment = [
  valid.commentPostIdValidation(),
  valid.contentValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { postId, content } = req.body;

    try {
      const writerId = req.userId;
      const result = await commentService.writeComment(
        writerId,
        postId,
        content
      );

      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      res.status(err.StatusCodes || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

// 댓글 삭제
const deleteComment = [
  valid.commentIdValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { commentId } = req.body;

    try {
      const writerId = req.userId;
      const result = await commentService.deleteComment(writerId, commentId);

      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.StatusCodes || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

// 댓글 조회
const getComments = [
  valid.postIdValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { postId } = req.params;

    try {
      const result = await getCommentsFromPost(postId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

module.exports = {
  writeComment,
  deleteComment,
  getComments,
};
