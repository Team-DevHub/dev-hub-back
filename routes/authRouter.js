const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.get("/github", authController.getGithubUrl);
authRouter.post("/github", authController.getGithubCallback);
authRouter.delete("/github", authController.deleteGithubAccount);

authRouter.get("/google", authController.getGoogleUrl);
authRouter.post("/google", authController.getGoogleCallback);

module.exports = authRouter;
