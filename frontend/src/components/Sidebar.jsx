import React, { useState } from 'react'
import logo from '../assets/logo.png'
import admin from '../assets/admin.png'
import {
    FaHome,
    FaPlus,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaSignOutAlt,
    FaBars,    
    FaTimes    
} from 'react-icons/fa'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/Api'

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [menu, setMenu] = useState(false)
    const [logout, setlogout] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()


    const menuItems = [
        { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { id: 'add', path: '/admin/add-product', label: 'Add Product', icon: <FaPlus /> },
        { id: 'products', path: '/admin/products', label: 'All Products', icon: <FaBox /> },
        { id: 'orders', path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart /> },
        { id: 'customers', path: '/admin/customers', label: 'Customers', icon: <FaUsers /> },
    ]
    const handleLogout = async () => {
        let res = await api("/auth/logout", {
            method: "GET"
        })
        localStorage.clear()
        navigate("/login")
    }
    return (
        <>
            {/* MOBILE TOP BAR */}
            {!menu &&
                <div className=' md:hidden z-50 fixed top-0 left-0 w-full bg-white border-b border-zinc-200 px-4 py-4 mb-10 flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <img className='w-8 h-8 rounded' src={logo} alt="Zomio" />
                        <h1 className='text-xl font-bold text-[#F85606]'>Zomio Admin</h1>
                    </div>
                    <FaBars size={22} onClick={() => setMenu(true)} className='cursor-pointer' />
                </div>
            }

            {/* OVERLAY */}
            {menu && <div className='fixed inset-0 bg-black/40 z-40 md:hidden' onClick={() => setMenu(false)}></div>}

            {/* SIDEBAR */}
            <div className={` fixed md:static top-0 right-0 h-screen bg-white z-50 w-64 p-4 border-r border-zinc-200 flex flex-col transition-transform duration-300
                ${menu ? "translate-x-0" : "-translate-x-[-100%]"} md:translate-x-0`}>

                {/* Logo + Close */}
                <div className='flex gap-3 items-center px-2 mb-6 justify-between'>
                    <div className='flex gap-3 items-center'>
                        <img className='w-10 h-10 rounded object-cover' src={logo} alt="Zomio" />
                        <h1 className='text-2xl font-bold text-[#F85606]'>Zomio</h1>
                    </div>
                    <FaTimes size={20} className='md:hidden cursor-pointer' onClick={() => setMenu(false)} />
                </div>

                {/* Admin Profile */}
                <div className='mb-6 flex gap-3 items-center p-3 bg-[#FFF1EC] rounded-xl border-[#FFE0D1]'>
                    <img className='h-12 w-12 rounded-full object-cover object-top' src={admin} alt="Admin" />
                    <div>
                        <h2 className='text-[15px] font-semibold text-gray-900'>AbdulMoiz</h2>
                        <h2 className='text-xs text-gray-500'>Admin</h2>
                    </div>
                </div>

                {/* Menu */}
                <div className='flex flex-col gap-1 flex-1'>
                    {menuItems.map(item => (
                        <Link
                            to={item.path}
                            onClick={() => setMenu(false)}
                            key={item.id}
                            className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-left transition-all duration-200 
                            ${location.pathname === item.path
                                    ? 'bg-[#F85606] text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-zinc-100 hover:text-[#F85606]'}`}
                        >
                            <span className='text-lg'>{item.icon}</span>
                            <span className='font-medium'>{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <button onClick={() => { setlogout(true) }} className='flex items-center gap-3 py-2.5 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-2'>
                    <FaSignOutAlt />
                    <span className='font-medium' >Logout</span>
                </button>
            </div>
            {logout && <div className='z-[100] absolute flex items-center justify-center  w-full h-screen'>
                <div className='bg-zinc-100 h-44 w-72 flex items-center justify-center flex-col rounded-lg'>
                    <p className='text-gray-600'>Are you sure to logout ? </p>
                    <div className='gap-4 flex'>
                        <button className='bg-zinc-300 border hover:bg-gray-200 text-gray-600 px-8 py-1 rounded mt-10' onClick={() => { setlogout(false) }}>Cancel</button>
                        <button className='bg-red-500 hover:bg-red-600 text-border px-8 py-1 rounded mt-10' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Sidebar