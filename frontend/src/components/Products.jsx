import React, { useEffect, useMemo, useState } from 'react'
import api from '../utils/Api'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import SkeletonCard from './Skeleton'
import { triggerCartUpdate } from '../utils/cartHelper'

const Products = ({ search = "" }) => {
    const Navigate = useNavigate()
    let location = useLocation()

    const [loading, setloading] = useState(false)
    const [Search, setSearch] = useSearchParams()

    const [totalPages, settotalPages] = useState(1)

    let category = Search.get("category") || "All"
    let page = Number(Search.get("page")) || 1
    let limit = 15

    const categories = ["All", "Perfumes", "Electronics", "Clothes", "Laptop", "Watches", "Boys", "Girls", "Fashion"]

    const [error, seterror] = useState("")
    const [success, setsuccess] = useState("")

    const [products, setproducts] = useState([])

    async function fetchdata() {
        let url = `http://localhost:3000/api/upload/getProducts?page=${page}&limit=${limit}`
        setloading(true)
        if (category && category !== "All") {
            url = `http://localhost:3000/api/upload/product?category=${category}&page=${page}&limit=10`
        }

        let res = await fetch(url)
        let data = await res.json()
        settotalPages(data.pages || 1)
        setproducts(data.products || data.filter?.category || []);
        setloading(false)
    }

    useEffect(() => {
        if (location.pathname === "/products" && category === "All") {
            setSearch({ category, page: page, limit })
        }
    }, [])

    const handleNext = () => {
        if (totalPages > page) {
            setSearch({ category, page: page + 1, limit })
            window.scrollTo(0, 0)
        }
    }
    const handlePrev = () => {
        if (page > 1) {
            setSearch({ category, page: page - 1, limit })
            window.scrollTo(0, 0)
        }
    }

    useEffect(() => {
        fetchdata()
    }, [category, page])

    const addToCart = async (productId, e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const res = await api("/cart/add", {
                method: "POST",
                body: JSON.stringify({ productId })
            })
            triggerCartUpdate()
            setsuccess(res.message || "Product added to Cart")
        } catch (err) {
            seterror(err.message)
        }
        setTimeout(() => {
            seterror("")
            setsuccess("")
        }, 2000);
    }

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products
        return products.filter((p) => {
            return p.title.toLowerCase().includes(search.trim().toLowerCase())
        })
    }, [search, products])

    return (
        <div className='min-h-screen bg-gray-100 '>
            {error && <div className='fixed top-20 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm'>{error}</div>}
            {success && <div className='fixed top-20 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm'>{success}</div>}

            <div className='sticky top-0 z-40 bg-white border-b border-gray-200'>
                <div className='px-2 py-2'>
                    <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
                        {categories.map((c) => {
                            return <Link key={c} to={`/products?category=${c}&page=1&limit=10`}>
                                <div className={`px-3 py-1.5 whitespace-nowrap text-xs font-medium rounded-full transition
                                    ${category === c ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                    {c}
                                </div>
                            </Link>
                        })}
                    </div>
                </div>
            </div>

            <div className='px-2 py-3'>
                {loading ?
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                        {Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                    :
                    <>
                        {filteredProducts.length === 0 ?
                            <div className='overflow-x-hidden text-center py-20 text-gray-500'>
                                <p className='text-sm'>We're sorry <span className='text-accent font-semibold '>{search || category}</span> not found</p>
                            </div>
                            :
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                {filteredProducts.map((product) => {
                                    return <div
                                        key={product._id}
                                        onClick={() => { Navigate(`/product/${product._id}`) }}
                                        className='bg-white rounded-md overflow-hidden border border-gray-200 hover:shadow-md transition cursor-pointer'
                                    >
                                        <div className='w-full h-40 sm:h-44 md:h-48 bg-gray-200 overflow-hidden'>
                                            <img className='w-full h-full object-cover' src={product.uri} alt={product.title} />
                                        </div>

                                        <div className='p-2'>
                                            <h1 className='font-semibold text-xs sm:text-sm line-clamp-2 mb-1'>{product.title}</h1>
                                            <div className='text-xs line-clamp-2 text-gray-600'>{product.description}</div>
                                            <div className='flex items-center justify-between mt-1 mb-2'>
                                                <div className='text-red-600 font-bold text-sm sm:text-base'>Rs {product.price}</div>
                                            </div>

                                            <div className='flex gap-1.5'>
                                                <button
                                                    className='flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-2 text-xs font-semibold rounded transition'
                                                    onClick={(e) => { addToCart(product._id, e) }}
                                                >
                                                    Add
                                                </button>
                                                <Link
                                                    onClick={(e) => e.stopPropagation()}
                                                    to={`/product/${product._id}/buyNow`}
                                                    className='flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-2 text-xs font-semibold rounded text-center transition'
                                                >
                                                    Buy
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        }
                    </>
                }

                {location.pathname === "/products" &&
                    <div className='flex bg-white border-gray-200 rounded-md justify-center items-center gap-4 py-3 mt-6'>
                        <button
                            disabled={page === 1}
                            className={`px-4 py-1.5 rounded text-sm font-semibold ${page === 1 ? 'bg-gray-300 text-gray-500' : 'bg-orange-500 text-white'}`}
                            onClick={() => { handlePrev() }}
                        >
                            Prev
                        </button>
                        <div className='font-semibold text-sm'>Page <span className='text-orange-500'>{page}</span>/{totalPages}</div>
                        <button
                            disabled={page >= totalPages}
                            className={`px-4 py-1.5 rounded text-sm font-semibold ${page >= totalPages ? 'bg-gray-300 text-gray-500' : 'bg-orange-500 text-white'}`}
                            onClick={() => { handleNext() }}
                        >
                            Next
                        </button>
                    </div>
                }
                {location.pathname === "/" && <div className='flex justify-center mt-6'>
                    <Link to="/products" className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition'>
                        View All Products </Link>  </div>}
            </div>
        </div>
    )
}

export default Products