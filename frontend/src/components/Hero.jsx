import React from 'react'
import hero from '../assets/hero.png'
import { FaArrowRight, FaMagic, FaGift, FaMoneyBillWave, FaHeadset, FaTag } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import banner from '../assets/Banner.png'
import FlatOffer from './FlatOffer'
const Hero = () => {
    const features = [
        {
            icon: <FaMoneyBillWave />,
            title: "Best Price Guarantee",
            desc: "Lowest prices guaranteed on all products with price match"
        },
        {
            icon: <FaTag />,
            title: "Top Offers",
            desc: "Exclusive deals up to 70% off on top brands"
        },
        {
            icon: <FaHeadset />,
            title: "24/7 Support",
            desc: "Customer support available anytime for you"
        },
        {
            icon: <FaGift />,
            title: "Exclusive Deals",
            desc: "Special discounts for members and new users"
        }
    ]

    return (
        <div className='w-full  '>
            <FlatOffer/>
            {/* HERO SECTION */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>

                    {/* LEFT */}
                    <div className='space-y-7 text-center lg:text-left'>
                        <h1 className='text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight'>
                            <span className='text-primary'>Zomio</span>
                            <span className=' block text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold mt-2'>
                                E-commerce Shopping
                            </span>
                        </h1>

                        <p className='text-base lg:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed'>
                            Best deals on electronics, fashion, groceries & more.
                            Fast delivery to your door in Karachi with premium quality products.
                        </p>

                        <div className='pt-4 flex justify-center lg:justify-start'>
                            <Link to="/about">
                                <button className='group flex items-center gap-2 text-white px-5 py-2 rounded-2xl font-semibold text-base btn2'>
                                    Explore More
                                    <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className='flex justify-center'>
                        <img
                            className='w-full max-w-md lg:max-w-lg h-[300px] lg:h-[450px] object-contain'
                            src={hero}
                            alt="Zomio Shopping"
                        />
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12'>
                <div className='text-center mb-8'>
                    <h2 className='text-2xl lg:text-3xl font-bold text-gray-800'>Why Shop With Us?</h2>
                    <p className='text-gray-500 mt-2'>We provide the best shopping experience</p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className='bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
                        >
                            <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-4'>
                                {item.icon}
                            </div>
                            <h3 className='text-lg font-bold text-gray-800 mb-2'>{item.title}</h3>
                            <p className='text-sm text-gray-500 leading-relaxed'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hero