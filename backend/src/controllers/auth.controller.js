const userModel = require('../models/auth.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sessionModel = require('../models/session.model')
const multer = require('multer')
const { sendEmail } = require('../services/email.service')

// Register -> Verify OTP ~/ -> resendOTP -> Login -> Get Token
function getOTP() {
    return String(Math.floor(100000 + Math.random() * 900000))
}

async function register(req, res) {
    try {

        const { name, email, password } = req.body;

        let userAlreadyExist = await userModel.findOne({ email })
        if (userAlreadyExist) {
            return res.status(409).json({
                message: "user Already Exist please login"
            })
        }
        let hash = await bcrypt.hash(password, 12)
        let otp = getOTP()

        let otpExpire = Date.now() + 10 * 60 * 1000  //10 m
        let user = await userModel.create({
            name,
            email,
            password: hash,
            otp,
            otpExpire
        })
        try {
            await sendEmail(user.email, user.name, user.otp, user.otpExpire)
            return res.status(201).json({
                message: "User created successfully. Please Verify account  OTP sent to your email",
                user: {
                    name,
                    email,
                    expiresIn: otpExpire
                }
            })
        } catch (emailErr) {
            await userModel.findByIdAndDelete(user._id)
            return res.status(500).json({
                message: emailErr.message
            })
        }


    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }

}

async function login(req, res) {
    try {

        const { email, password } = req.body;

        let user = await userModel.findOne({ email }).select("+password +otp  +otpExpire")
        if (!user) {
            return res.status(401).json({
                message: "invalid email or password"
            })
        }

        let isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({
                message: "invalid email or password"
            })
        }

        if (!user.isVerified) {
            if (user.otpExpire > Date.now()) {
                return res.status(429).json({ message: "OTP Already sent to your email. Please verify your email address", expiresIn: user.otpExpire })
            }
            let otp = getOTP()
            let otpExpire = Date.now() + 10 * 60 * 1000
            user.otp = otp
            user.otpExpire = otpExpire
            await user.save()
            await sendEmail(user.email, user.name, user.otp, user.otpExpire)
            return res.status(403).json({
                message: "Email not verified. New OTP sent to your email",
                expiresIn: otpExpire
            })

        }

        const session = await sessionModel.create({
            user: user._id,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        let refreshToken = jwt.sign({ _id: user._id, sessionId: session._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
        let refreshTokenHash = await bcrypt.hash(refreshToken, 12)

        session.RefreshTokenHash = refreshTokenHash
        await session.save()
        let accessToken = jwt.sign({ _id: user._id, sessionId: session._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // local: false, deploy: true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // local: lax, deploy: none
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        let { password: _, ...userdata } = user.toObject()

        res.status(200).json({
            message: `${user.role} logged In successfully`,
            user: userdata,
            accessToken,

        })
    } catch (err) {
        res.status(500).json({
            message: err.message,

        })
    }

}

async function verifyOtp(req, res) {
    try {

        let { email, otp } = req.body
        let user = await userModel.findOne({ email }).select("+otp +otpExpire")
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }
        if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                message: "OTP Expired"
            })
        }
        user.isVerified = true
        user.otp = undefined
        user.otpExpire = undefined
        await user.save()
        let session = await sessionModel.create({
            user: user._id,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        let accessToken = jwt.sign({ _id: user._id, sessionId: session._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" })

        let refreshToken = jwt.sign({ _id: user._id, sessionId: session._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        let refreshTokenHash = await bcrypt.hash(refreshToken, 12)
        session.RefreshTokenHash = refreshTokenHash
        await session.save()


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // local: false, deploy: true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // local: lax, deploy: none
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        let { password: _, ...userdata } = user.toObject()
        return res.status(200).json({
            message: "User verified successfully",
            accessToken,
            user: userdata
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

async function resendOTP(req, res) {
    try {

        let { email } = req.body
        if (!email) {
            return res.status(401).json({
                message: "Please enter email first"
            })
        }
        let user = await userModel.findOne({ email }).select("+otp +otpExpire")
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.isVerified) {
            return res.status(401).json({
                message: "User Already Verifred please Login"
            })
        }
        let otp = getOTP()
        let otpExpire = Date.now() + 10 * 60 * 1000

        user.otp = otp
        user.otpExpire = otpExpire
        await user.save()
        await sendEmail(user.email, user.name, user.otp, user.otpExpire)
        res.status(200).json({
            message: "OTP resend successfully",
            expiresIn: otpExpire
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

async function getMe(req, res) {
    try {

        let accessToken = req.headers.authorization?.split(" ")[1]
        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        let valid = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)

        let user = await userModel.findById(valid._id)
        res.status(200).json({
            message: "User feched successfuly",
            user
        })

    } catch (err) {
        res.status(401).json({
            message: "Invalid or expired token"
        })
    }

}

async function RefreshToken(req, res) {
    try {
        let refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "token not found"
            })
        }
        let decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)

        let session = await sessionModel.findOne({ _id: decoded.sessionId, revoked: false })
        if (!session) return res.status(401).json({ message: "Session not found" })

        let valid = await bcrypt.compare(refreshToken, session.RefreshTokenHash)
        if (!valid) return res.status(401).json({ message: "Invalid Refresh Token" });
        let user = await userModel.findById(decoded._id)
        let newAccessToken = jwt.sign({ _id: decoded._id, sessionId: session._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" })

        let newRefreshToken = jwt.sign({ _id: decoded._id, sessionId: session._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        let newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12)
        session.RefreshTokenHash = newRefreshTokenHash
        await session.save()
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // local: false, deploy: true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // local: lax, deploy: none
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "newAccess Token created successfulyy",
            accessToken: newAccessToken
        })

    } catch (err) {
        res.status(401).json({
            message: "inavlid or not found refresh token"
        })
    }
}

async function logout(req, res) {
    try {

        let refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            let decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
            await sessionModel.findByIdAndUpdate(decoded.sessionId, { revoked: true })
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // local: false, deploy: true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // local: lax, deploy: none
        })
        res.status(200).json({ message: "Logged out successfully" })

    } catch (err) {
        res.clearCookie("refreshToken")
        res.status(200).json({ message: "Logged out successfully" })
    }

}

async function logoutAll(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        let decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)

        let all = await sessionModel.updateMany({ user: decoded._id }, { revoked: true })

        res.clearCookie("refreshToken")
        res.status(200).json({
            message: "Logged out all successfully"
        })
    } catch (err) {
        res.status(200).json({
            message: err.message
        })
    }
}

async function getAllUsers(req, res) {
    try {

        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 10
        let skip = (page - 1) * limit
        let allUsers = await userModel.find({ role: "user" })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })


        if (allUsers.length === 0) {
            return res.status(404).json({
                message: "We don't have any user"
            })
        }
        let totalUsersLength = await userModel.countDocuments({ role: "user" })

        res.status(200).json({
            message: "Users fetched successfully",
            allUsers,
            page,
            pages: Math.ceil(totalUsersLength / limit)

        })

    } catch (error) {
        res.status(500).json({
            message: error.message

        })

    }

}

module.exports = { register, login, getMe, RefreshToken, logout, logoutAll, getAllUsers, verifyOtp, resendOTP }