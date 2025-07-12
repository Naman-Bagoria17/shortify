import express from "express";
import { createShortUrl, deleteShortUrl } from "../controller/shortUrl.controller.js";
import { optionalAuthMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// I structured the short URL routes with clear access control. The POST / route allows both guests and logged-in users to generate a short URL, using optionalAuthMiddleware to attach user info if available. The DELETE /:id route is protected — it ensures only the logged-in owner can delete their own URLs.
router.post("/", optionalAuthMiddleware, createShortUrl);
router.delete("/:id", authMiddleware, deleteShortUrl); 

export default router;
