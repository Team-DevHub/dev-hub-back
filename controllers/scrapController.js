const { StatusCodes } = require("http-status-codes");
const scrapService = require("../services/scrapService");

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

const scrapController = async (req, res, actionType) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    let result;
    if (actionType === "scrap") {
      result = await scrapService.scrap(userId, postId);
    } else if (actionType === "delete") {
      result = await scrapService.deleteScrap(userId, postId);
    } else {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid action type");
    }

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

module.exports = {
  getScrapList,
  scrap: async (req, res) => scrapController(req, res, "scrap"),
  deleteScrap: async (req, res) => scrapController(req, res, "delete"),
};
