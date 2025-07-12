import e from "express";
import { getShortUrl } from "../dao/shortUrl.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
  deleteShortUrlService,
} from "../services/shortUrl.service.js";
import wrapASync from "../utils/tryCatchWrapper.js";

// Constructs base URL from APP_URL (env) or request headers
// Removes trailing slashes to ensure consistent formatting
const getBaseUrl = (req) =>
  (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");

export const createShortUrl = wrapASync(async (req, res) => {
  const data = req.body;
  let shortUrl;

  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }

  //  Constructs final short URL using getBaseUrl()
  const baseUrl = getBaseUrl(req);
  // // - Responds with full short URL
  res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl}` });
});

export const redirectFromShortUrl = wrapASync(async (req, res) => {
  //extract the id of the short url that came in req.params
  const { id } = req.params;
  console.log("Attempting to redirect short URL:", id);

  //find the long url from the short url
  const url = await getShortUrl(id);
  if (!url) {
    console.log("Short URL not found:", id);
    return res.redirect("/");
  }

  console.log("Redirecting to:", url.full_url);
  res.redirect(url.full_url);
});


// Only logged -in users can delete their own URLs by ID.The controller ensures ownership before deletion.
export const deleteShortUrl = wrapASync(async (req, res) => {
  // Extracts MongoDB URL ID and user ID from req
  const { id } = req.params;
  const userId = req.user._id;

  // - Calls deleteShortUrlService() to:
  ///  - Check ownership
  ///  - Delete the document
  // - Returns success message
  const result = await deleteShortUrlService(id, userId);
  res.status(200).json(result);
});
