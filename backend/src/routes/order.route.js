const express = require("express")
const router = express.Router()
const controlller = require('../controllers/order.controller')
const middleware = require("../middlewares/auth.middleware")

router.post("/buyNow", middleware.user, controlller.buyNow)
router.get("/myOrders", middleware.user, controlller.myOrders)
router.get("/getAllOrders", middleware.admin, controlller.getAllOrders)
router.get("/incomeCharts", middleware.admin, controlller.ordersDetails)
router.put("/updateStatus/:id", middleware.admin, controlller.updateStatus)
router.get("/RemoveCancelledOrders",middleware.admin,controlller.DeleteOrder)

module.exports = router