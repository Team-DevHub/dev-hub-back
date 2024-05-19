const conn = require("../database/mysql");
const { getUserInfo, getTopFive } = require("../queries/userQuery");

exports.getUserInfo = async (userId) => {
  try {
    // 특정 유저 정보만 조회하는 경우
    if (userId) {
      const result = await conn.query(getUserInfo, userId);
      return result[0][0];
    }
    // top 5 수강생 조회하는 경우
    else {
      const result = await conn.query(getTopFive);
      return result[0];
    }
  } catch (err) {
    throw err;
  }
};
