const { StatusCodes } = require("http-status-codes");
const scrapService = require("../services/scrapService");
const { verifyAccessToken } = require("../utils/verifyToken");

const getScrapList = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const verifyResult = verifyAccessToken(token);

    const result = await scrapService.getScrapList(verifyResult.userId);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      isSuccess: false,
      message: err.message,
    });
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
