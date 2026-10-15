import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import FoodPic from '../assets/food12.jpeg'
import { FaBoxOpen, FaSearch } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import pic from '../assets/pro.png'
import { FaShoppingCart } from 'react-icons/fa';
import Spinner from '../components/Spinner'

const Products = lazy(() => import("../components/Products"))
const Page1th = () => {
    const [search, setsearch] = useState("")
    const [Active, setActive] = useState(null)
    useEffect(() => {
        let user = localStorage.getItem("user")
        if (user) setActive(JSON.parse(user))
    }, [])

   
    return (
        <div className='min-h-screen'>

            <div className=' '>
                <div className='lg:flex justify-between py-4 px-2 lg:px-10 border-zinc-300  '>
                    <h1 className='md:text-4xl text-3xl  text-zinc-900 font-medium flex items-center'>Products <FaBoxOpen className='ml-2 mt-2' /></h1>
                    <div className='bg-zinc-200 rounded-3xl  overflow-hidden border border-zinc-800  flex lg:w-[500px] w-[60%] mt-2   lg:h-12 md:mb-2'>
                        <input value={search} onChange={(e) => {
                            setsearch(e.target.value)
                        }} type="text" placeholder='Search' className=' py-1  px-5 w-full outline-none ' />
                        <button className='flex justify-center bg-zinc-100 items-center  gap-2  py-2 px-2 md:px-4 text-black lg:w-[15%] w-1/5   '> <FaSearch /></button>
                    </div>

                    {Active?.role === "admin" &&
                        <Link to="/admin/dashboard">
                            <button className='bg-orange-500 text-gray-100 px-5 py-2 rounded hidden md:block hover:bg-primary'>
                                Admin Panel
                            </button>
                        </Link>
                    }
                </div>

                <div >
                    <Suspense fallback={<Spinner />}>
                        <Products search={search} />
                    </Suspense>
                </div>

            </div>


        </div>
    )
}

export default Page1th