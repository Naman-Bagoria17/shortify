import {
    getCustomShortUrl,
    saveShortUrl,
    getShortUrlById,
    deleteShortUrlById,
} from "../dao/shortUrl.js";
import { generateNanoId } from "../utils/helper.js";

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = generateNanoId(7);
    if (!shortUrl) throw new Error("Short URL not generated");

    await saveShortUrl(shortUrl, url);
    return shortUrl;
};

export const createShortUrlWithUser = async (url, userId, slug = null) => {
    const shortUrl = slug || generateNanoId(7);
    const exists = await getCustomShortUrl(slug);
    if (exists) throw new Error("This slug has already been claimed. Please try another.");

    await saveShortUrl(shortUrl, url, userId);
    return shortUrl;
};

export const deleteShortUrlService = async (id, userId) => {
    const doc = await getShortUrlById(id);
    if (!doc) throw new Error("Short URL not found");
    if (doc.user.toString() !== userId.toString()) {
        throw new Error("You are not authorized to delete this URL");
    }
    await deleteShortUrlById(id);
    return { message: "URL deleted successfully" };
};
  