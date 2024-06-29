const { StatusCodes } = require("http-status-codes");
const authService = require("../services/authService");
const URL = require("../constants/url");

const getGithubUrl = (req, res) => {
  const url = URL.github_authorize; // github 소셜로그인 인증 서버 URL

  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: "read:user user:email", // 서버에서 필요로 하는 정보 (유저정보, 이메일정보)
    allow_signup: true,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${url}?${params}`;

  res.status(StatusCodes.OK).json({ url: finalUrl });
};

const getGithubCallback = async (req, res) => {
  const { code } = req.body; // 인가코드
  const tokenUrl = URL.github_token; // 토큰 요청주소

  const data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };

  try {
    const result = await authService.getGithubCallback(tokenUrl, data);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

module.exports = {
  getGithubUrl,
  getGithubCallback,
};
