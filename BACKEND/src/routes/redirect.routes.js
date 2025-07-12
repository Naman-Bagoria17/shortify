import express from "express";
import { redirectFromShortUrl } from "../controller/shortUrl.controller.js";

const router = express.Router();

const reserved = ["api", "login", "signup", "dashboard"];

router.get("/:id", (req, res, next) => {
    if (reserved.includes(req.params.id)) return next();
    return redirectFromShortUrl(req, res, next);
});

export default router;