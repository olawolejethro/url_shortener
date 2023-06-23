// import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
// import bodyParser from "body-parser";

import dbConnection from "./config/db.js";
dotenv.config();
dbConnection();

app.listen(4000, "localhost", () => {
  console.log("server is running at port 4000");
});
