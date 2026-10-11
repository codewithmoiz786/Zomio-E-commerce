const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"]
    },
    quantity: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: [true, "paymentMethod is required"],
        enum: ["easyPaisa", "jazzCash", "COD", "stripe"],
        default: "COD"
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Canceled"],
        default: "Pending"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }
}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)