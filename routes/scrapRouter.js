const express = require("express");
const scrapRouter = express.Router();
const scrapController = require("../controllers/scrapController");

scrapRouter.get("/", scrapController.getScrapList);
scrapRouter.get("/:postId", scrapController.scrap);
scrapRouter.delete("/:postId", scrapController.deleteScrap);

module.exports = scrapRouter;
