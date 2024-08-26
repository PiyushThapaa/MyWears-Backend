import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:[true,"Please Enter userID"]
    },
    name:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing"
    },
    productId:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    }
},
{
    timestamps:true,
});

export const Order = mongoose.model("orders",orderSchema)