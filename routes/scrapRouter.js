const express = require("express");
const tokenHandler = require("../utils/tokenHandler");
const scrapRouter = express.Router();
const scrapController = require("../controllers/scrapController");

scrapRouter.get("/", tokenHandler, scrapController.getScrapList);
scrapRouter.get("/:postId", tokenHandler, scrapController.scrap);
scrapRouter.delete("/:postId", tokenHandler, scrapController.deleteScrap);

module.exports = scrapRouter;
