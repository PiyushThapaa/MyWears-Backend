import { User } from "../models/user.js"
import errorHandler from "./error.js"

export const adminOnly = async (req,res,next) => {
    const id = req.user
    const user = await User.findById(id)
    if (!user) return next(new errorHandler("Invalid Id", 401))
    if (user.role !== "admin") return next(new errorHandler("You are not an admin", 401))
    next()
}