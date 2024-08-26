import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import errorHandler from "./error.js";

export const isAuthenticated = async (req,res,next) => {
    const { token } = req.cookies;
    if (!token)  return next(new errorHandler("Login First...",401))
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded._id);
    next();
}