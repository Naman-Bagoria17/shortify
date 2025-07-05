import e from "express";
import { getShortUrl } from "../dao/shortUrl.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
  deleteShortUrlService,
} from "../services/shortUrl.service.js";
import wrapASync from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapASync(async (req, res) => {
  const data = req.body;
  let shortUrl;

  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }

  res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl });
});

export const redirectFromShortUrl = wrapASync(async (req, res) => {
  const { id } = req.params;
  console.log('Attempting to redirect short URL:', id);

  const url = await getShortUrl(id);
  if (!url) {
    console.log('Short URL not found:', id);
    // Instead of throwing an error, redirect to frontend
    return res.redirect('/');
  }

  console.log('Redirecting to:', url.full_url);
  res.redirect(url.full_url);
});

export const createCustomShortUrl = wrapASync(async (req, res) => {
  const { url, slug } = req.body;
  const shortUrl = await createShortUrlWithoutUser(url, slug);
  res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl });
});

export const deleteShortUrl = wrapASync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const result = await deleteShortUrlService(id, userId);
  res.status(200).json(result);
});
