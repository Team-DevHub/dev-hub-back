require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("devhub");
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}...`);
});

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/usersRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/oauth", authRouter);
