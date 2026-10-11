import React, { useEffect, useState } from 'react'
import api from '../utils/Api'
import { Link } from 'react-router-dom'
import { triggerCartUpdate } from '../utils/cartHelper'

const YourCart = () => {
  const [carts, setcarts] = useState([])
  const [error, seterror] = useState("")
  const [success, setsuccess] = useState("")
  const [loading, setloading] = useState(true)

  let get = async () => {
    try {
      setloading(true)
      const res = await api("/cart/get", {
        method: "GET",
      })
      setcarts(res.allCarts || [])
    } catch (err) {
      seterror("Failed to load cart")
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    get()
  }, [])

  let removeCart = async function remove(productId) {
    try {
      let res = await api("/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId })
      })
      triggerCartUpdate()
      setsuccess(res.message || "Removed from cart")
    } catch (err) {
      seterror(err.message)
    }
    get()
    setTimeout(() => {
      seterror("")
      setsuccess("")
    }, 2000);
  }

  const total = carts.reduce((acc, item) => {
    return acc + (item.productId.price * item.quantity)
  }, 0)

  if (loading) return <div className='min-h-screen flex items-center justify-center text-gray-500'>Loading...</div>

  return (
    <div className='min-h-screen '>
      {error && <div className='fixed top-20 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm'>{error}</div>}
      {success && <div className='fixed top-20 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm'>{success}</div>}

      <div className='max-w-7xl mx-auto px-3 py-4'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl lg:text-4xl md:3xl xl:text-5xl font-semibold'>Your Cart</h1>
          <p className='text-sm text-gray-600'>You have <span className='text-orange-600 font-semibold'>{carts.length}</span> items</p>
        </div>

        {carts.length === 0 ?
          <div className='bg-white rounded-lg shadow-sm p-20 text-center'>
            <p className='text-gray-500 text-lg'>Your cart is empty</p>
            <Link to="/products">
              <button className='mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg'>Shop Now</button>
            </Link>
          </div>
          :
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
            {carts.map((item) => {
              if (!item?.productId) return null
              return <div
                key={item._id}
                className='bg-white rounded-md overflow-hidden border-gray-200 hover:shadow-md transition'
              >
                <Link to={`/product/${item.productId._id}`}>
                  <div className='w-full h-40 sm:h-44 bg-gray-200 overflow-hidden'>
                    <img className='w-full h-full object-cover' src={item.productId.uri} alt={item.productId.title} />
                  </div>
                </Link>

                <div className='p-2'>
                  <Link to={`/product/${item.productId._id}`}>
                    <h1 className='font-medium text-xs sm:text-sm line-clamp-2 h-8 mb-1'>{item.productId.title}</h1>
                  </Link>

                  <div className='flex justify-between items-center mb-2'>
                    <div className='text-red-600 font-bold text-sm'>Rs {item.productId.price}</div>
                    <div className='text-xs text-gray-600'>Qty: {item.quantity}</div>
                  </div>

                  <div className='flex gap-1.5'>
                    <button
                      className='flex-1 bg-gray-200 hover:bg-gray-300 text-red-600 py-1.5 px-2 text-xs font-semibold rounded transition'
                      onClick={() => { removeCart(item._id) }}
                    >
                      Remove
                    </button>
                    <Link
                      to={`/product/${item.productId._id}/buyNow`}
                      className='flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-2 text-xs font-semibold rounded text-center transition'>
                      <button>
                        Buy
                      </button></Link>

                  </div>
                </div>
              </div>
            })}
          </div>
        }

        {carts.length > 0 &&
          <div className='mt-6 bg-white rounded-lg shadow-sm p-4 flex justify-between items-center sticky bottom-0'>
            <div className='text-lg font-semibold'>Total: <span className='text-red-600'>Rs {total}</span></div>

          </div>
        }
      </div>
    </div>
  )
}

export default YourCart