import User from "../models/user.model.js"
import UrlModel from "../models/shortUrl.model.js"

export const findUserByEmail = async (email) => {
    return await User.findOne({email})
}

export const findUserByEmailAndPassword = async (email) => {
    return await User.findOne({email}).select("+password")
}

export const findUserById = async (id) => {
    return await User.findOne({ _id: id });
}
  

export const createUser = async (name, email, password) => {
    const newUser = new User({name, email, password})
    await newUser.save()
    return newUser
}

export const getAllUserUrlsDao = async (id) => {
    return await UrlModel.find({ user: id })
}