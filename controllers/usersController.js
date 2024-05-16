const { StatusCodes } = require("http-status-codes"); // status code module
const userService = require("../services/userService");
const { verifyAccessToken } = require("../utils/verifyToken");

// 회원가입
const join = async (req, res) => {
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
};

// 로그인
const login = async (req, res) => {
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
};

// 이메일 중복확인
const checkEmail = async (req, res) => {
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
};

// 유저 프로필 조회 API
const getUser = async (req, res) => {
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
};

// 회원 탈퇴
const deleteAccount = async (req, res) => {
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
};

const findPw = (req, res) => {};
const resetPw = (req, res) => {};
const getTopFive = (req, res) => {};

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
