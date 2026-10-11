const express = require('express')
const router = express.Router()
const controller = require('../controllers/product.controller')
const middleware = require('../middlewares/auth.middleware')
const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

router.post("/product", middleware.admin, upload.single('product'), controller.product)

router.put("/editProduct/:id", middleware.admin, upload.single('product'), controller.editProduct)

router.get("/getProducts", controller.getProducts)

router.get("/product", controller.findByCategory)

router.delete("/deleteProduct", controller.deleteProduct)

router.get("/productDetails/:id", controller.getProductById)


module.exports = router