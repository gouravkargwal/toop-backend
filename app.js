const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const authRouter = require("./routes/authRoutes.js");
const contactRouter = require("./routes/contactRoutes");
const messageRouter = require("./routes/messageRoutes");
const socket = require("socket.io");
require("dotenv").config();
require("./helpers/init_mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// app.use(express.static("./client/public"));
// app.use(express.text({ type: "text/html" }));
// app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/", contactRouter);

app.use((req, res, next) => {
  // const error = new Error("Not Found");
  // error.status = 404;
  // next(error);
  next(createError.NotFound("This route doesnot exist"));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    error: err.message,
  });
});

module.exports = app;
