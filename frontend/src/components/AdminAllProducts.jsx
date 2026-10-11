import React, { useEffect, useState } from 'react'
import api from '../utils/Api'
import { Link } from 'react-router-dom'
import SkeletonCard from './Skeleton'

const AdminAllProducts = () => {
    const [error, seterror] = useState("")
    const [success, setsuccess] = useState("")
    const [products, setproducts] = useState([])
    const [confirm, setconfirm] = useState(null)
    const [loading, setloading] = useState(false)

    async function fetchdata() {
        try {
            setloading(true)
            let res = await fetch("http://localhost:3000/api/upload/getProducts")
            let data = await res.json()
            setproducts(data.products.reverse())

        } catch (error) {
            console.log(error.message);
        } finally {
            setloading(false)
        }
    }
    async function deleteProduct(productId) {
        seterror("")
        setsuccess("")
        try {
            let res = await api("/upload/deleteProduct", {
                method: "DELETE",
                body: JSON.stringify({ productId })
            })
            setsuccess(res.message)
        } catch (err) {
            seterror(err.message)
        }
        fetchdata()
        setTimeout(() => {
            seterror("")
            setsuccess("")
        }, 1000);
    }
    useEffect(() => {
        fetchdata()
    }, [])


    return (
        <div>
            {error && (
                <div className='noti absolute right-0  top-2 bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded-lg'>
                    {error}
                </div>
            )}
            {success && (
                <div className='noti absolute right-0  top-2 bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded-lg'>
                    {success}
                </div>
            )}
            {confirm && <div className=' z-50 flex justify-center  flex-col gap-7 absolute left-1/2  top-1/2 bg-zinc-100 border border-orange-400  shadow-md px-4 py-3 h-44 rounded-lg translate-x-[-50%] translate-y-[-50%]'>
                <p className='absolute top-1 right-2 hover:cursor-pointer' onClick={() => { setconfirm(null) }}>✖</p>
                <p className='text-sm text-gray-700'>Are you sure to delete product</p>
                <button className='hover:bg-red-400 bg-red-500 text-gray-200 py-1 px-4 rounded-sm' onClick={() => {
                    deleteProduct(confirm)
                    setconfirm(null)
                }}>Confirm</button>
            </div>}
            <h1 className='md:text-3xl text-2xl px-10 mt-2 text-zinc-800 font-semibold mb-4'>All Products</h1>
            <div>
                <div className="h-full w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-3 grid-cols-2 md:gap-5 gap-2 ">
                    {loading ? Array(10).fill(null).map((_, i) => <SkeletonCard key={i} />) :
                        products.map((product, idx) => {
                            return <Link key={idx} to={`/product/${product._id}`}>
                                <div className=' relative w-full bg-zinc-100  h-full rounded-xl overflow-hidden  border-1 border-zinc-300 p-1'>
                                    <img className='w-full h-40 bg-gray-400 rounded object-cover ' src={product.uri} alt={product.title} />
                                    <h1 className='px-2  text-sm mt-2 font-[600] md:font-semibold' >{product.title}</h1>
                                    <p className='mx-2 mb-2 text-gray-600 text-sm line-clamp-2'>{product.description}</p>
                                    <div className='flex justify-between px-3 mb-2 mt-4'>
                                        <button className=' bg-red-400 hover:bg-red-500 text-zinc-100  md:py-1 px-2 text-sm rounded'
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setconfirm(product._id)
                                            }}>Delete</button>
                                        <div className='flex gap-3'>
                                            <div className='text-red-800 font-semibold text-sm'>Rs {product.price}</div>
                                        </div>
                                        <Link to={`/admin/editProduct/${product._id}`}> <button className='absolute text-sm text-zinc-100 hover:bg-zinc-600  bg-zinc-500 rounded  h-fit px-2 bottom-[48%] right-2 '>Edit</button></Link>
                                    </div>
                                </div>
                            </Link>
                        })
                    }
                    {products.length === 0 && !loading && <div className='text-zinc-500 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>Products not found</div>}

                </div>

            </div >
        </div>


    )
}

export default AdminAllProducts