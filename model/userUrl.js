import mongoose from "mongoose";

const userUrlSchema = new mongoose.Schema({
  urlId: { type: String },
  origUrl: { type: String, required: true },
  shortUrl: { type: String },
  costumUrl: { type: String },
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, default: Date.now() },
});

const userUrl = mongoose.model("userUrl", userUrlSchema);

export default userUrl;
