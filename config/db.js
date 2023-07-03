import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_CONNECTION_URL = process.env.MONGO_DB_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to server successfully");
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

export default dbConnection;
