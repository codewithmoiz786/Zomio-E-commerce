import React from 'react'
import flatOffer from '../assets/fl.png'

const FlatOffer = () => {
  return (
    <div className=' w-full  px-2 h-[250px] sm:h-[400px]  mt-10 lg:mt-0 md:px-10 md:h-[470px]  overflow-hidden flex items-center justify-center '>
      <img src={flatOffer} className='w-full lg:w-[1000px] h-full rounded object-cover' alt="" />
    </div>
  )
}

export default FlatOffer