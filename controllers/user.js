import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { sendCookie } from "../utils/features.js";
import errorHandler from "../Middlewares/error.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password, streetAddress, city, state, zipcode } = req.body;
        let user = await User.findOne({ email })
        if (user) return next(new errorHandler("User already exist", 400))
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({ name, email, password: hashedPassword, streetAddress, city, state, zipcode })
        sendCookie(user, res, `Registered Successfully as ${user.name}`, 201)
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }).select("+password");
        if (!user) return next(new errorHandler("Invalid username or password", 401))
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return next(new errorHandler("Invalid username or password", 401))
        sendCookie(user, res, `Welcome back ${user.name}`, 201)
    } catch (error) {
        next(error)
    }
}

export const logout = (req, res, next) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            // sameSite:process.env.NODE_ENV === "development" ? "lax" : "none",
            // secure:process.env.NODE_ENV === "development" ? "false" : "true"
        }).json({
            success: true,
            message: "Logged Out Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        let users = await User.find({});
        if (!users) return next(new errorHandler("Users not found", 404))
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const getUserForAdmin = async (req, res, next) => {
    const { id } = req.params
    const user = await User.findOne({_id:id})
    if (!user) return next(new errorHandler("User not exist", 401))
    res.status(200).json({
      success:true,
      user
    })
}

export const updateAddress = async (req, res, next) => {
    const {streetAddress, state, city, zipcode} = req.body;
    const userid = req.user._id;
    const user = await User.findOne({_id:userid})
    if (!user) return next(new errorHandler("User not exist", 401))
    user.streetAddress = streetAddress;
    user.state = state;
    user.city = city;
    user.zipcode = zipcode;
    await user.save()
    res.status(200).json({
        success:true,
        message:"Your Address is Updated"
    })
}