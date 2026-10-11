import React from 'react'
import { FaSpinner } from 'react-icons/fa6'

const Spinner = () => {
    return (
        <div className='flex justify-center items-center h-[80vh]'>
            <FaSpinner className='animate-spin text-5xl text-[#F85606]' />
        </div>)
}

export default Spinner