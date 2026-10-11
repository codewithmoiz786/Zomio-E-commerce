const cartModel = require('../models/cart.model')

async function addCart(req, res) {
    try {
        let { productId, quantity } = req.body;

        let userId = req.user._id
        let item = await cartModel.findOne({ productId, userId })
        if (item) {
            item.quantity += quantity || 1
            await item.save()
            return res.json({ message: "Quantity increase ", item })
        } else {
            let newItem = await cartModel.create({
                userId,
                productId,
                quantity
            })
            res.status(200).json({ message: "Cart added successfully", newItem })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getCart(req, res) {
    try {
        let userId = req.user._id;
        let allCarts = await cartModel.find({ userId }).populate("productId")
        let validCarts = allCarts.filter(item => item.productId !== null)

        res.status(200).json({
            message: "Carts fetched successfully",
            allCarts: validCarts
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
async function removeCart(req, res) {
    try {

        let { productId } = req.body
        let removeProduct = await cartModel.findOneAndDelete({ _id: productId, userId: req.user._id })
        res.status(200).json({
            message: "Cart removed!",
            removeProduct
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

module.exports = { addCart, getCart, removeCart }