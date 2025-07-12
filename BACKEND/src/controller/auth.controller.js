import { cookieOptions } from "../config/config.js"
import { loginUser, logoutUser, registerUser } from "../services/auth.service.js"
import wrapASync from "../utils/tryCatchWrapper.js"

export const register_user = wrapASync(async (req, res) => {
    const { name, email, password } = req.body
    const { token, user } = await registerUser(name, email, password)
    req.user = user

// Sends a cookie named accessToken to the client
// Stores the JWT token in that cookie
// Applies security settings like:
//     httpOnly: true → JS can’t access it(protects from XSS)
//     secure: true(in production) → only sent over HTTPS
//     sameSite: 'Lax' → defends against CSRF
//     maxAge → sets cookie expiry time

// It allows you to store the user's authentication token securely in the browser so they stay logged in and can access protected routes.
    res.cookie("accessToken", token, cookieOptions)

//returns the user data for frontend use.
    res.status(200).json({ user: user, message: "signed up successfully" })
})

export const login_user = wrapASync(async (req, res) => {
    const { email, password } = req.body
    const { token, user } = await loginUser(email, password)

    req.user = user
    res.cookie("accessToken", token, cookieOptions)
    res.status(200).json({ user: user, message: "signed in successfully" })
})

export const logout_user = wrapASync(async (req, res) => {
    const { password } = req.body;
    const result = await logoutUser(req.user.email, password);
    res.clearCookie("accessToken", result.cookieOptions);
    res.status(200).json({ success: true, message: result.message });
});

// - Returns the current authenticated user's info (attached to req.user by middleware)
// - Requires authMiddleware to run before this route

// "I use a protected route /me that returns the req.user object after verifying the JWT via middleware."
export const get_current_user = wrapASync(async (req, res) => {
    res.status(200).json({ user: req.user })
})