import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/Api'
import { FaGoogle, FaHome } from 'react-icons/fa'
import GoogleBtn from '../components/GoogleBtn'
import { useEffect } from 'react'
const Account = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [form, setForm] = useState({ name: "", email: "", password: "" })

    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError("")
        setSuccess("")

        if (!form.email || !form.name || !form.password) {
            setLoading(false)
            return setError("Please fill all fields")
        }
        if (form.name.length < 3) {
            setLoading(false)
            return setError("Name must be at least 3 characters")
        }
        if (form.password.length < 6) {
            setLoading(false)
            return setError("Password must be at least 6 characters")
        }

        try {
            let data = await api("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })

            setSuccess(data.message)

            localStorage.setItem("pendingEmail", form.email)
            localStorage.setItem("expiresIn", data.user?.expiresIn)
            navigate("/verify-email")
        } catch (err) {
            setError(err.message)


        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            {success && <div className='fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50'>{success} ✅</div>}
            {error && <div className='fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm md:text-base'>{error}</div>}

            <div className='px-6 py-5'>
                <Link className='bg-gray-800 hover:bg-gray-900 text-sm md:text-base py-2 px-6 text-gray-200 rounded-lg transition' to="/">← Back to Home</Link>
            </div>

            <div className='flex-1 flex justify-center items-center px-4'>
                <form onSubmit={handleSignUp} className='w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-200'>
                    <h1 className='text-3xl font-bold text-center mb-6'>Create Account</h1>

                    <label className='text-gray-600 text-sm font-medium'>Name</label>
                    <input
                        className='w-full border-gray-300 border rounded-lg outline-none py-2.5 px-3 mb-4 text-base focus:ring-2 focus:ring-accent'
                        type="text"
                        placeholder='Enter your name'
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value }, setError(""))}
                    />

                    <label className='text-gray-600 text-sm font-medium'>Email</label>
                    <input
                        className='w-full border border-gray-300 rounded-lg outline-none py-2.5 px-3 mb-4 text-base focus:ring-2 focus:ring-accent'
                        type="email"
                        placeholder='Enter your email'
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value }, setError(""))}
                    />

                    <label className='text-gray-600 text-sm font-medium'>Password</label>
                    <input
                        className='w-full border-gray-300 border rounded-lg outline-none py-2.5 px-3 mb-4 text-base focus:ring-2 focus:ring-accent'
                        type="password"
                        placeholder='Min 6 characters'
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value }, setError(""))}
                    />

                    <p className='text-sm text-gray-600 mb-4'>
                        Already have an account? <Link to="/login" className='text-accent font-semibold hover:underline'>Login</Link>
                    </p>

                    <button
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-accent hover:bg-primary'}`}
                    >
                        {loading ? "Creating Account..." : "Create my account"}
                    </button>
                    <div className='flex flex-col items-center mt-2'>
                        <h3 className='text-zinc-600 text-base mb-1'>or</h3>
                        <GoogleBtn />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Account