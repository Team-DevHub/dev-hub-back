require("dotenv").config();
const jwt = require("jsonwebtoken");
const conn = require("../database/mysql");
const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");
const userQuery = require("../queries/userQuery");

/* ----- accress token 발행 ----- */
function createAccessToken(userId) {
  const accessToken = jwt.sign({ userId: userId }, process.env.JWT_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
  return accessToken;
}

/* ----- refresh token 발행 ----- */
function createRefreshToken() {
  const accessToken = jwt.sign({}, process.env.JWT_KEY, {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
  return accessToken;
}

/* ----- accress token 검증 ----- */
function verifyAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, process.env.JWT_KEY);
    const decodedData = jwt.decode(accessToken);
    return decodedData;
  } catch (err) {
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      "access token이 유효하지 않습니다."
    );
  }
}

/* ----- refresh token 검증 및 access token 재발급 ----- */
async function verifyRefreshToken(refreshToken, userId) {
  try {
    // token 가져오기
    const { refresh_token: originRefresh } = await conn
      .query(userQuery.getRefresh, userId)
      .then((res) => res[0][0]);

    // 1. 일치하지 않는 경우
    if (originRefresh !== refreshToken) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "refresh token이 일치하지 않습니다."
      );
    }

    // 2. 일치하는 경우
    try {
      // 2-1. refresh token이 만료되지 않은 경우 -> 재발급
      jwt.verify(refreshToken, process.env.JWT_KEY); // refresh 토큰 만료 검증
      const newAccess = createAccessToken(userId); // 새로운 토큰 발행

      return {
        isSuccess: true,
        accessToken: newAccess,
        message: "access token 재발급 완료",
      };
    } catch (err) {
      // 2-2. refresh token이 만료된 경우 -> 재로그인 요청
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        "로그인 세션이 만료되었습니다."
      );
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
