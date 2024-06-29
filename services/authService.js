const { default: axios } = require("axios");
const CustomError = require("../utils/CustomError");
const conn = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");
const userQuery = require("../queries/userQuery");
const { getHashPassword } = require("../utils/getHashPassword");
const { createAccessToken } = require("../utils/verifyToken");
const URL = require("../constants/url");

const getGithubCallback = async (tokenUrl, data) => {
  try {
    // 토큰 받아오기
    const { data: requestToken } = await axios.post(tokenUrl, data, {
      headers: { Accept: "application/json" },
    });
    const { access_token } = requestToken;

    // 아이디
    const { data: userdata } = await axios.get(`${URL.github_api}/user`, {
      headers: { Authorization: `token ${access_token}` },
    });
    // 이메일
    const { data: emailDataArr } = await axios.get(
      `${URL.github_api}/user/emails`,
      {
        headers: { Authorization: `token ${access_token}` },
      }
    );

    const userId = userdata.node_id;

    // 유저 확인
    const findResult = await conn.query(userQuery.getUserById, userId);
    const existingUser = findResult[0][0];

    // 없는 경우, 회원가입
    if (!existingUser) {
      const userName = userdata.login;
      const userEmail = emailDataArr[0].email;
      const pw = getHashPassword(uuidv4());
      const values = [userId, userName, userEmail, pw.hashPassword, pw.salt];

      // 회원가입
      await conn.query(userQuery.join, values);
    }

    // 로그인
    const token = createAccessToken(userId);

    return {
      isSuccess: true,
      message: "로그인 성공",
      accessToken: token,
      userId,
    };
  } catch (err) {
    throw new CustomError(StatusCodes.FORBIDDEN, "소셜 로그인 실패");
  }
};

module.exports = {
  getGithubCallback,
};
