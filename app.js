require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tweetsRouter = require("./routes/tweets");
var tagsRouter = require("./routes/tags");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tweets", tweetsRouter);
app.use("/tags", tagsRouter);
module.exports = app;
