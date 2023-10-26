const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

const app = express();

//Setup MongoDB Connection
mongoose.set("strictQuery", false);

const username = encodeURIComponent(process.env.MONGODBUSERNAME);
const password = encodeURIComponent(process.env.MONGODBPASS);
const cluster = process.env.MONGODBCLUSTER;
const host = process.env.MONGODBHOST;
const uri = `mongodb+srv://${username}:${password}@${cluster}${host}`;

async function main(link) {
  // console.log(link);
  await mongoose.connect(link);
}

main(uri).catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

console.log(`Server is running`);

module.exports = app;
