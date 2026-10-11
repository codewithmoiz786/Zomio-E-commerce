import React, { useEffect, useState } from 'react'
import api from '../utils/Api'
import { FaSpinner, FaCheckCircle, FaClock, FaTruck, FaTimesCircle, FaBox, FaUser, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa'

const AllOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        getAllOrders()
    }, [])

    async function getAllOrders() {
        try {
            setLoading(true)
            let res = await api("/order/getAllOrders", { method: "GET" })
            setOrders(res.AllOrders.reverse() || [])
        } catch (error) {
            console.log(error);
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Kya aap status ko "${newStatus}" karna chahte hain?`)) return;

        try {
            setUpdating(orderId)
            await api(`/order/updateStatus/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })
            await getAllOrders()
        } catch (error) {
            console.log(error);
            alert("Status update nahi hua. Dobara try karo")
        } finally {
            setUpdating(null)
        }
    }

    const getStatusColor = (status) => {
        if (status === 'Pending') return 'bg-[#FFF1EC] text-[#F85606] border border-[#F85606]/20'
        if (status === 'Shipped') return 'bg-blue-50 text-blue-600 border border-blue-200'
        if (status === 'Delivered') return 'bg-green-50 text-green-600 border-green-200'
        if (status === 'Canceled') return 'bg-red-50 text-red-600 border border-red-200'
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }

    const getStatusIcon = (status) => {
        if (status === 'Pending') return <FaClock />
        if (status === 'Shipped') return <FaTruck />
        if (status === 'Delivered') return <FaCheckCircle />
        if (status === 'Canceled') return <FaTimesCircle />
        return <FaClock />
    }

    if (loading) {
        return <div className='flex justify-center items-center h-[80vh]'>
            <FaSpinner className='animate-spin text-5xl text-[#F85606]' />
        </div>
    }

    return (
        <div className='min-h-screen bg-[#F5F5F5] p-3 md:p-6 sm:pt-8   md:pt-6'>
            <div className='max-w-5xl mx-auto'>

                {/* Header */}
                <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Orders</h1>
                        <p className='text-gray-500 text-sm mt-1'>Manage all your customer orders</p>
                    </div>
                    <div className='bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-fit'>
                        <p className='text-xs text-gray-500'>Total Orders</p>
                        <p className='text-xl font-bold text-[#F85606]'>{orders.length}</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className='text-center py-16 bg-white rounded-xl shadow-sm border-gray-200'>
                        <FaBox className='text-5xl text-gray-300 mx-auto mb-3' />
                        <p className='text-gray-500 font-medium'>No orders found</p>
                    </div>
                ) : (
                    <div className='grid gap-4'>
                        {orders.map((order) => (
                            <div key={order._id} className='bg-white p-4 rounded-xl shadow-sm border-gray-200 hover:shadow-md hover:border-[#F85606]/30 transition-all duration-200'>

                                {/* Mobile Layout */}
                                <div className='lg:hidden space-y-3'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <p className='text-xs text-gray-500'>Order ID</p>
                                            <p className='font-mono font-bold text-gray-800 text-sm'>#{order._id?.slice(-8)}</p>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className='grid grid-cols-2 gap-3 text-sm'>
                                        <div>
                                            <p className='text-xs text-gray-500 flex items-center gap-1'><FaBox /> Product</p>
                                            <p className='font-medium text-gray-800'>{order.productId?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 flex items-center gap-1'><FaUser /> Customer</p>
                                            <p className='font-medium text-gray-800'>{order.userId?.name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className='text-sm'>
                                        <p className='text-xs text-gray-500 flex items-center gap-1'><FaMapMarkerAlt /> Address</p>
                                        <p className='text-gray-700 text-xs'>{order.address}</p>
                                    </div>

                                    <div className='flex items-center justify-between pt-3 border-t'>
                                        <div>
                                            <p className='text-xs text-gray-500'>Total</p>
                                            <p className='text-base font-bold text-[#F85606]'>Rs {order.total || order.productId?.price}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            {order.status === 'Pending' && (
                                                <button onClick={() => updateStatus(order._id, 'Shipped')} disabled={updating === order._id} className='bg-[#F85606] hover:bg-[#e04e05] disabled:bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1'>
                                                    {updating === order._id ? <FaSpinner className='animate-spin' /> : <FaTruck />} Shipped
                                                </button>
                                            )}
                                            {order.status === 'Shipped' && (
                                                <button onClick={() => updateStatus(order._id, 'Delivered')} disabled={updating === order._id} className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1'>
                                                    {updating === order._id ? <FaSpinner className='animate-spin' /> : <FaCheckCircle />} Delivered
                                                </button>
                                            )}
                                            {order.status !== 'Delivered' && order.status !== 'Canceled' && (
                                                <button onClick={() => updateStatus(order._id, 'Canceled')} disabled={updating === order._id} className='bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1'>
                                                    {updating === order._id ? <FaSpinner className='animate-spin' /> : <FaTimesCircle />} Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout - COMPACT */}
                                <div className='hidden lg:grid grid-cols-12 items-center gap-3'>
                                    <div className='col-span-2'>
                                        <p className='text-xs text-gray-500'>Order ID</p>
                                        <p className='font-mono font-bold text-gray-800 text-sm'>#{order._id?.slice(-8)}</p>
                                    </div>

                                    <div className='col-span-3'>
                                        <p className='text-xs text-gray-500 flex items-center gap-1'><FaBox /> Product</p>
                                        <p className='font-medium text-gray-800 text-sm truncate'>{order.productId?.name || 'N/A'}</p>
                                        <p className='text-sm font-bold text-[#F85606]'>Rs {order.total || order.productId?.price}</p>
                                    </div>

                                    <div className='col-span-3'>
                                        <p className='text-xs text-gray-500 flex items-center gap-1'><FaUser /> Customer</p>
                                        <p className='text-sm text-gray-700'>{order.userId?.name || 'N/A'}</p>
                                        <p className='text-xs text-gray-500 truncate flex items-center gap-1'><FaMapMarkerAlt />{order.address}</p>
                                    </div>

                                    <div className='col-span-1'>
                                        <p className='text-xs text-gray-500 flex items-center gap-1'><FaCreditCard /></p>
                                        <span className='px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-700'>
                                            {order.paymentMethod}
                                        </span>
                                    </div>

                                    <div className='col-span-1'>
                                        <span className={`flex items-center justify-center gap-1 w-fit px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                        </span>
                                    </div>

                                    <div className='col-span-2 flex flex-col gap-1.5'>
                                        {order.status === 'Pending' && (
                                            <button onClick={() => updateStatus(order._id, 'Shipped')} disabled={updating === order._id} className='bg-[#F85606] hover:bg-[#e04e05] disabled:bg-gray-400 text-white px-2 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition'>
                                                {updating === order._id ? <FaSpinner className='animate-spin' /> : <FaTruck />} Shipped
                                            </button>
                                        )}
                                        {order.status === 'Shipped' && (
                                            <button onClick={() => updateStatus(order._id, 'Delivered')} disabled={updating === order._id} className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-2 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition'>
                                                {updating === order._id ? <FaSpinner className='animate-spin' /> : <FaCheckCircle />} Delivered
                                            </button>
                                        )}
                                        {order.status !== 'Delivered' && order.status !== 'Canceled' && (
                                            <button onClick={() => updateStatus(order._id, 'Canceled')} disabled={updating === order._id} className='bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-2 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition'>
                                                {updating === order._id ? <FaSpinner className='animate-spin' /> : <FaTimesCircle />} Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllOrders