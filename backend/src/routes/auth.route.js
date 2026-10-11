const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth.controller')
const middleware = require('../middlewares/auth.middleware')

router.post("/register", controller.register)
router.post("/login", controller.login)
router.post("/verify-email", controller.verifyOtp)
router.post("/resend-otp", controller.resendOTP)
router.post("/getMe", controller.getMe)

router.get("/refresh", controller.RefreshToken)
router.get("/logout", controller.logout)
router.get("/logoutAll", controller.logoutAll)
router.get("/getAllUsers", middleware.admin, controller.getAllUsers)





module.exports = router