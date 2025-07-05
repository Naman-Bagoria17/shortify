import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    full_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      index: true,
      unique:true//there can't be same short urls for two long urls
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"//model used for authentication.
  }
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);

export default shortUrl;
