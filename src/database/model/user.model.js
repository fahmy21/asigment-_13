
import mongoose from "mongoose";



const userschema = new mongoose.Schema({
    name: {
        type: String,
        require: true

    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password:
    {
        type: String,
        require: function () {
            return this.provider === "system"
        }
    },
    Cover_Images: {
        type: String,

    },

    Profile_Picture: {
        type: String,

    },
    phone: {
        type: String,

    },
    Unique_Acc_Name: {
        type: String,
        require: function () {
            return this.provider === "system"
        },
        unique: true
    },
    role: {
        type: Number,
        default: 0


    },
    isVerified: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        enum: ["google", "system"],
        default: "system"
    }
})
const User_Model = mongoose.model("users", userschema)
export default User_Model