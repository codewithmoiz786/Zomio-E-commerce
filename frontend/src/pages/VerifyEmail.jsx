import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../utils/Api'
const VerifyEmail = () => {
    const [loading, setloading] = useState(false)
    let navigate = useNavigate()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [email, setemail] = useState("")
    const [otp, setotp] = useState("")
    const [timer, settimer] = useState(localStorage.getItem("expiresIn") ? Math.floor(parseInt(localStorage.getItem("expiresIn")) - Date.now()) / 1000 : 0)

    useEffect(() => {
        let interval = setInterval(() => {
            settimer((prev) => {
                if (prev <= 0) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000);
        return () => clearInterval(interval)
    }, [])
    const minutes = Math.floor(timer / 60)
    let seconds = Math.floor(timer % 60)
    seconds = seconds < 10 ? `0${seconds}` : seconds

    const maskEmail = (email) => {
        if (!email) return ""
        let [name, domain] = email.split("@")
        let visible = name.length > 2 ? name.slice(0, 2) : name
        visible += `***${name[name.length - 1]}`
        return `${visible}@${domain}`
    }
    useEffect(() => {
        let email = localStorage.getItem("pendingEmail")
        if (!email) {
            navigate("/signUp")
            return
        }
        setemail(email)
    }, [navigate])

    const handleOTP = (e) => {
        setError("")
        const value = e.target.value.replace(/[^0-9]/g, "")
        setotp(value)
    }
    const handleResend = async () => {
        try {
            setError("")
            let res = await api("/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })
            setSuccess(res.message || "OTP resent successfully")
            localStorage.setItem("expiresIn", res.expiresIn)
            settimer(Math.floor(parseInt(res.expiresIn) - Date.now()) / 1000)
        } catch (error) {
            setError(error.message || "Server error")
        } 
    }
    const handleVerify = async (e) => {
        try {
            e.preventDefault()
            setloading(true)
            setError("")
            if (!otp) {
                setloading(false)
                return setError("Please enter OTP")
            }
            let res = await api("/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            })
            localStorage.removeItem("pendingEmail")
            localStorage.setItem("accessToken", res.accessToken)
            localStorage.setItem("user", JSON.stringify(res.user))
            setSuccess(res.message || "Email verified successfully")
            setTimeout(() => {
                navigate("/")
            }, 1000)
        } catch (error) {
            setError(error.message || "Server error")
        } finally {
            setloading(false)
        }
    }


    return (
        <div className='w-full min-h-screen bg-[#ececec] flex justify-center items-center px-4'>
            {success && <div className='fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50'>{success} ✅</div>}
            {error && <div className='fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm md:text-base'>{error}</div>}
            <div className='bg-white w-full max-w-sm rounded-lg shadow-md p-6'>

                {/* Header */}
                <h1 className='text-center text-2xl font-bold text-[#f85606] mb-2'>
                    Verify Your Email
                </h1>

                <p className='text-center text-gray-600 text-sm mb-4'>
                    Enter the 6-digit code sent to
                </p>

                {/* Email Box */}
                <div className='bg-[#fff4f0] border-[#f85606] rounded-md p-3 mb-5 text-center'>
                    <p className='text-xs text-gray-600'>Code sent to</p>
                    <p className='font-bold text-black text-base'>{maskEmail(email)}</p>
                </div>

                <form className='flex flex-col gap-4' onSubmit={handleVerify}>
                    {/* OTP Input */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            OTP Code
                        </label>
                        <input
                            type="text"
                            inputMode='numeric'
                            pattern='[0-9]*'
                            maxLength={6}
                            onChange={(e) => {
                                handleOTP(e)
                            }}
                            value={otp}

                            className='w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f85606] focus:border-[#f85606] tracking-[10px] text-center text-2xl font-bold'
                            placeholder='- - - - - -'
                        />
                    </div>

                    {/* Verify Button */}
                    <button
                        className='rounded bg-accent hover:bg-primary p-3 text-white font-bold transition duration-200'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? "VERIFYING..." : "VERIFY EMAIL"}
                    </button>
                </form>

                {/* Resend */}
                <div className='flex justify-center items-center gap-1 text-sm mt-6'>
                    <span className='text-gray-600'>Didn't get code?</span>
                    <button
                        className='text-[#f85606] font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline'
                        onClick={handleResend}
                        disabled={loading || timer > 0}
                    >
                        Resend
                    </button>
                </div>

                <p className='text-center text-xs mt-3 text-gray-500'>
                    Code expires in {minutes}:{seconds}
                </p>
            </div>
        </div>
    )
}

export default VerifyEmail