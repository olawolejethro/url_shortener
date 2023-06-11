import mongoose from "mongoose";

const userUrlSchema = new mongoose.Schema({
  urlId: { type: String, required: true },
  origUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, default: Date.now() },
});

const userUrl = mongoose.model("userUrl", userUrlSchema);

export default userUrl;
