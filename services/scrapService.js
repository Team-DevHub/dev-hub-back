const { StatusCodes } = require("http-status-codes");
const conn = require("../database/mysql");
const scrapQuery = require("../queries/scrapQuery");
const CustomError = require("../utils/CustomError");

const getScrapList = async (userId) => {
  try {
    const scrapResult = await conn
      .query(scrapQuery.getScrapList, userId)
      .then((res) => res[0]);

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

const scrap = async (userId, postId) => {
  try {
    const { count } = await conn
      .query(scrapQuery.getScrapCount, [postId, userId])
      .then((res) => res[0][0]);

    if (count > 0) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "이미 스크랩된 게시글입니다."
      );
    }

    const { affectedRows } = await conn
      .query(scrapQuery.scrap, [postId, userId])
      .then((res) => res[0]);

    if (affectedRows > 0) {
      return {
        isSuccess: true,
        message: "스크랩 성공",
      };
    } else {
      return {
        isSuccess: false,
        message: "스크랩 실패",
      };
    }
  } catch (err) {
    throw err;
  }
};

const deleteScrap = (req, res) => {
  //
};

module.exports = {
  getScrapList,
  scrap,
  deleteScrap,
};
