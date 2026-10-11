const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Zomio_Email,
        pass: process.env.APP_PASSWORD
    }
})

const sendEmail = async function (email, name, otp, otpExpire) {
    const timeLeftfnc = (otpExpire) => {
        let diff = otpExpire - Date.now()
        let minutes = Math.floor(diff / 1000 / 60)
        return minutes > 0 ? `${minutes} minutes` : "Expired"
    }
    let timeLeft = timeLeftfnc(otpExpire)
    let mailOptions = {
        from: process.env.Zomio_Email,
        to: email,
        subject: "Zomio - Verify your OTP",
        html: `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; background-color: #FFF5F1; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(90deg, #F85606 0%, #FF8C42 100%); color: white; text-align: center; padding: 25px 20px; }
            .header h1 { margin: 0; font-size: 26px; font-weight: bold; }
            .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 30px 25px; color: #333333; text-align: center; }
            .content h2 { color: #F85606; margin-bottom: 15px; }
            .otp-box { background-color: #FFF5F1; border: 2px dashed #F85606; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #F85606; }
            .badge { display: inline-block; background: #F85606; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 15px; }
            .note { font-size: 13px; color: #777; margin-top: 20px; }
            .footer { background-color: #f8f8f8; text-align: center; padding: 20px; font-size: 12px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛒 Zomio</h1>
                <p>Deals Like Daraz | Fast Delivery Like Zomato</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Please use the OTP below to verify your Zomio account</p>
                
                <div class="otp-box">${otp}</div>

                <p>This OTP will expire in ${timeLeft}</p>
                
                <span class="badge">Ecommerce Platform</span>

                <p class="note">If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>©${new Date().getFullYear()} Zomio Ecommerce. All Rights Reserved.</p>
                <p>Shopping Made Easy</p>
            </div>
        </div>
    </body>
    </html>
    `
    }
    try {
        await transporter.sendMail(mailOptions)
        return true
    } catch (error) {
      throw new Error("Fail to send OTP email")
        return false
    }
}

module.exports = { sendEmail }