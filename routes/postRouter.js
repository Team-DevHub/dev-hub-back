const express = require("express"); // express module
const postRouter = express.Router();
const postController = require("../controllers/postController");
const tokenHandler = require("../utils/tokenHandler");
const valid = require("../utils/validation");

postRouter.post("/", tokenHandler, postController.writePost); // 게시글 작성
postRouter.get("/", postController.getPosts); // 게시글 조회
postRouter.get("/:postId", postController.getPostDetail); // 게시글 상세 조회
postRouter.delete("/:postId", tokenHandler, postController.deletePost); // 게시글 삭제
postRouter.put("/:postId", tokenHandler, postController.updatePost); // 게시글 수정

postRouter.post(
  "/:postId/scrap",
  tokenHandler,
  valid.postIdValidation(),
  valid.validationCheck,
  postController.scrap
);
postRouter.delete(
  "/:postId/scrap",
  tokenHandler,
  valid.postIdValidation(),
  valid.validationCheck,
  postController.deleteScrap
);

module.exports = postRouter;
