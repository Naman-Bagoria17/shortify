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
    console.log('Login attempt for email:', email);
    const user = await findUserByEmailAndPassword(email);
    if (!user) {
        console.log('User not found for email:', email);
        const error = new Error("Invalid Credentials");
        error.statusCode = 401;
        throw error;
    }

    console.log('User found, checking password...');
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        console.log('Password validation failed for email:', email);
        const error = new Error("Invalid Credentials");
        error.statusCode = 401;
        throw error;
    }

    console.log('Login successful for email:', email);
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
