const { StatusCodes } = require("http-status-codes"); // status code module
const userService = require("../services/userService");
const { verifyAccessToken } = require("../utils/verifyToken");
const valid = require("../utils/validation");
const { getUserInfo } = require("../utils/getUserInfo");

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

/* ----- 유저 프로필 조회 ----- */
const getUser = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const result = await userService.getUser(verifyResult.userId);
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

/* ----- 회원 탈퇴 ----- */
const deleteAccount = [
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const result = await userService.deleteAccount(verifyResult.userId);
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
  valid.tokenValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const verifyResult = verifyAccessToken(token);

      if (verifyResult) {
        const result = await getUserInfo();
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

module.exports = {
  join,
  login,
  checkEmail,
  findPw,
  resetPw,
  deleteAccount,
  getUser,
  getTopFive,
};
