const Imagekit = require('imagekit')
const productModel = require('../models/product.model')
const UploadProduct = require('../services/storage.service')
const cartModel = require('../models/cart.model')

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.URL_END_POINT
})
async function product(req, res) {
    let { title, description, price, category, quantity } = req.body
    try {
        if (quantity < 1) {
            return res.status(401).json({
                message: "Minimum quantity limit is 1",
            })
        }
        if (price < 10) {
            return res.status(401).json({
                message: "Minimum price is 10 ",
            })
        }

        let productImage = req.file
        if (!productImage) {
            return res.status(400).json({
                message: "Please upload product img",

            })
        }

        let result = await UploadProduct(productImage)

        let product = await productModel.create({
            user: req.user._id,
            uri: result.url,
            fileId: result.fileId,
            title,
            category,
            description,
            price,
            quantity
        })
        res.status(200).json({
            message: "Product Upload succcesfully ",
            product
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
async function getProducts(req, res) {
    try {
        let page = Number(req.query.page) || 1
        let limit = Math.min(40, Math.max(1, Number(req.query.limit) || 12))
        let skip = (page - 1) * limit

        let products = await productModel.find()
            .populate("user")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        let productLength = await productModel.countDocuments()

        let pages = Math.ceil(productLength / limit)

        res.status(200).json({
            message: "Products fetched successfully",
            products,
            pages
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error" || error.message
        })
    }
}
async function editProduct(req, res) {
    try {
        let { id } = req.params
        let { title, description, category, price, quantity } = req.body
        let updateData = { title, description, category, price, quantity }

        if (req.file) {
            let result = await UploadProduct(req.file)
            updateData.uri = result.url
            updateData.fileId = result.fileId
        }

        let product = await productModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true })

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        res.status(200).json({
            message: "Product updated successfully",
            product
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })

    }

}
async function deleteProduct(req, res) {
    try {
        const { productId } = req.body
        let product = await productModel.findById(productId)
        if (!product)
            return res.status(404).json({
                message: "Product not found"
            })
        if (product.fileId) {
            try {
                await imagekit.deleteFile(product.fileId)

            } catch (imagekitErr) {
                console.log("Imagekit error " + imagekitErr.message);

            }
        }
        let deletedProduct = await productModel.findByIdAndDelete(productId)
        await cartModel.deleteMany({ productId: productId })
        res.status(200).json({
            message: "Product deleted Successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}
async function getProductById(req, res) {
    try {
        let { id } = req.params;
        let productById = await productModel.findOne({ _id: id })
        if (!productById) {
            return res.status(404).json({
                message: "not found"
            })
        }
        res.status(200).json({
            message: " Product fetched successfully",
            productById
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
async function findByCategory(req, res) {
    try {
        let { category, search, page = 1, limit = 12 } = req.query

        page = Math.max(1, parseInt(page) || 1)
        limit = Math.min(40, Math.max(1, parseInt(limit) || 12))
        let filter = {}

        if (category && category !== "All") {
            filter.category = category
        }
        if (search && search.trim() !== '') {
            filter.title = { $regex: search, $options: 'i' }
        }
        const skip = (page - 1) * limit
        const [products, total] = await Promise.all([
            productModel.find(filter).skip(skip).limit(limit).lean(),
            productModel.countDocuments(filter)
        ])


        res.status(200).json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            products
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}




module.exports = { product, editProduct, getProducts, deleteProduct, getProductById, findByCategory }