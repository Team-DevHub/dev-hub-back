const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const tokenHandler = require("../utils/tokenHandler");

authRouter.get("/github", authController.getGithubUrl);
authRouter.post("/github", authController.getGithubCallback);
authRouter.delete("/github", tokenHandler, authController.deleteGithubAccount);

module.exports = authRouter;
