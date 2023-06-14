import express from "express";
import router from "./route/url.js";

const app = express();

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);
export default app;
