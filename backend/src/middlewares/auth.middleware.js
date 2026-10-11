const jwt = require('jsonwebtoken')

async function admin(req, res, next) {
    let token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({
            message: "you must be login first"
        })
    }
    try {
        let isvalid = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!isvalid) {
            return res.status(401).json({
                message: "invalid token"
            })
        }
        if (isvalid.role !== "admin") {
            return res.status(401).json({
                message: "you don't have admin  access."
            })
        }
        req.user = isvalid
        next()

    } catch (err) {
        res.status(500).json({
            message: `Internal server error ${err.message}`
        })
    }

}
async function user(req, res, next) {
    let token = req.cookies.refreshToken
    if (!token) {
        return res.status(401).json({
            message: "You must be Login first"
        })
    }
    try {
        let user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (user.role !== "user") {
            return res.status(401).json({
                message: "Unauthorized You're not user"
            })
        }
        req.user = user;
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}




module.exports = { admin, user }