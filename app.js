import express from "express";
import userRoute from "./route/url.js";
import bodyParser from "body-parser";
import authRoute from "./route/authRoute.js";
import passport from "passport";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passportjs from "./middlewares/passport.js";
import ejs from "ejs";
dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_EXPIRATION_TIME = process.env.COOKIE_EXPIRATION_TIME;

const app = express();
app.set("view engine", "ejs");

const sessionMW = session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  // store: store,
  cookie: {
    secure: false,
    maxAge: +COOKIE_EXPIRATION_TIME,
    domain: "http://localhost:4000,",
  }, // Set secure to true if using HTTPS
});

// MIDDLEWARES
app.use(cookieParser());
app.use(sessionMW);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passportjs;

app.get("/", (req, res, next) => {
  res.render("login");
});
app.get("/signUp", (req, res, next) => {
  res.render("signUp");
});
app.get("/short", (req, res, next) => {
  res.render("my");
});
app.get("/costumeUrl", (req, res, next) => {
  res.render("customUrl");
});

app.use("/", userRoute);
app.use("/", authRoute);
// app.use("/", indexRoute);
// app.use("/", customUrlRoute);
// app.use("/", qrCode);
export default app;
