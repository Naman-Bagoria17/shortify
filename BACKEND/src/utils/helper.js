import jsonwebtoken from "jsonwebtoken"
import { nanoid } from "nanoid";//nanoid package uses named exports like export function nanoid() { ... }

export const generateNanoId = (length) => {
    return nanoid(length);
}

export const signToken = (payload) => {
    return jsonwebtoken.sign(payload,process.env.JWT_SECRET, {expiresIn:"1h"} )
}

export const verifyToken = (token) => {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    return decoded.id
}