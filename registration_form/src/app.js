require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// const auth = require("./middleware/auth");
const newRouter = require("./router/register");
const app = express();
require("./db/conn");
// app.use(cookie)
const port = process.env.PORT || 5005;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(newRouter);
app.listen(port, () => {
  console.log(`connection is set up at ${port}`);
});
