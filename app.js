import express from "express";
import userRoute from "./route/url.js";
import indexRoute from "./route/index.js";
import customUrlRoute from "./route/customUrl.js";
import qrCode from "./route/qrCode.js";

const app = express();

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRoute);
app.use("/", indexRoute);
app.use("/", customUrlRoute);
app.use("/", qrCode);
export default app;
