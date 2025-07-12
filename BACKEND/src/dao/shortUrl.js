import shortUrlSchema from "../models/shortUrl.model.js"
import { ConflictError } from "../utils/errorHandler.js"

// use saveShortUrl() to save the long and short URL, and throw a ConflictError if the slug already exist. It handles both cases:when the user is logged in and not.
export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    try {
        const newUrl = new shortUrlSchema({
            full_url: longUrl,
            short_url: shortUrl
        })
        if (userId) {
            newUrl.user = userId
        }
        await newUrl.save();
    }
    catch (err) {
        if (err.code == 11000) {
            throw new ConflictError("Short URL already exists")
        }
        throw new Error(err);
    }
}

// Finds a document by short_url (slug) and increments its click count by 1
// Used when redirecting to the long URL after someone clicks the short URL
export const getShortUrl = async (id) => {
    return await shortUrlSchema.findOneAndUpdate({ short_url: id }, { $inc: { clicks: 1 } });
}

// Finds a shortened URL by its custom slug (without incrementing clicks)
// Used when checking if a custom slug is already taken before saving a new one
export const getCustomShortUrl = async (slug) => {
    return await shortUrlSchema.findOne({ short_url: slug });
}

export const getShortUrlById = async (id) => {
    return await shortUrlSchema.findById(id);
};

export const deleteShortUrlById = async (id) => {
    return await shortUrlSchema.findByIdAndDelete(id);
};
