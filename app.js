import express from "express";
import userRoute from "./route/url.js";
import bodyParser from "body-parser";
import authRoute from "./route/authRoute.js";

import ejs from "ejs";

const app = express();
app.set("view engine", "ejs");

// app.set("views", path.join(__dirname, "view"));
// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

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
