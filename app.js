require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}...`);
});

const userRouter = require("./routes/usersRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
