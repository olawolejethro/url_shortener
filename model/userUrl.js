import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const userUrlSchema = new mongoose.Schema({
  urlId: { type: String },
  origUrl: { type: String, required: true },
  shortUrl: { type: String },
  costumUrl: { type: String },
  user_id: {
    type: ObjectId,
    // required: [true, "Please provide the blog author's Id."],
    ref: "auth",
  },
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, default: Date.now() },
});

const userUrl = mongoose.model("userUrl", userUrlSchema);

export default userUrl;
