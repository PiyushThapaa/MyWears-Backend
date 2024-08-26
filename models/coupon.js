import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    coupon:{
        type:String,
        required:true,
        unique:true
    },
    discount:{
        type:Number,
        required:true
    }
},
{
    timestamps:true,
});

export const Coupon = mongoose.model("coupons",couponSchema)