import express from "express";
import { createShortUrl, deleteShortUrl } from "../controller/shortUrl.controller.js";
import { optionalAuthMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuthMiddleware, createShortUrl);
router.delete("/:id", authMiddleware, deleteShortUrl); 

export default router;
