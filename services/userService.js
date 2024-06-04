require("dotenv").config();
const conn = require("../database/mysql");
const { StatusCodes } = require("http-status-codes");
const userQuery = require("../queries/userQuery");
const CustomError = require("../utils/CustomError");
const { v4: uuidv4 } = require("uuid");
const { createAccessToken } = require("../utils/verifyToken");
const { getHashPassword } = require("../utils/getHashPassword");

/* ----- 회원가입 ----- */
const join = async (nickname, email, password) => {
  try {
    // 이메일 중복 확인
    const emailResult = await conn.query(userQuery.getUserByEmail, email);
    const user = emailResult[0][0];

    if (user) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "이미 사용 중인 이메일입니다."
      );
    }

    const pw = getHashPassword(password); // password 암호화
    const userId = uuidv4(); // id 생성

    let values = [userId, nickname, email, pw.hashPassword, pw.salt];

    await conn.query(userQuery.join, values);

    return {
      isSuccess: true,
      message: "회원가입 성공",
    };
  } catch (err) {
    throw err;
  }
};

/* ----- 로그인 ----- */
const login = async (email, password) => {
  try {
    const userResult = await conn.query(userQuery.getUserByEmail, email);
    const userData = userResult[0][0];

    // 비밀번호 암호화
    const pw = getHashPassword(password, userData.salt);

    // 비밀번호 검증
    if (userData && userData.password == pw.hashPassword) {
      const token = createAccessToken(userData.id);

      return {
        isSuccess: true,
        message: "로그인 성공",
        accessToken: token,
        userId: userData.id,
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

/* ----- 이메일 중복 확인 ----- */
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

/* ----- 유저 프로필 조회 ----- */
const getUser = async (userId) => {
  try {
    // 유저 데이터 조회
    const result = await conn.query(userQuery.getUserById, userId);
    const userData = result[0][0];

    if (userData) {
      // post 개수 조회
      const postResult = await conn.query(userQuery.getTotalPosts, userId);
      const { count } = postResult[0][0];

      return {
        isSuccess: true,
        message: "조회 성공",
        result: {
          userId: userData.id,
          nickname: userData.name,
          email: userData.email,
          joinDate: userData.created_at.split(" ")[0],
          level: userData.level,
          totalPosts: count,
          totalPoints: userData.points,
        },
      };
    } else {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "유저 정보가 존재하지 않습니다."
      );
    }
  } catch (err) {
    throw err;
  }
};

/* ----- 회원 탈퇴 ----- */
const deleteAccount = async (userId) => {
  try {
    await conn.query(userQuery.deleteUser, userId);

    return {
      isSuccess: true,
      message: "회원탈퇴 성공",
    };
  } catch (err) {
    throw err;
  }
};

/* ----- 비밀번호 찾기 ----- */
const findPw = async (name, email) => {
  try {
    const result = await conn.query(userQuery.getName, email);
    const userData = result[0][0];

    if (userData.name === name) {
      return {
        isSuccess: true,
        message: "비밀번호 재설정 가능",
      };
    }
  } catch (err) {
    throw new CustomError(StatusCodes.FORBIDDEN, "비밀번호 재설정 불가능");
  }
};

/* ----- 비밀번호 재설정 ----- */
const resetPw = async (email, password) => {
  try {
    const { hashPassword, salt } = getHashPassword(password);
    const result = await conn.query(userQuery.resetPassword, [
      hashPassword,
      salt,
      email,
    ]);

    if (result[0].affectedRows > 0) {
      return {
        isSuccess: true,
        message: "비밀번호 재설정 완료",
      };
    } else {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        "요청 값을 다시 확인해주세요"
      );
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  join,
  login,
  checkEmail,
  getUser,
  deleteAccount,
  findPw,
  resetPw,
};
