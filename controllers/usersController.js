const { StatusCodes } = require("http-status-codes");
const userService = require("../services/userService");
const valid = require("../utils/validation");
const { getUserInfo } = require("../utils/getUserInfo");
const conn = require("../database/mysql");
const userQuery = require("../queries/userQuery");
const authService = require("../services/authService");

/* ----- 회원가입 ----- */
const join = [
  valid.emailValidation(),
  valid.nameValidation(),
  valid.passwordValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { nickname, email, password } = req.body;

    try {
      const result = await userService.join(nickname, email, password);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 로그인 ----- */
const login = [
  valid.emailValidation(),
  valid.passwordValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await userService.login(email, password);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 이메일 중복 확인 ----- */
const checkEmail = [
  valid.emailValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { email } = req.body;

    try {
      const result = await userService.checkEmail(email);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 닉네임 중복 확인 ----- */
const checkNickname = [
  valid.nameValidation(),
  valid.validationCheck,
  async (req, res) => {
    const { nickname } = req.body;

    try {
      const result = await userService.checkNickname(nickname);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 유저 프로필 조회 ----- */
const getUser = [
  valid.validationCheck,
  async (req, res) => {
    try {
      const result = await userService.getUser(req.userId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 회원 탈퇴 ----- */
const deleteAccount = [
  valid.validationCheck,
  async (req, res) => {
    try {
      const userId = req.userId;

      const typeResult = await conn.query(userQuery.getLoginType, userId);
      const { login_type } = typeResult[0][0];

      if (login_type === "github") {
        const result = await authService.deleteGithubAccount(userId);
        res.status(StatusCodes.OK).json(result);
      } else if (login_type === "google") {
        const result = await authService.deleteGoogleAccount(userId);
        res.status(StatusCodes.OK).json(result);
      } else {
        const result = await userService.deleteAccount(userId);
        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 비밀번호 찾기 ----- */
const findPw = [
  valid.nameValidation(),
  valid.emailValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const { nickname, email } = req.body;

      const result = await userService.findPw(nickname, email);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- 비밀번호 재설정 ----- */
const resetPw = [
  valid.emailValidation(),
  valid.passwordValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await userService.resetPw(email, password);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

/* ----- Top5 수강생 조회 ----- */
const getTopFive = [
  async (req, res) => {
    try {
      const result = await getUserInfo();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

module.exports = {
  join,
  login,
  checkEmail,
  findPw,
  resetPw,
  deleteAccount,
  getUser,
  getTopFive,
  checkNickname,
};
