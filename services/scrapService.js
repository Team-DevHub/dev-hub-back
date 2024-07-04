const conn = require("../database/mysql");
const scrapQuery = require("../queries/scrapQuery");

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

const scrap = (req, res) => {
  //
};

const deleteScrap = (req, res) => {
  //
};

module.exports = {
  getScrapList,
  scrap,
  deleteScrap,
};
