const conn = require("../database/mysql");
const {
  updatePoints,
  getPointsById,
  updateLevel,
} = require("../queries/userQuery");

const level = (points) => {
  if (points <= 16) return 1;
  if (points <= 40) return 2;
  if (points <= 80) return 3;
  if (points <= 120) return 4;
  return 5;
};

exports.updatePointsAndLevel = async (userId, pointsChange) => {
  try {
    await conn.query(updatePoints, [pointsChange, userId]);

    // 현재 포인트 조회
    const [userResult] = await conn.query(getPointsById, [userId]);
    const curPoints = userResult[0].points;

    // 새 레벨 계산
    const newLevel = level(curPoints);

    // 레벨 업데이트
    await conn.query(updateLevel, [newLevel, userId]);
  } catch (err) {
    throw err;
  }
};
