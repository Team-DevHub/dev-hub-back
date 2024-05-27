const { StatusCodes } = require("http-status-codes"); // status code module
const commentService = require("../services/commentService");
const { verifyAccessToken } = require("../utils/verifyToken");
const valid = require("../utils/validation");

// 댓글 작성
const writeComment = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { postId, content } = req.body;

    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const writerId = verifyResult.userId;
        const result = await commentService.writeComment(
          writerId,
          postId,
          content
        );

        res.status(StatusCodes.CREATED).json(result);
      }
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
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { commentId } = req.body;

    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const writerId = verifyResult.userId;
        const result = await commentService.deleteComment(writerId, commentId);

        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      res.status(err.StatusCodes || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

// 댓글 조회
const getComments = (req, res) => {};

module.exports = {
  writeComment,
  deleteComment,
  getComments,
};
