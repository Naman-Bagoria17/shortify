// This utility middleware:
// Reads the JWT token from the browser cookie.
// Verifies the token.
// Fetches the user from the database using the ID from the token.
// Attaches the user to req.user so that downstream routes/middleware/controllers can access user info easily.

import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "./helper.js"

export const attachUser = async (req, res, next) => {
  const token = req.cookies.accessToken
  if (!token) return next()
  try {
    const decoded = verifyToken(token)
    const user = await findUserById(decoded)
    if (!user) return next()
    req.user = user
    next()
  } catch (error) {
    next()
  }
}
