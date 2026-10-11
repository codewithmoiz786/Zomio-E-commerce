const express = require('express')
const app = express()
const authroutes = require('./routes/auth.route')
const productRoute = require('./routes/product.route')
const cartRoute = require('./routes/cart.route')
const orderRoute = require('./routes/order.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use("/api/auth", authroutes)
app.use("/api/upload", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)






module.exports = app






