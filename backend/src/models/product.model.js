const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "user is required"]
    },
    uri: {
        type: String,
        required: [true, "Product Uri is required"],
        unique: true
    },
    fileId: { type: String },
    title: {
        type: String,
        required: [true, "title  is required"]
    },
    category: {
        type: String,
        required: [true, "category  is required"]
    },
    description: {
        type: String,
        required: [true, " description is required"]
    },
    price: {
        type: String,
        required: [true, " price is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    }
}, { timestamps: true })

productSchema.index({ category: 1 }); 
productSchema.index({ title: 1 });

module.exports = mongoose.model("product", productSchema)