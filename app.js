import express from "express";
import userRoute from "./route/url.js";
// import qrCode from "./route/qrCode.js";
import bodyParser from "body-parser";
import ejs from "ejs";
// import userUrl from "./model/userUrl.js";

const app = express();
app.set("view engine", "ejs");

// app.set("views", path.join(__dirname, "view"));
// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.render("my");
});

app.use("/", userRoute);
// app.use("/", indexRoute);
// app.use("/", customUrlRoute);
// app.use("/", qrCode);
export default app;
