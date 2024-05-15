require("dotenv").config();
const conn = require("../database/mysql");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userQuery = require("../queries/userQuery");
const CustomError = require("../utils/CustomError");
const { v4: uuidv4 } = require("uuid");

const join = async (nickname, email, password) => {
  // password 암호화
  const salt = crypto.randomBytes(32).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 32, "sha512")
    .toString("base64");

  // id 생성
  const userId = uuidv4();

  let values = [userId, nickname, email, hashPassword, salt];

  try {
    await conn.query(userQuery.join, values);

    return {
      isSuccess: true,
      message: "회원가입 성공",
    };
  } catch (err) {
    throw err;
  }
};

const login = async (email, password) => {
  try {
    conn.query(userQuery.getUserByEmail, email, (err, results) => {
      // 에러인 경우
      if (err) {
        throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
      }

      // 비밀번호 암호화
      const loginUser = results[0];
      const hashPassword = crypto
        .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
        .toString("base64");

      // 비밀번호 검증
      if (loginUser && loginUser.password == hashPassword) {
        const token = jwt.sign(
          {
            userId: loginUser.id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "14d",
          }
        );

        return {
          isSuccess: true,
          message: "로그인 성공",
          accessToken: token,
        };
      } else {
        throw new CustomError(
          StatusCodes.UNAUTHORIZED,
          "이메일 또는 비밀번호를 다시 확인해주세요"
        );
      }
    });
  } catch (err) {
    throw err;
  }
};

module.exports = { join, login };
