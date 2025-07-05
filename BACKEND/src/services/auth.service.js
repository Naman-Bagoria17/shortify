import {
    createUser,
    findUserByEmail,
    findUserByEmailAndPassword
} from "../dao/user.dao.js";

import { ConflictError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";
import { cookieOptions } from "../config/config.js";

export const registerUser = async (name, email, password) => {
    const existing = await findUserByEmail(email);
    if (existing) throw new ConflictError("User already exists");

    const newUser = await createUser(name, email, password);
    const token = signToken({ id: newUser._id });
    return { token, user: newUser };
};

export const loginUser = async (email, password) => {
    const user = await findUserByEmailAndPassword(email);
    if (!user) throw new Error("Invalid Credentials");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error("Invalid Credentials");

    const token = signToken({ id: user._id });
    return { token, user };
};

export const logoutUser = async (email, password) => {
    if (!password) throw new Error("Password required");

    const user = await findUserByEmailAndPassword(email);
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
        const err = new Error("Incorrect password");
        err.statusCode = 401;
        throw err;
    }

    return {
        message: "Logout successful",
        cookieOptions
    };
};
  