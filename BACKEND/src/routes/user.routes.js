import express from "express"
import { getAllUserUrls } from "../controller/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

// I created a dedicated user route to fetch all short URLs belonging to a specific user. It’s protected with authMiddleware to ensure privacy, and it queries the DB based on the authenticated user’s ID.”
router.post("/urls", authMiddleware, getAllUserUrls)

export default router