const { StatusCodes } = require("http-status-codes"); // status code module
const userService = require("../services/userService");

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

const checkEmail = (req, res) => {};
const findPw = (req, res) => {};
const resetPw = (req, res) => {};
const deleteAccount = (req, res) => {};
const getUser = (req, res) => {};
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
