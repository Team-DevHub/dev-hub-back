const { StatusCodes } = require("http-status-codes");
const authService = require("../services/authService");
const URL = require("../constants/url");
const { google } = require("googleapis");

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

const deleteGithubAccount = async (req, res) => {
  try {
    const result = await authService.deleteGithubAccount(req.userId);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const getGoogleUrl = async (req, res) => {
  try {
    const scopes = ["email profile"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    res.status(StatusCodes.OK).json({ url });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

const getGoogleCallback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      isSuccess: false,
      message: "Authorization code is missing",
    });
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  try {
    const result = await authService.getGoogleCallback(tokens);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

const deleteGoogleAccount = async (req, res) => {
  try {
    const result = await authService.deleteGoogleAccount(req.userId);
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
  deleteGithubAccount,
  getGoogleUrl,
  getGoogleCallback,
  deleteGoogleAccount,
};
