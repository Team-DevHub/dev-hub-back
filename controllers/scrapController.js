const { StatusCodes } = require("http-status-codes");
const scrapService = require("../services/scrapService");
const valid = require("../utils/validation");

const getScrapList = async (req, res) => {
  try {
    const result = await scrapService.getScrapList(req.userId);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

const scrap = [
  valid.postIdValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const result = await scrapService.scrap(req.userId, postId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

const deleteScrap = [
  valid.postIdValidation(),
  valid.validationCheck,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const result = await scrapService.deleteScrap(req.userId, postId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({
        isSuccess: false,
        message: err.message,
      });
    }
  },
];

module.exports = {
  getScrapList,
  scrap,
  deleteScrap,
};
