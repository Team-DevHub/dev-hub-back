const { StatusCodes } = require("http-status-codes");

const getGithubUrl = (req, res) => {
  const url = "https://github.com/login/oauth/authorize"; // github 소셜로그인 인증 서버 URL

  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: "read:user user:email", // 서버에서 필요로 하는 정보 (유저정보, 이메일정보)
    allow_signup: true,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${url}?${params}`;

  res.status(StatusCodes.OK).json({ url: finalUrl });
};

module.exports = {
  getGithubUrl,
};
