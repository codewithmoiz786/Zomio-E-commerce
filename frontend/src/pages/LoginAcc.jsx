import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import api from '../utils/Api'
import GoogleBtn from '../components/GoogleBtn'

const Account = () => {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({ email: "", password: "" })

    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        setSuccess("")
        setError("")
        if (!form.email) {
            setLoading(false)
            return setError("Please Enter email Address")
        }
        if (!form.password) {
            setLoading(false)
            return setError("Please Enter your Password")
        }
        try {
            let data = await api("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })



            setSuccess(data.message)

            if (data.user.isVerified) {
                localStorage.removeItem("pendingEmail")
                localStorage.setItem("accessToken", data.accessToken)
                localStorage.setItem("user", JSON.stringify(data.user))

                return navigate(data.user.role === "admin" ? "/admin/dashboard" : "/")
            }

            if (data.user.isVerified === false) {
                localStorage.setItem("pendingEmail", form.email)
                localStorage.setItem("expiresIn", data.user.expiresIn)
                navigate("/verify-email")
                return
            }
            else if (data.user.role === "admin") {
                navigate("/admin/dashboard")
            }
        } catch (err) {
            if (err.message === "Email not verified. New OTP sent to your email" || err.message === "OTP Already sent to your email. Please verify your email address") {
                setError(err.message || "Please verify your email address to login")
                localStorage.setItem("expiresIn", err.expiresIn)
                localStorage.setItem("pendingEmail", form.email)

                setTimeout(() => {
                    navigate("/verify-email")
                }, 1000);
                return
            }
            setError(err.message || "Server error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            {error && <div className='fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50'>{error}</div>}
            {success && <div className='fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50'>{success} ✅</div>}

            <div className='px-6 py-5'>
                <Link className='bg-gray-800 hover:bg-gray-900 text-sm md:text-base py-2 px-6 text-gray-200 rounded-lg transition' to="/">← Back to Home</Link>
            </div>

            <div className='flex-1 flex justify-center items-center px-4'>
                <form onSubmit={handleLogin} className='w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border-gray-200'>
                    <h1 className='text-3xl font-bold text-center mb-6'>Welcome Back</h1>

                    <label className='text-gray-600 text-sm font-medium'>Email</label>
                    <input
                        className='w-full border border-gray-300 rounded-lg outline-none py-2.5 px-3 mb-4 text-base focus:ring-2 focus:ring-accent'
                        type="email"
                        placeholder='Enter your email'
                        value={form.email}
                        onChange={(e) => { setForm({ ...form, email: e.target.value }) }}
                    />

                    <label className='text-gray-600 text-sm  font-medium'>Password</label>
                    <input
                        className='w-full border-gray-300 border rounded-lg outline-none py-2.5 px-3 mb-4 text-base focus:ring-2 focus:ring-accent'
                        type="password"
                        placeholder='Enter your password'
                        value={form.password}
                        autoComplete='current-password'
                        onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                    />

                    <p className='text-sm text-gray-600 mb-4'>
                        Don't have an account? <Link to="/signUp" className='text-accent font-semibold hover:underline'>Sign Up</Link>
                    </p>

                    <button
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-accent hover:bg-primary'}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <div className='mt-2  gap-2'>
                        <div className='text-center text-zinc-600 mb-1 '>or</div>
                        <GoogleBtn />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Account