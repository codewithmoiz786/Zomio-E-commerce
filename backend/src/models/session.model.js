const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    },
    RefreshTokenHash: {
        type: String,
       
    },
    ip: {
        type: String,
        required: [true, "Ip Address is required"]
    },
    userAgent: {
        type: String,
        required: [true, "UserAgent is required"]
    },
    revoked: {
        type: Boolean,
        default: false
    }
},{timestamps:true})
module.exports = mongoose.model("session", sessionSchema)