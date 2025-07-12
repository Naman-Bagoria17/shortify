import jsonwebtoken from "jsonwebtoken"
import { nanoid } from "nanoid";//nanoid package uses named exports like export function nanoid() { ... }

// // Uses the 'nanoid' library to generate short, unique, URL-safe IDs.
// Common use cases:
// - Generating short slugs for URL shortener
// - Creating unique IDs for objects (e.g., invite codes, file links)
export const generateNanoId = (length) => {
    return nanoid(length);
}


// // Creates a JWT token (JSON Web Token) using:
// - payload → usually contains user id or session info
// - secret key from environment (process.env.JWT_SECRET)
// - expiry time → set to 1 hour in this case
// This token is sent to the frontend and stored in cookies or localStorage.
export const signToken = (payload) => {
    return jsonwebtoken.sign(payload,process.env.JWT_SECRET, {expiresIn:"1h"} )
}


// Verifies the JWT token using the secret key.
// If valid → returns the payload (like user ID).
// If invalid → throws error, which is caught by error handler.
// Used in protected routes to extract the user's identity.

// If they ask: "How do you protect routes or check if a user is logged in?"
// "I used verifyToken() to decode the access token and get user ID, which I then used to attach the user to the request object."
export const verifyToken = (token) => {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    return decoded.id
}