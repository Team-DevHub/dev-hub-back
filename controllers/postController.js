const { StatusCodes } = require("http-status-codes");
const postService = require("../services/postService");
const { verifyAccessToken } = require("../utils/verifyToken");
const valid = require("../utils/validation");
const postQuery = require("../queries/postQuery");

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
  async (req, res) => {
    try {
      const { limit, page, myPage, search, categoryId } = req.query;
      let userId = null;

      // 마이페이지인 경우
      if (myPage === "true") {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (token) {
          const verifyResult = verifyAccessToken(token);

          if (verifyResult) {
            userId = verifyResult.userId;
          }
        }
      }

      const offset = (page - 1) * limit;
      let query = "";
      let params = [];

      if (myPage === "true" && userId) {
        query = postQuery.getPosts;
        params.push(userId);
      } else {
        query = postQuery.getAllPosts;
      }

      // 게시글 검색인 경우
      if (search) {
        if (query.includes("WHERE")) {
          query += " AND title LIKE ?";
        } else {
          query += " WHERE title LIKE ?";
        }
        params.push(`%${search}%`);
      }

      // 카테고리별 조회인 경우
      if (categoryId) {
        if (query.includes("WHERE")) {
          query += " AND category_id = ?";
        } else {
          query += " WHERE category_id = ?";
        }
        params.push(parseInt(categoryId));
      }

      // 페이지네이션 적용
      query += postQuery.limitOffset;
      params.push(parseInt(limit), offset);

      const result = await postService.getPosts(query, params);

      res.status(StatusCodes.OK).json(result);
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
  async (req, res) => {
    const { postId } = req.params;

    try {
      const result = await postService.getPostDetail(postId);
      res.status(StatusCodes.OK).json(result);
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
