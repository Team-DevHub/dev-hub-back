const { StatusCodes } = require("http-status-codes");
const postService = require("../services/postService");
const { verifyAccessToken } = require("../utils/verifyToken");
const valid = require("../utils/validation");

// 게시글 작성
const writePost = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { categoryId, title, content, links } = req.body;

    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const writerId = verifyResult.userId;
        const result = await postService.writePost(
          writerId,
          categoryId,
          title,
          content,
          links
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

// 게시글 조회
const getPosts = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const { userId } = verifyResult;
        const { limit, page, myPage, search, categoryId } = req.query;

        const result = await postService.getPosts(
          userId,
          parseInt(limit),
          parseInt(page),
          myPage === "true",
          search,
          categoryId
        );

        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      res.status(err.statusCode || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

// 게시글 상세 조회
const getPostDetail = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { postId } = req.params;

    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const result = await postService.getPostDetail(postId);
        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      res.status(err.statusCode || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

// 게시글 삭제
const deletePost = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { postId } = req.params;

    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const result = await postService.deletePost(
          verifyResult.userId,
          postId
        );
        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      res.status(err.statusCodes || 400).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

module.exports = {
  writePost,
  getPosts,
  getPostDetail,
  deletePost,
};
