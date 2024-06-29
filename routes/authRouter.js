const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.get("/github", authController.getGithubUrl);
authRouter.post("/github", authController.getGithubCallback);

module.exports = authRouter;
