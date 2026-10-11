import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../utils/Api'
import { triggerCartUpdate } from '../utils/cartHelper'

const Detail = () => {
    let { id } = useParams()
    const [product, setproduct] = useState(null)
    const [loading, setloading] = useState(true)
    const Navigate = useNavigate()

    const [error, seterror] = useState("")
    const [success, setsuccess] = useState("")

    useEffect(() => {
        async function getDetailOfProduct() {
            try {
                setloading(true)
                let res = await api(`/upload/productDetails/${id}`, {
                    method: "GET"
                })
                setproduct(res.productById)
            } catch (err) {
                console.log(err.message);
            } finally {
                setloading(false)
            }
        }
        getDetailOfProduct()
    }, [id])

    const addToCart = async () => {
        try {
            const res = await api("/cart/add", {
                method: "POST",
                body: JSON.stringify({ productId: id })
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

    if (loading) return <div className='min-h-screen flex items-center justify-center text-gray-500'>Loading...</div>
    if (!product) return <div className='min-h-screen flex items-center justify-center text-gray-500'>Product not found</div>

    return (
        <div className='min-h-screen bg-gray-100'>
            {error && <div className='fixed top-20 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm'>{error}</div>}
            {success && <div className='fixed top-20 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm'>{success}</div>}

            <div className='max-w-7xl mx-auto px-2 py-4 lg:px-6 lg:py-6'>
                <div className='bg-white rounded-lg shadow-sm p-3 md:p-6'>
                    <div className='md:flex gap-6 lg:gap-10'>
                        {/* Image Section */}
                        <div className='w-full md:w-2/5 lg:w-1/2'>
                            <div className='aspect-square w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-200'>
                                <img className='w-full h-full object-cover' src={product.uri} alt={product.title} />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className='w-full md:w-3/5 lg:w-1/2 mt-4 md:mt-0'>
                            <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold mb-3'>{product.title}</h1>

                            <div className='text-red-600 font-bold text-2xl md:text-3xl mb-4'>
                                Rs {product.price}
                            </div>

                            <p className='text-gray-700 text-sm md:text-base leading-relaxed mb-6'>
                                {product.description}
                            </p>

                            <div className='space-y-3 mb-6 text-sm'>
                                <div className='flex items-center gap-3'>
                                    <span className='font-semibold text-gray-600 w-28'>Quantity:</span>
                                    <span className='text-gray-800'>{product.quantity}{product.quantity === 0 ? " out of stock" : " in stock"}</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-semibold text-gray-600 w-28'>Location:</span>
                                    <span className='text-orange-600'>Karachi, Lahore & Islamabad</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-semibold text-gray-600 w-28'>Delivery:</span>
                                    <span className='text-gray-800'>20 to 30 min Max</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className='flex gap-3 sticky bottom-0 bg-white pt-4 border-t md:border-0 md:pt-0'>
                                <button
                                    onClick={addToCart}
                                    className='flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 text-sm md:text-base font-semibold rounded-lg transition'
                                >
                                    Add to Cart
                                </button>
                                <Link
                                    to={`/product/${product._id}/buyNow`}
                                    className='flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 text-sm md:text-base font-semibold rounded-lg text-center transition'
                                >
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail