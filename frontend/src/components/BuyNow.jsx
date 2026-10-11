import React, { useState, useEffect } from 'react'
import api from '../utils/Api'
import { useParams } from 'react-router-dom'
import { FaTruck, FaShieldAlt, FaMapMarkerAlt, FaShoppingBag, FaUser, FaPhone, FaHome, FaBox, FaCreditCard, FaShoppingCart, FaStar, FaStarHalfAlt, FaCheckCircle, FaExclamationCircle, FaWhatsapp } from 'react-icons/fa'

const BuyNow = () => {
  const [error, seterror] = useState("")
  const [success, setsuccess] = useState("")
  const [loading, setloading] = useState(false)
  const [product, setproduct] = useState(null)
  const [form, setform] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    paymentMethod: "COD",
    quantity: 1
  })

  const { id } = useParams()

  useEffect(() => {
    async function getDetailOfProduct() {
      try {
        let res = await api(`/upload/productDetails/${id}`, { method: "GET" })
        setproduct(res.productById)
      } catch (err) {
        console.log(err.message);
      }
    }
    getDetailOfProduct()
  }, [id])

  const handleInput = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
    seterror("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror("")

    if (!form.fullName || !form.address || !form.phoneNumber || !form.quantity) {
      setloading(false)
      return seterror("Please fill all fields")
    }
    if (isNaN(form.phoneNumber)) {
      setloading(false)

      return seterror("Please enter a valid number")
    }
    if (form.phoneNumber.length < 11) {
      setloading(false)
      return seterror("Phone number must be 11 digits")
    }
    if (form.quantity < 1) {
      setloading(false)
      return seterror("Qty must be 1 or more than 1")
    }

    try {
      let bodyData = {
        productId: id,
        ...form
      }
      let res = await api("/order/buyNow", { method: "POST", credentials: 'include', body: JSON.stringify(bodyData) })
      console.log(res);

      setsuccess("🎉 Order Placed Successfully!")
      setTimeout(() => setsuccess(""), 3000)
      setform({ fullName: "", address: "", phoneNumber: "", paymentMethod: "COD", quantity: 1 })
    } catch (err) {
      console.log(err.message);

      seterror(err.message || "Order failed. Try again")
    }
    setloading(false)
  }
  const handleWhatsAppOrder = async () => {
    if (!product) {
      seterror("Product loading...");
      return;
    }
    if (!form.fullName || !form.address || !form.phoneNumber) {
      seterror("Please fill all fields first");
      return;
    }

    setloading(true);
    seterror("");
    try {
      let bodyData = {
        productId: id,
        ...form,
        orderSource: "WhatsApp"
      }
      let res = await api("/order/buyNow", {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });

      const { fullName, address, phoneNumber, quantity, paymentMethod } = form;
      const { title, price } = product;
      const total = price * quantity;

      const orderDetails = `
*NEW ORDER - ZOMIO - #${res.orderId || 'N/A'}*

*Product:* ${title}
*Price:* Rs ${price}
*Qty:* ${quantity}
*Total:* Rs ${total}
*Payment:* ${paymentMethod}

*Customer Details:*
*Name:* ${fullName}
*Phone:* ${phoneNumber}
*Address:* ${address}

Product Link: ${window.location.href}
    `.trim();

      const encodedMessage = encodeURIComponent(orderDetails);
      const whatsappNumber = "923195735959";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      setsuccess("🎉 Order Placed & Sent to WhatsApp!");
      setTimeout(() => setsuccess(""), 3000);
      setform({ fullName: "", address: "", phoneNumber: "", paymentMethod: "COD", quantity: 1 });

    } catch (err) {
      seterror(err.message || "Order failed. Try again");
    }
    setloading(false);
  }

  return (
    <div className='min-h-screen bg-gray-50 py-4 md:py-8'>
      {error && <div className='fixed top-5 right-5 left-5 md:left-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'><FaExclamationCircle />{error}</div>}
      {success && <div className='fixed top-5 right-5 left-5 md:left-auto bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'><FaCheckCircle />{success}</div>}

      <div className='max-w-7xl mx-auto px-3 md:px-4 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>

        <div className='lg:col-span-2 bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6'>
          {product ? (
            <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
              <img className='w-full md:w-80 h-64 md:h-80 object-cover rounded-lg border' src={product.uri} alt={product.title} />
              <div className='flex-1'>
                <h1 className='text-xl md:text-2xl font-bold'>{product.title}</h1>
                <div className='flex items-center gap-1 mt-2'>
                  <FaStar className='text-yellow-400' /><FaStar className='text-yellow-400' /><FaStar className='text-yellow-400' /><FaStar className='text-yellow-400' /><FaStarHalfAlt className='text-yellow-400' />
                </div>
                <p className='text-gray-600 mt-3 text-xs'>{product.description}</p>
                <div className='mt-4 space-y-2'>
                  <div className='flex items-center gap-2'><FaTruck className='text-orange-500' /><span>Fast Delivery</span></div>
                  <div className='flex items-center gap-2'><FaShieldAlt className='text-orange-500' /><span>100% Original</span></div>
                  <div className='flex items-center gap-2'><FaMapMarkerAlt className='text-orange-500' /><span>Karachi, Lahore, Islamabad</span></div>
                </div>
                <h1 className='text-xl md:text-3xl font-bold text-orange-500 mt-4'>Rs {product.price}</h1>
              </div>
            </div>
          ) : <div className='h-80 bg-gray-200 rounded-xl animate-pulse'></div>}
        </div>

        <div className='bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 lg:sticky lg:top-8 h-fit'>
          <h2 className='text-lg md:text-xl font-bold mb-4 flex items-center gap-2'><FaShoppingBag className='text-orange-500' /> Order Summary</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='text-sm flex items-center gap-1'><FaUser />Full Name</label>
              <input type="text" name='fullName' value={form.fullName} onChange={handleInput} className='w-full border-2 rounded-lg px-3 py-2 mt-1' />
            </div>
            <div>
              <label className='text-sm flex items-center gap-1'><FaPhone />Phone</label>
              <input type="tel" name='phoneNumber' value={form.phoneNumber} onChange={handleInput} className='w-full border-2 rounded-lg px-3 py-2 mt-1' />
            </div>
            <div>
              <label className='text-sm flex items-center gap-1'><FaHome />Address</label>
              <textarea name='address' value={form.address} onChange={handleInput} rows="3" className='w-full border-2 rounded-lg px-3 py-2 mt-1 resize-none' />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='text-sm flex items-center gap-1'><FaBox />Qty</label>
                <input type="number" name='quantity' value={form.quantity} onChange={handleInput} className='w-full border-2 rounded-lg px-3 py-2 mt-1' />
              </div>
              <div>
                <label className='text-sm flex items-center gap-1'><FaCreditCard />Payment</label>
                <select name='paymentMethod' value={form.paymentMethod} onChange={handleInput} className='w-full border-2 rounded-lg px-3 py-2 mt-1'>
                  <option value="COD">COD</option>

                </select>
              </div>
            </div>
            <button disabled={loading} className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2'>
              <FaShoppingCart />{loading ? "Placing..." : "Place Order"}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2'
            >
              <FaWhatsapp /> Order on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyNow