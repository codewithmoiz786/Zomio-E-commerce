import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCross, FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import myimg from '../assets/me.png'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className='bg-orange-100 text-zinc-700 mt-16 border-t border-zinc-200'>
            <div className='max-w-7xl mx-auto px-4 py-12'>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-8'>

                    {/* 1. Brand */}
                    <div className='col-span-2 md:col-span-1'>
                        <h2 className='text-3xl font-bold text-gray-900 mb-3'>Zomio</h2>
                        <p className='text-sm text-primary-dark'>
                            Shop the latest products at the best prices. Fast delivery and quality guaranteed.
                        </p>
                        <p className='text-xs mt-4 text-primary'>Built by <span className='text-gray-900 font-semibold'>AbdulMoiz</span></p>

                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h3 className='text-gray-900 font-semibold mb-4'>Quick Links</h3>
                        <ul className='space-y-2 text-sm'>
                            <li><Link to="/" className='hover:text-gray-900 transition'>Home</Link></li>
                            <li><Link to="/products" className='hover:text-gray-900 transition'>All Products</Link></li>
                            <li><Link to="/YourCart" className='hover:text-gray-900 transition'>Your Cart</Link></li>
                            <li><Link to="/myOrders" className='hover:text-gray-900 transition'>My Orders</Link></li>
                            <li><Link to="/about" className='hover:text-gray-900 transition'>About Us</Link></li>
                        </ul>
                    </div>


                    {/* 4. About Developer */}
                    <div>
                        <h3 className='text-gray-900 font-semibold mb-4'>About</h3>
                        <img className=' w-10 rounded-full h-10 object-left-top object-cover' src={myimg} alt="" />
                        <p className='text-sm mb-3'>Developed by AbdulMoiz</p>
                        <h1 className='mb-2 font-semibold'>Tech Stack</h1>
                        <div className='flex flex-wrap gap-2'>
                            {["React", "Tailwind css", "Node.js", "MongoDB", "Express Js"].map(skill => (
                                <span key={skill} className='bg-orange-400 text-xs px-2 py-1 rounded text-gray-100'>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className='border-t border-zinc-200 mt-10 pt-6 flex-col md:flex-row justify-between items-center text-sm text-gray-500'>
                    <p>© {year} Zomio. All rights reserved.</p>
                    <div className='flex gap-4 mt-3 md:mt-0'>
                        <Link to="/privacy" className='hover:text-gray-900'>Privacy Policy</Link>
                        <Link to="/terms" className='hover:text-gray-900'>Terms</Link>
                    </div>
                </div>
                <div >
                    <div className='flex justify-center gap-10 mt-3'>
                        <FaFacebook size={30} />
                        <FaYoutube size={30} />
                        <FaInstagram size={30} />
                        <FaTwitter size={30} />
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer