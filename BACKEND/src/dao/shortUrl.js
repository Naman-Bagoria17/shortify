import shortUrlSchema from "../models/shortUrl.model.js"
import { ConflictError } from "../utils/errorHandler.js"

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
export const getShortUrl = async (id) => {
    return await shortUrlSchema.findOneAndUpdate({ short_url: id }, { $inc: { clicks: 1 } });
}

export const getCustomShortUrl = async (slug) => {
    return await shortUrlSchema.findOne({ short_url: slug });
}

export const getShortUrlById = async (id) => {
    return await shortUrlSchema.findById(id);
};

export const deleteShortUrlById = async (id) => {
    return await shortUrlSchema.findByIdAndDelete(id);
};