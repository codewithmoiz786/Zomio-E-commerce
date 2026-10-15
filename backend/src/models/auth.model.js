const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: [true, "Password  is required"],
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    otp: {
        type: String,
        select: false
    },
    otpExpire: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })

const user = mongoose.model("user", userSchema)
module.exports = user