// I added a fallback redirect route. It checks if the path is a reserved route (/api, /login, etc.). If not, it treats it as a short URL and redirects using the controller logic. This allows clean short URLs while still keeping frontend routes functional.
import express from "express";
import { redirectFromShortUrl } from "../controller/shortUrl.controller.js";

const router = express.Router();

const reserved = ["api", "auth", "dashboard"];

router.get("/:id", (req, res, next) => {
    if (reserved.includes(req.params.id)) return next();
    return redirectFromShortUrl(req, res, next);
});

export default router;