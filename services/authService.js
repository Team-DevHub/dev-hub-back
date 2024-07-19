const { default: axios } = require("axios");
const CustomError = require("../utils/CustomError");
const conn = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");
const authQuery = require("../queries/authQuery");
const userQuery = require("../queries/userQuery");
const { getHashPassword } = require("../utils/getHashPassword");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/verifyToken");
const URL = require("../constants/url");
const { StatusCodes } = require("http-status-codes");

const getGithubCallback = async (tokenUrl, data) => {
  try {
    // 토큰 받아오기
    const { data: requestToken } = await axios.post(tokenUrl, data, {
      headers: { Accept: "application/json" },
    });
    const { access_token } = requestToken;

    // 아이디
    const { data: userdata } = await axios.get(URL.github_getUser, {
      headers: { Authorization: `token ${access_token}` },
    });
    // 이메일
    const { data: emailDataArr } = await axios.get(URL.github_getEmail, {
      headers: { Authorization: `token ${access_token}` },
    });

    const userId = userdata.node_id;

    // 유저 확인
    const findResult = await conn.query(userQuery.getUserById, userId);
    const existingUser = findResult[0][0];

    // 없는 경우, 회원가입
    if (!existingUser) {
      const userName = userdata.login;
      const userEmail = emailDataArr[0].email;
      const pw = getHashPassword(uuidv4());
      const values = [
        userId,
        userName,
        userEmail,
        pw.hashPassword,
        pw.salt,
        "github",
        access_token,
      ];

      // 회원가입
      await conn.query(authQuery.githubJoin, values);
    }

    // 로그인
    const token = createAccessToken(userId);
    const refresh = createRefreshToken();

    // DB에 RT 저장
    await conn.query(userQuery.insertRefresh, [refresh, userId]);

    return {
      isSuccess: true,
      message: "로그인 성공",
      accessToken: token,
      refreshToken: refresh,
      userId,
    };
  } catch (err) {
    throw new CustomError(StatusCodes.FORBIDDEN, "소셜 로그인 실패");
  }
};

const deleteGithubAccount = async (userId) => {
  try {
    // 토큰 꺼내기
    const tokenResult = await conn.query(authQuery.getGithubToken, userId);
    const { github_token } = tokenResult[0][0];

    const response = await axios.delete(URL.github_deleteUser, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_SECRET}`
        ).toString("base64")}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      data: {
        access_token: github_token,
      },
    });

    if (response.status === 204) {
      await conn.query(userQuery.deleteUser, userId); // db에서 제거

      return {
        isSuccess: true,
        message: "회원 탈퇴 완료",
      };
    } else {
      throw new CustomError(StatusCodes.FORBIDDEN, "회원 탈퇴 실패");
    }
  } catch (err) {
    throw err;
  }
};

const getGoogleCallback = async (tokens) => {
  try {
    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token ? tokens.refresh_token : null;

    const { data: userInfo } = await axios.get(URL.google_getUser, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, email, name } = userInfo;

    const findResult = await conn.query(userQuery.getUserById, id);
    const existingUser = findResult[0][0];

    // 유저 확인
    if (!existingUser) {
      const pw = getHashPassword(uuidv4());

      const values = [
        id,
        name,
        email,
        pw.hashPassword,
        pw.salt,
        "google",
        access_token,
        refresh_token,
      ];

      await conn.query(authQuery.googleJoin, values);
    } else {
      // 기존 구글 회원인 경우
      const updateValues = [access_token, id];
      await conn.query(authQuery.updateGoogleToken, updateValues);
    }

    const token = createAccessToken(id);

    return {
      isSuccess: true,
      message: "로그인 성공",
      userId: id,
      accessToken: token,
    };
  } catch (err) {
    throw err;
  }
};

const deleteGoogleAccount = async (userId) => {
  try {
    const tokenResult = await conn.query(
      authQuery.getGoogleRefreshToken,
      userId
    );
    const { refresh_token } = tokenResult[0][0];

    const response = await axios.get(
      `${URL.google_deleteUser}${refresh_token}`
    );

    if (response.status === 200) {
      // db에서 user 삭제
      await conn.query(userQuery.deleteUser, userId);

      return {
        isSuccess: true,
        message: "구글 회원 탈퇴 완료",
      };
    } else {
      throw new CustomError(StatusCodes.FORBIDDEN, "구글 회원 탈퇴 실패");
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getGithubCallback,
  deleteGithubAccount,
  getGoogleCallback,
  deleteGoogleAccount,
};
