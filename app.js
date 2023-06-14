import express from "express";
import userRoute from "./route/url.js";
import indexRoute from "./route/index.js";

const app = express();

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRoute);
app.use("/", indexRoute);
export default app;
