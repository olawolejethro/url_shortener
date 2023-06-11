import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();
import dbConnection from "./config/db.js";
dbConnection();

app.get("/", (req, res) => {
  res.send("Hi world!");
});

app.listen(4000, "localhost", () => {
  console.log("server is running at port 4000");
});
