import mongoose from "mongoose";

//This model defines how shortened URLs are stored. Each document contains the original URL, a unique short URL (with an index for fast lookups), a click counter with a default value 0, and a reference to the user who created it. Using Mongoose schema validations (required, unique, default) ensures data integrity, while ref establishes relationships for population.

//mongoose.Schema lets you enforce structure on MongoDB’s schema-less documents.This prevents inconsistent data(like missing fields or wrong types).
const shortUrlSchema = new mongoose.Schema({
    full_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      index: true,//improves query performance when searching by short URL.
      unique:true//there can't be same short urls for two long urls
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
  user: {
    //this establishes a one-to-many relationship → one user can own multiple short URLs.
        type: mongoose.Schema.Types.ObjectId,
    ref: "User"//enables population (pulling user details automatically when querying URLs).
  }
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);//compiles the schema into a model, which gives you the CRUD API (find, create, update, delete).

export default shortUrl;
