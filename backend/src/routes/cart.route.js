const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/auth.middleware')
const cartController = require('../controllers/cart.controller')


router.post("/add", middleware.user, cartController.addCart)
router.post("/remove", middleware.user, cartController.removeCart)

router.get("/get", middleware.user, cartController.getCart)





module.exports = router