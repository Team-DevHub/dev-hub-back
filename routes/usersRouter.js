const express = require("express"); // express module
const userRouter = express.Router();
const userController = require("../controllers/usersController");
const tokenHandler = require("../utils/tokenHandler");

userRouter.post("/join", userController.join); // 회원가입
userRouter.post("/login", userController.login); // 로그인
userRouter.post("/check-nickname", userController.checkNickname); // 닉네임 중복 확인
userRouter.post("/check-email", userController.checkEmail); // 이메일 중복 확인
userRouter.post("/password", userController.findPw); // 비밀번호 찾기
userRouter.put("/password", userController.resetPw); // 비밀번호 재설정
userRouter.delete("/", tokenHandler, userController.deleteAccount); // 회원탈퇴
userRouter.get("/", tokenHandler, userController.getUser); // 유저 조회
userRouter.get("/top", userController.getTopFive); // top 5 유저 조회

module.exports = userRouter;
