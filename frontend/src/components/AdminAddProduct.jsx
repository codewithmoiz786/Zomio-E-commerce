import React, { useState } from 'react'
import { FaHeading, FaImage, FaFileAlt, FaDollarSign, FaPoundSign, FaTable, FaSortAmountDown, FaTag } from 'react-icons/fa'
import api from '../utils/Api'
const AddProduct = () => {
    const [error, seterror] = useState("")
    const [success, setsuccess] = useState("")
    const [loading, setloading] = useState(false)
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        product: null,
        imagePreview: "",
        category: "",
        quantity: ""
    })

    const handleImage = (e) => {
        let file = e.target.files[0]
        if (file) {
            setForm({
                ...form,
                product: file,
                imagePreview: URL.createObjectURL(file)
            })
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        seterror("")
        setsuccess("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setloading(true)
        seterror("")
        setsuccess("")
        if (!form.category || !form.product || !form.description || !form.price || !form.quantity || !form.title) {
            seterror("Please fill all fields")
            setloading(false)
            return
        }
        if (form.quantity <= 0) {
            setloading(false)
            return seterror("Qty must be 1 or more than 1")
        }
        try {

            let formData = new FormData()
            formData.append("title", form.title)
            formData.append("description", form.description)
            formData.append("price", form.price)
            formData.append("product", form.product)
            formData.append("category", form.category)
            formData.append("quantity", form.quantity)

            let res = await api("/upload/product", {
                method: "POST",
                credentials: 'include',
                body: formData
            })
            setsuccess(res.message || "Product Added Successfully✅")
            setForm({ title: "", description: "", price: "", product: null, imagePreview: "", category: "", quantity: "" })

            setTimeout(() => {
                setsuccess("")
            }, 2000);
        } catch (err) {
            seterror("Something went wrong")
        } finally {
            setloading(false)
        }

    }

    return (
        <div>

            <div className='md:px-6 md:py-4 py-2'>
                <h1 className='text-xl md:text-3xl  mb-4 text-gray-8
                00 font-semibold text-center md:text-start'>Add New Product</h1>
                <form onSubmit={handleSubmit} className='border border-zinc-200 p-6 flex-col gap-3 w-full rounded-2xl flex' >
                    {error && (
                        <div className='z-50 noti absolute right-0  top-2 bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded-lg'>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className='noti absolute right-0  top-2 bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded-lg'>
                            {success}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className='flex md:gap-10 gap-3 items-center'>
                        {form.imagePreview
                            ? <img src={form.imagePreview} alt="preview" className='w-44 bg-zinc-200 h-28 object-cover rounded' />
                            : <div className='w-44 bg-zinc-200 h-28 flex items-center justify-center rounded'><FaImage size={40} className='text-gray-400' /></div>
                        }
                        <div>
                            <label htmlFor="imageUpload" className='tracking-tighter sm:tracking-normal flex items-center gap-2 md:px-5 px-2 py-2 bg-primary-light text-primary font-medium rounded-xl cursor-pointer hover:bg-soft-orange transition-all duration-200'>
                                <FaImage size={20} />
                                <span className='text-sm md:text-base' >Upload image</span>
                            </label>
                            <input
                                type="file"
                                name='product'
                                id='imageUpload'
                                accept='image/*'
                                onChange={handleImage} // sirf 1 baar
                                className='hidden'
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <FaTable />
                            <label className='text-primary text-xl'>Title</label>
                        </div>
                        <input
                            type="text"
                            name='title'
                            value={form.title}
                            onChange={handleChange}
                            className='border border-zinc-900 py-2 px-3 w-full rounded'
                            placeholder='Enter Product Title'
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <FaTag />
                            <label className='text-primary text-xl'>Category</label>
                        </div>
                        <select
                            name='category'
                            value={form.category}
                            onChange={handleChange}
                            className='border border-zinc-900 py-2 px-3 w-full rounded bg-white'
                        >
                            <option value="" >Select Category</option>
                            <option value="Perfumes">Perfumes</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Watches">Watches</option>
                            <option value="Boys">Boys</option>
                            <option value="Girls">Girls</option>
                        </select>
                    </div>
                    {/* Description */}
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <FaFileAlt />
                            <label className='text-primary text-xl'>Description</label>
                        </div>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className='border border-zinc-800 resize-none w-full px-3 py-2 rounded'
                            placeholder='Enter product description'
                            rows="4"
                        ></textarea>
                    </div>

                    {/* Price */}
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <FaSortAmountDown />
                            <label className='text-primary text-xl'>Quantity</label>
                        </div>
                        <input
                            type="number"
                            onChange={handleChange}
                            name='quantity'
                            value={form.quantity}
                            className='border border-zinc-900 py-2 px-3 w-full rounded'
                            placeholder='Enter product quantity'
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <FaDollarSign />
                            <label className='text-primary text-xl'>Price</label>
                        </div>
                        <input
                            type="number"
                            onChange={handleChange}
                            name='price'
                            value={form.price}
                            className='border border-zinc-900 py-2 px-3 w-full rounded'
                            placeholder='Enter Product Price'
                        />
                    </div>

                    <button type="submit" className={`px-8 py-2 bg-primary text-white rounded ${loading ? ' opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}>{loading ? "Uploading..." : "Add Product"}</button>
                </form>
            </div>
        </div>
    )
}

export default AddProduct