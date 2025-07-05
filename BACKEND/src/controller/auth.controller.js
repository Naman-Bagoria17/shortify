import { cookieOptions } from "../config/config.js"
import { loginUser, logoutUser, registerUser } from "../services/auth.service.js"
import wrapASync from "../utils/tryCatchWrapper.js"

export const register_user = wrapASync(async (req, res) => {
    const { name, email, password } = req.body
    const { token, user } = await registerUser(name, email, password)
    req.user = user
    res.cookie("accessToken", token, cookieOptions)
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

export const get_current_user = wrapASync(async (req, res) => {
    res.status(200).json({ user: req.user })
})