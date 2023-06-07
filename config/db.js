const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DB_CONNECTION_URL = process.env.MONGO_DB_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_URL, {

      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to server successfully")
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
