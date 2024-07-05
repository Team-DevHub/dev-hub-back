const express = require("express");
const tokenHandler = require("../utils/tokenHandler");
const scrapRouter = express.Router();
const scrapController = require("../controllers/scrapController");
const valid = require("../utils/validation");

scrapRouter.get("/", tokenHandler, scrapController.getScrapList);
scrapRouter.get(
  "/:postId",
  tokenHandler,
  valid.postIdValidation(),
  valid.validationCheck,
  scrapController.scrap
);
scrapRouter.delete(
  "/:postId",
  tokenHandler,
  valid.postIdValidation(),
  valid.validationCheck,
  scrapController.deleteScrap
);

module.exports = scrapRouter;
