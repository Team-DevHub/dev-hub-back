const { StatusCodes } = require("http-status-codes");
const conn = require("../database/mysql");
const scrapQuery = require("../queries/scrapQuery");
const CustomError = require("../utils/CustomError");

const getScrapList = async (userId) => {
  try {
    const scrapResult = await conn
      .query(scrapQuery.getScrapList, userId)
      .then((res) => res[0]);

    if (scrapResult.length === 0) {
      return {
        isSuccess: true,
        message: "스크랩 리스트 조회 성공",
        result: [],
      };
    }

    const scrapPostId = scrapResult.map((result) => result.post_id);

    const postResult = await conn
      .query(scrapQuery.getScrapPosts, [scrapPostId])
      .then((res) => res[0]);

    return {
      isSuccess: true,
      message: "스크랩 리스트 조회 성공",
      result: postResult,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getScrapList,
  scrap,
  deleteScrap,
};
