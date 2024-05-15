const express = require("express"); // express module
const postRouter = express.Router();
const postController = require("../controllers/postController");

postRouter.post("/", postController.writePost); // 게시글 작성
postRouter.get("/", postController.getPosts); // 게시글 조회
postRouter.get("/:postId", postController.getPostDetail); // 게시글 상세 조회
postRouter.delete("/:postId", postController.deletePost); // 게시글 삭제

module.exports = postRouter;
