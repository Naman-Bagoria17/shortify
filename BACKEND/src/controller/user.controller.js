import wrapAsync from "../utils/tryCatchWrapper.js"
import { getAllUserUrlsDao } from "../dao/user.dao.js"

export const getAllUserUrls = wrapAsync(async (req, res) => {
    const { _id } = req.user
    console.log('Fetching URLs for user ID:', _id);
    const urls = await getAllUserUrlsDao(_id)
    res.status(200).json({ message: "success", urls })
})