import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "../utils/helper.js";

// Checks if a valid accessToken cookie exists
// Verifies it(using JWT)
// Loads the user from DB
// Attaches the user to req.user
// If any step fails → returns 401 Unauthorized

// I use authMiddleware to protect routes.It checks if the JWT token exists, verifies it, and loads the user from the DB.If any part fails, it returns a 401 response.
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken
  if(!token) return res.status(401).json({message:"Unauthorized"})
  try {
      const decoded = verifyToken(token)
      const user = await findUserById(decoded)
      if(!user) return res.status(401).json({message:"Unauthorized"})
      req.user = user
      next()
  } catch (error) {
      return res.status(401).json({message:"Unauthorized",error})
  }
}

// I use optionalAuthMiddleware for createShortUrl route where login is optional. It tries to verify the token and attach the user but doesn’t fail the request if it’s invalid or missing.
export const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next(); // allow unauthenticated users to create short urls.

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded);
    if (user) {
      req.user = user;
    }
  } catch (_) {
    // ignore invalid token, treat as guest
  }

  next();
};
