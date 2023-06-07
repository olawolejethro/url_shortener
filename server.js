const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnection = require("./config/db");
dbConnection();
const app = express();

app.get("/", (req, res) => {
  res.send("Hi world!");
});

app.listen(4000, "localhost", () => {
  console.log("server is running at port 4000");
});
