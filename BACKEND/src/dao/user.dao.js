// DAO (Data Access Object) file. This layer interacts directly with the database, keeping your controllers clean and separated from DB logic.
import User from "../models/user.model.js"
import UrlModel from "../models/shortUrl.model.js"

export const findUserByEmail = async (email) => {
    return await User.findOne({email})
}

// Q: "How do you fetch hashed password during login?"
// A: "I use findUserByEmailAndPassword(), which selects the password explicitly."
export const findUserByEmailAndPassword = async (email) => {
    return await User.findOne({email}).select("+password")
}

// // Finds a user by their MongoDB _id.
// Used when decoding token and attaching user to request.
// Returns full user object (excluding password unless selected).
// Q: "After verifying JWT, how do you find the user?"
// A: "I use findUserById() to fetch the user by ID from token payload."
export const findUserById = async (id) => {
    return await User.findOne({ _id: id });
}
  

export const createUser = async (name, email, password) => {
    const newUser = new User({name, email, password})
    await newUser.save()
    return newUser
}

// Finds all shortened URLs created by a specific user (foreign key).
// Uses 'user' field in shortUrl schema which references User model (_id).
// Used for displaying all URLs on the user's dashboard.
export const getAllUserUrlsDao = async (id) => {
    return await UrlModel.find({ user: id })
}