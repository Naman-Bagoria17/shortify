import e from "express";
import { getShortUrl } from "../dao/shortUrl.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
  deleteShortUrlService,
} from "../services/shortUrl.service.js";
import wrapASync from "../utils/tryCatchWrapper.js";

// Clean trailing slash from APP_URL or fallback URL
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

  const baseUrl = getBaseUrl(req);
  res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl}` });
});

export const redirectFromShortUrl = wrapASync(async (req, res) => {
  const { id } = req.params;
  console.log("Attempting to redirect short URL:", id);

  const url = await getShortUrl(id);
  if (!url) {
    console.log("Short URL not found:", id);
    return res.redirect("/");
  }

  console.log("Redirecting to:", url.full_url);
  res.redirect(url.full_url);
});

export const createCustomShortUrl = wrapASync(async (req, res) => {
  const { url, slug } = req.body;
  const shortUrl = await createShortUrlWithoutUser(url, slug);

  const baseUrl = getBaseUrl(req);
  res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl}` });
});

export const deleteShortUrl = wrapASync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const result = await deleteShortUrlService(id, userId);
  res.status(200).json(result);
});
