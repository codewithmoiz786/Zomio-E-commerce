import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaList, FaStore } from "react-icons/fa";
import logo from '../assets/logo.png'
import api from '../utils/Api'

const Navbar = () => {
    const [carts, setCarts] = useState([])
    const navigate = useNavigate()
    const [mess, setMess] = useState("")
    const [active, setActive] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [menu, setMenu] = useState(false) 
    const [confirm, setConfirm] = useState(false)
    const location = useLocation()
    const { pathname } = location;

    const [show, setshow] = useState(true)
    const [lastScroll, setlastScroll] = useState(0)

    useEffect(() => {
        const controller = () => {
            if (window.scrollY > lastScroll && window.scrollY > 80) {
                setshow(false)
            } else {
                setshow(true)
            }
            setlastScroll(window.scrollY)
        }
        window.addEventListener("scroll", controller)
        return () => window.removeEventListener("scroll", controller)
    }, [lastScroll])

    // Get user
    useEffect(() => {
        let user = localStorage.getItem("user")
        if (!user) return setActive(null)
        setActive(JSON.parse(user))
    }, [])

    const handleLogout = async () => {
        setMess("")
        const res = await api("/auth/logout", { method: "GET" })
        localStorage.clear()
        setMess(res.message)
        setActive(null)
        setShowPopup(false)
        setConfirm(false)
        setMenu(false)
        navigate("/login", { replace: true })
    }

    // Get cart
    useEffect(() => {
        const get = async () => {
            if (!active) return
            const res = await api("/cart/get", { method: "GET" })
            setCarts(res.allCarts)
        }
        get()
        window.addEventListener("cartUpdated", get)
        return () => window.removeEventListener("cartUpdated", get)
    }, [active])

    const isLinkActive = (loc) => pathname === loc
    const baseClass = "flex items-center gap-3 p-3 rounded-lg hover:bg-[#FFF1EC] transition";
    const activeClass = "bg-[#FFF1EC] text-[#F85606] font-semibold";

    return (
        <>
            <div className={`z-50 border-b border-zinc-200 flex justify-between lg:px-14 px-3 py-3 lg:py-4 items-center fixed w-full bg-white shadow-sm transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}>
                {mess && <div className='absolute top-16 right-3 rounded-lg py-2 px-4 bg-green-100 text-green-800 text-sm'>{mess}</div>}

                {/* Logo */}
                <div className='flex items-center gap-2'>
                    <img className='w-9 h-9 rounded-full' src={logo} alt="Zomio" />
                    <h2 className='text-2xl lg:text-3xl text-[#F85606] font-bold'>Zomio</h2>
                </div>

                {/* Desktop Menu */}
                <div className='hidden lg:flex gap-8 text-sm items-center'>
                    <Link to="/" className={isLinkActive("/") ? "text-[#F85606] border-b-2 border-[#F85606] pb-1" : "pb-1 hover:text-[#F85606]"}>Home</Link>
                    <Link to="/about" className={isLinkActive("/about") ? "text-[#F85606] border-b-2 border-[#F85606] pb-1" : "pb-1 hover:text-[#F85606]"}>About</Link>
                    <Link to="/products" className={isLinkActive("/products") ? "text-[#F85606] border-b-2 border-[#F85606] pb-1" : "pb-1 hover:text-[#F85606]"}>Products</Link>
                    <Link to="/myOrders" className={isLinkActive("/myOrders") ? "text-[#F85606] border-b-2 border-[#F85606] pb-1" : "pb-1 hover:text-[#F85606]"}>My Orders</Link>

                    <Link to="/YourCart" className='relative'>
                        <span className={`absolute -top-2 -right-2 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ${isLinkActive("/YourCart") ? "bg-[#F85606]" : "bg-[#d75c1e]"}`}>
                            {carts.length}
                        </span>
                        <FaShoppingCart size={22} className={isLinkActive("/YourCart") ? "text-[#be4a10]" : ""} />
                    </Link>
                </div>

                {/* Right Side */}
                <div className='flex items-center gap-3'>
                    <div className='lg:hidden flex items-center gap-4 relative'>
                        <Link to="/YourCart" className='relative'>
                            <span className={`absolute -top-1 -right-1 text-white    text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ${isLinkActive("/YourCart") ? "bg-[#F85606]" : "bg-[#de6020]"}`}>
                                {carts.length}
                            </span>
                            <FaShoppingCart size={22} className={isLinkActive("/YourCart") ? "text-[#9c3e0f]" : "text-[#290e01]"} />
                        </Link>
                        <FaBars size={22} onClick={() => setMenu(true)} className='cursor-pointer' />
                    </div>

                    {active ? (
                        <div className='hidden lg:flex gap-3 items-center'>
                            <span className='text-sm'>Hi, <b>{active.name.split(" ")[0]}</b> 👋</span>
                            <button onClick={() => setShowPopup(true)} className='bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm'>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className='hidden lg:block'>
                            <button className='bg-[#F85606] hover:bg-[#e14b05] text-white px-6 py-2 rounded-md text-sm font-medium'>Login</button>
                        </Link>
                    )}
                </div>

                {/* Logout Popup */}
                {showPopup && active && (
                    <div className='absolute -translate-x-1/2 translate-y-[150px] top-1/2 left-1/2 bg-white rounded-xl w-80 p-5 shadow-2xl z-[60]'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='font-bold text-lg'>Logout</h2>
                            <FaTimes size={18} onClick={() => setShowPopup(false)} className='cursor-pointer' />
                        </div>
                        <p className='text-gray-600'>Are you sure to logout from {active.name}?</p>
                        <button onClick={handleLogout} className='mt-5 w-full bg-red-500 py-2 rounded-md text-white font-medium'>Logout</button>
                    </div>
                )}
            </div>

            <div className='fixed inset-0 z-40 lg:hidden pointer-events-none'>
                {/* Overlay with fade */}
                <div
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setMenu(false)}
                ></div>

                {/* Sidebar with slide */}
                <div className={`
                    absolute top-0 right-0
                    h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl p-5 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${menu ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
                `}>
                    <div className='flex justify-between items-center border-b pb-4'>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full' src={logo} alt="Zomio" />
                            <h2 className='text-xl font-bold text-[#F85606]'>Zomio</h2>
                        </div>
                        <FaTimes size={22} onClick={() => setMenu(false)} className='cursor-pointer' />
                    </div>

                    {/* Menu Links */}
                    <div className='flex-1 py-6 flex flex-col gap-1'>
                        <Link to="/" onClick={() => setMenu(false)} className={`${baseClass} ${isLinkActive("/") ? activeClass : ""}`}><FaHome /> Home</Link>
                        <Link to="/products" onClick={() => setMenu(false)} className={`${baseClass} ${isLinkActive("/products") ? activeClass : ""}`}><FaStore /> Products</Link>
                        <Link to="/myOrders" onClick={() => setMenu(false)} className={`${baseClass} ${isLinkActive("/myOrders") ? activeClass : ""}`}><FaList /> My Orders</Link>
                        <Link to="/about" onClick={() => setMenu(false)} className={`${baseClass} ${isLinkActive("/about") ? activeClass : ""}`}><FaInfoCircle /> About</Link>
                    </div>

                    {/* User Info */}
                    <div className='border-t pt-4'>
                        {active ? (
                            <>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='bg-[#FFF1EC] p-2 rounded-full'><FaUser /></div>
                                    <div>
                                        <p className='font-semibold'>{active.name}</p>
                                        <p className='text-xs text-gray-500'>{active.email}</p>
                                    </div>
                                </div>
                                {active.role === "admin" &&
                                    <Link to="/admin/dashboard" onClick={() => setMenu(false)}>
                                        <button className='w-full mb-3 bg-[#F85606] text-white py-2 rounded-md'>Admin Panel</button>
                                    </Link>
                                }
                                <button onClick={() => setConfirm(true)} className='w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md'>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setMenu(false)}>
                                <button className='w-full bg-[#F85606] text-white py-2 rounded-md'>Login</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Logout */}
            {confirm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl w-80 p-5'>
                        <h2 className='font-bold text-lg mb-2'>Confirm Logout</h2>
                        <p className='text-gray-600 text-sm mb-4'>Are you sure you want to logout?</p>
                        <div className='flex gap-2'>
                            <button onClick={() => setConfirm(false)} className='flex-1 border py-2 rounded-md'>Cancel</button>
                            <button onClick={handleLogout} className='flex-1 bg-red-500 text-white py-2 rounded-md'>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar