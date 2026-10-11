import React, { useEffect, useState } from 'react'
import api from '../utils/Api'
import { FaBox, FaTruck, FaMoneyBillWave, FaCheckCircle, FaClock, FaCircle, FaSpinner } from 'react-icons/fa'

const Myorders = () => {
    const [myorder, setmyorder] = useState([])
    const [loading, setloading] = useState(true)

    useEffect(() => {
        async function getMyOrders() {
            try {
                let res = await api("/order/myOrders", {
                    method: "GET",
                    credentials: 'include'
                })
                setmyorder(res.myOrders)
                console.log(res);

            } catch (err) {
                console.log(err.message);
            }
            setloading(false)
        }
        getMyOrders()
    }, [])

    if (loading) {
        return <div className='h-screen text-center py-20 text-xl justify-center flex  font-semibold'>
            <FaSpinner className='animate-spin text-primary' size={30} />
        </div>
    }

    return (
        <div className='min-h-screen bg-gray-100 py-6 overflow-x-hidden '>
            <div className='max-w-5xl mx-auto px-4'>
                <h1 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2'>
                    <FaBox className='text-orange-500' /> My Orders
                </h1>
                {myorder.length === 0 ? (
                    <div className='bg-white rounded-xl shadow p-10 text-center'>
                        <FaBox className='text-6xl text-gray-300 mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-gray-700'>No Orders Yet</h2>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {myorder.map((order) => (
                            <div key={order._id} className='bg-white rounded-xl shadow-md p-4 md:p-6'>

                                {/* Top Line */}
                                <div className='flex justify-between items-center border-b pb-3 mb-3'>
                                    <div>
                                        <p className='text-sm text-gray-500'>Order ID</p>
                                        <p className='font-bold  text-sm'>#{order._id.slice(-9)}</p>
                                    </div>
                                    <div className='bg-green-100 text-green-700 px-3  py-1 rounded-full text-sm font-semibold'>
                                        <FaCheckCircle className='inline mr-1 ' />Order Placed
                                    </div>
                                </div>

                                {/* Product + Details */}
                                <div className='flex gap-4'>
                                    <img
                                        src={order.productId?.uri}
                                        alt={order.productId?.title}
                                        className='w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border'
                                    />
                                    <div className='flex-1'>
                                        <h3 className='font-bold text-lg'>{order.productId?.title}</h3>
                                        <p className='text-gray-600 text-sm'>Qty: {order.quantity}</p>
                                        <p className='text-orange-500 font-bold text-lg'>Rs {order.productId?.price * order.quantity}</p>

                                        <div className='flex gap-4 mt-2 text-sm'>
                                            <p><FaMoneyBillWave className='inline text-orange-500' /> {order.paymentMethod}</p>
                                            <p><FaTruck className='inline text-orange-500' /> Free Delivery</p>
                                        </div>

                                        <div className='mt-2 bg-gray-50 p-2 rounded'>
                                            <p className='text-sm'><b>{order.fullName}</b> - {order.phoneNumber}</p>
                                            <p className='text-sm text-gray-600'>{order.address}</p>
                                        </div>

                                        <p className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                                            <FaClock /> {new Date(order.createdAt).toLocaleDateString('en-PK')}
                                        </p>
                                    </div>
                                    <div>
                                    </div>

                                </div>
                                <p className='text-accent uppercase '>{order.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Myorders