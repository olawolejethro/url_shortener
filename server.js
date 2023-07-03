import dotenv from "dotenv";
import app from "./app.js";

import dbConnection from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
dbConnection();

app.listen(PORT, HOST, () => {
  console.log("server is running at port 4000");
});
