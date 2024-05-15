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
    const userResult = await conn.query(userQuery.getUserByEmail, email);
    const userData = userResult[0][0];

    // 비밀번호 암호화
    const hashPassword = crypto
      .pbkdf2Sync(password, userData.salt, 10000, 32, "sha512")
      .toString("base64");

    // 비밀번호 검증
    if (userData && userData.password == hashPassword) {
      const token = jwt.sign(
        {
          userId: userData.id,
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
  } catch (err) {
    throw err;
  }
};

// 이메일 중복확인
const checkEmail = async (email) => {
  try {
    const result = await conn.query(userQuery.checkEmail, email);
    const { count } = result[0][0];

    if (count) {
      return {
        isSuccess: true,
        result: false,
        message: "이미 사용 중인 이메일입니다.",
      };
    } else {
      return {
        isSuccess: true,
        result: true,
        message: "사용 가능한 이메일입니다.",
      };
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { join, login, checkEmail };
