import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Please enter Name"]
    },
    photo: {
        type:String,
        required:[true,"Please enter photo"]
    },
    price: {
        type:Number,
        required:[true,"Please enter Price"]
    },
    stock: {
        type:Object,
        required:[true,"Please enter Stock"],
        default:{"XS":0,"S":0,"M":0,"L":0,"XL":0,"XXL":0,}
    },
    category: {
        type: String,
        required:[true,"Please Enter the Category"],
        trim:true
    }
},
{
    timestamps:true,
});

export const Product = mongoose.model("products",productSchema)