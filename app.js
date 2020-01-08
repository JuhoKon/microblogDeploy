var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
var Promise = require("bluebird");
var mongoose = require("mongoose");
var cors = require("cors");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var authRouter = require("./routes/auth");
var path = require("path");
require("dotenv").config();
var app = express();
//cors
app.use(cors());
//making uploads folder public
app.use("/uploads", express.static("uploads"));
app.use("/apidoc", express.static("apidoc"));
// Reading env variables (config example from https://github.com/sclorg/nodejs-ex/blob/master/server.js)
var mongoURL = process.env.MONGO_URL;

// Connecting to mongoose
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on(
  "open",
  console.log.bind(console, "MongoDB connection successful: " + mongoURL)
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/posts", postsRouter); //forward request to router
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.get("/api/doc", function(req, res) {
  res.sendFile(path.join(__dirname + "/apidoc/index.html"));
});

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.message
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
