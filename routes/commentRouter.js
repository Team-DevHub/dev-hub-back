const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");

commentRouter.post("/", commentController.writeComment); // 댓글 작성
commentRouter.delete("/", commentController.deleteComment); // 댓글 삭제
commentRouter.get("/:postId", commentController.getComments); // 댓글 조회
