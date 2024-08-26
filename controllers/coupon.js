import errorHandler from "../Middlewares/error.js";
import { Coupon } from "../models/coupon.js";

export const newCoupon = async (req,res,next) => {
    try {
        const {coupon,discount} = req.body;
        if (!coupon || !discount) return next(new errorHandler("Please enter both coupon and discount",401))
        const matchCoupon = await Coupon.findOne({coupon})
        if (matchCoupon) return next(new errorHandler("This Coupon Code is already Added",401))
        await Coupon.create({coupon,discount})
        res.status(201).json({
            sucess:true,
            message:"Coupon Created Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const allCoupon = async (req,res,next) => {
    try {
        const coupons = await Coupon.find({})
        res.status(200).json({
            success:true,
            coupons
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCoupon = async (req,res,next) => {
    try {
        const {id} = req.params;
        if (!id) return next(new errorHandler("Invalid id",401))
        await Coupon.deleteOne({_id:id})
        res.status(200).json({
            success:true,
            message:"Coupon Deleted"
        })
    } catch (error) {
        next(error)
    }
}

export const verifyCoupon = async (req,res,next) => {
    try {
        const {coupon} = req.body;
        if (!coupon) return next(new errorHandler("Please enter coupon",401))
        const isMatch = await Coupon.findOne({coupon:coupon})
        if (!isMatch) return next(new errorHandler("Invalid Coupon",404))
        const discount = isMatch.discount
        res.status(200).json({
            success:true,
            discount
        })
    } catch (error) {
        next(error)
    }
}