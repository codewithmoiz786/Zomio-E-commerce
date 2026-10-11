import React from 'react'
import { FaGoogle } from 'react-icons/fa'

const GoogleBtn = () => {
    return (
        <button type='button' className="w-full flex items-center justify-center gap-2 p-2.5 border rounded-lg bg-zinc-200 hover:bg-zinc-300 transition">
            <FaGoogle className="text-red-500" />
            Continue with Google
        </button>)
}

export default GoogleBtn