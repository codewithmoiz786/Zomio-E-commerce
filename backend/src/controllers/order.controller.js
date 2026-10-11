const orderModel = require("../models/order.model");
const productModel = require("../models/product.model")

async function buyNow(req, res) {
    let { fullName, phoneNumber, address, productId, paymentMethod = "COD", quantity } = req.body


    if (!fullName || !phoneNumber || !address || !productId || !quantity) {
        return res.status(400).json({
            message: "Please fill all fields"
        })

    }

    let product = await productModel.findById(productId)
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        })
    }
    if (product.quantity === 0) {
        return res.status(400).json({
            message: `Sorry, ${product.title} is out of stock `,
        })
    }
    if (quantity > product.quantity) {
        return res.status(400).json({
            message: `we have only ${product.quantity} stock left!`,
        })
    }
    try {
        let order = await orderModel.create({
            fullName,
            phoneNumber,
            address,
            productId,
            userId: req.user._id,
            paymentMethod,
            quantity
        })
        product.quantity -= quantity
        await product.save()

        res.status(200).json({
            message: "Thanks your order is placed",
            order
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}

async function myOrders(req, res) {
    let userId = req.user._id
    let myOrders = (await orderModel.find({ userId }).populate("productId").populate("userId", ["email", "_id", "role"])).reverse()

    try {
        res.status(200).json({
            message: "myOrders fetched succesufully",
            myOrders
        })
    } catch (err) {
        res.status(500).json({
            message: "Internel server error " + err.message
        })
    }
}

async function getAllOrders(req, res) {
    try {
        let AllOrders = await orderModel.find().populate("productId").populate("userId")
        if (!AllOrders || AllOrders.length === 0) {
            return res.status(404).json({
                message: "Don't have any order "
            }
            )
        }
        res.status(200).json({
            message: "Orders fetched successfully",
            AllOrders
        })
    } catch (err) {
        res.status(500).json({
            message: "Internel server error " + err.message
        })
    }
}

async function updateStatus(req, res) {
    try {
        const { status } = req.body
        const { id } = req.params
        let updatedOrder = await orderModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.json({ success: true, order: updatedOrder })
    } catch (err) {
        res.status(500).json({
            messsage: err.message
        })
    }
}

async function ordersDetails(req, res) {
    try {
        let totalOrders = (await orderModel.find())
        let sales = await orderModel.find({ $or: [{ status: "Success" }, { status: "Delivered" }] })

        res.status(200).json({
            message: "Income Details fetched successully",
            totalOrders: totalOrders.length,
            sales: sales.length
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

async function DeleteOrder(req, res) {
    try {

        let allOrders = await orderModel.find({ status: "Canceled" })

        res.status(200).json({
            message: "Cancelled orders Fetched successfully",
            length: allOrders.length,
            allOrders
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { buyNow, myOrders, getAllOrders, ordersDetails, updateStatus, DeleteOrder }