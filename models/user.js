import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Please enter Name"]
    },
    email: {
        type:String,
        unique:[true,"Email already Exist"],
        required:[true,"Please enter Email"],
        validate:validator.default.isEmail
    },
    password: {
        type: String,
        required:[true,"Please Enter the Password"],
    },
    streetAddress:{
        type:String,
        required :true
    },
    city:{
        type:String,
        required :true
    },
    state:{
        type:String,
        required :true
    },
    zipcode:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},{
    timestamps:true,
});

export const User = mongoose.model("user",userSchema)