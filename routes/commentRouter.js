const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const tokenHandler = require("../utils/tokenHandler");

commentRouter.post("/", tokenHandler, commentController.writeComment); // 댓글 작성
commentRouter.delete("/", tokenHandler, commentController.deleteComment); // 댓글 삭제
commentRouter.get("/:postId", commentController.getComments); // 댓글 조회

module.exports = commentRouter;
