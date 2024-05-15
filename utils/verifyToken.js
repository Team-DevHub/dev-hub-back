require("dotenv").config();
const jwt = require("jsonwebtoken");
const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

/* ----- accress token 발행 ----- */
function createAccessToken(userId) {
  const accessToken = jwt.sign({ userId: userId }, process.env.JWT_KEY, {
    expiresIn: "14d",
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

module.exports = { createAccessToken, verifyAccessToken };
