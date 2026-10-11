import React from "react"
import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION */}
      <div className="bg-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About Zomio</h1>
        <p className="text-lg max-w-2xl mx-auto px-4">
          Pakistan's trusted online marketplace for Electronics, Fashion & Home Essentials. 
          Shop smart, shop Zomio.
        </p>
      </div>

      {/* 2. OUR STORY */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Our Story</h2>
        <p className="text-gray-600 text-center leading-relaxed">
          Zomio was started in 2026 with one simple goal: Make online shopping easy, 
          affordable and reliable for everyone in Pakistan. From a Shirt for boys to 
          Samsung Laptop, we bring you quality products with fast delivery at your doorstep.
          <br/><br/>
          We believe shopping should be stress-free. That's why we offer Secure Payments 
          with Stripe, JazzCash & Easypaisa.
        </p>
      </div>

      {/* 3. WHY CHOOSE US */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Zomio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Deliver in 2-3 business days across Pakistan</p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-xl mb-2">Secure Payment</h3>
              <p className="text-gray-600">Pay with Card, JazzCash, Easypaisa. 100% Safe</p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-bold text-xl mb-2">Quality Products</h3>
              <p className="text-gray-600">7 Days easy return & refund policy</p>
            </div>

          </div>
        </div>
      </div>

      {/* 4. STATS */}
      <div className="bg-orange-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-3xl font-bold">10,000+</h3>
            <p>Products</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">5,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">50+</h3>
            <p>Cities Covered</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">24/7</h3>
            <p>Customer Support</p>
          </div>
        </div>
      </div>

      {/* 5. CTA */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Shop?</h2>
        <Link to="/products">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600">
            Shop Now
          </button>
        </Link>
      </div>

    </div>
  )
}

export default About