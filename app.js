const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const connectMongoDBSession = require("connect-mongodb-session");
const ejs = require("ejs");
const rateLimit = require("express-rate-limit");

const authRoute = require("./route/authRoute");
const userRoute = require("./route/url");

const passportjs = require("./middlewares/passport.js");
dotenv.config();
const app = express();
const MongoDBStore = connectMongoDBSession(session);

const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_EXPIRATION_TIME = process.env.COOKIE_EXPIRATION_TIME;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

app.set("view engine", "ejs");

const store = new MongoDBStore({
  uri: MONGO_DB_URL,
  collection: "sessions",
});
//catch store error
store.on("error", (error) => {
  console.log(error);
});

// SESSION MIDDLEWARE
const sessionMW = session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: false,
    maxAge: +COOKIE_EXPIRATION_TIME,
    domain: "http://127.0.0.1:4000,",
  }, // Set secure to true if using HTTPS
});

// MIDDLEWARES
app.use(cookieParser());
app.use(sessionMW);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passportjs;

const appLimiter = rateLimit({
  max: 100, // max allowable number of request from an IP address in a given timeframe
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from your IP address, please try again later.",
});
app.use("/", appLimiter); // Use to limit repeated requests to the server

app.get("/welcome", (req, res) => {
  res.send("welcome");
});
app.get("/", (req, res, next) => {
  res.render("login");
});
app.get("/signup", (req, res, next) => {
  res.render("sign");
});
app.get("/short", (req, res, next) => {
  res.render("my");
});
app.get("/costumeUrl", (req, res, next) => {
  res.render("customUrl");
});

app.use("/", userRoute);
app.use("/", authRoute);

// Global error handling middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An Internal server error has occured!";
  return res.status(statusCode).json({
    status: "failed",
    message: message,
  });
});

module.exports = app;
