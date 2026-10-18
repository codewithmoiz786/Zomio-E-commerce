import React, { lazy, Suspense } from 'react'
import Sidebar from '../components/Sidebar'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Spinner from '../components/Spinner'

const DashboardChart = lazy(() => import("./Dashboard"))
const AddProduct = lazy(() => import("../components/AdminAddProduct"))
const AdminAllProducts = lazy(() => import('../components/AdminAllProducts'))
const Customers = lazy(() => import('./Customers'))
const AllOrders = lazy(() => import('./AllOrders'))
const Editproduct = lazy(() => import('../components/Editproduct'))
const allAdminsFeatures = [
    { path: "/dashboard", element: <DashboardChart /> },
    { path: "/add-product", element: <AddProduct /> },
    { path: "/products", element: <AdminAllProducts /> },
    { path: "/editProduct/:id", element: <Editproduct /> },
    { path: "/orders", element: <AllOrders /> },
    { path: "/customers", element: <Customers /> }
]
const Admin = () => {
    const parse = localStorage.getItem("user")
    let user = JSON.parse(parse)


    return (
        <>
            {!user && <div className='h-screen w-full flex items-center justify-center flex-col'>
                <div className='mb-10'>You must be login first</div>
                <Link to="/login">
                    <button className='bg-accent text-border px-10 py-1 rounded'>Login</button>
                </Link>
            </div>}

            {user?.role !== "admin" ? <div className='text-gray-500 text-center mt-20'>You don't have an admin access <Link to="/" className='bg-accent text-border px-3 py-1 rounded'>Back to Home</Link></div> : <div className='flex'>
                <Sidebar />

                <div className='pt-16 md:mt-0 flex-1 md:p-6 p-1 overflow-y-auto max-h-screen bg-zinc-100'>
                    <Suspense fallback={<Spinner />}>
                        <Routes>
                            {allAdminsFeatures.map((elem, index) => {
                                return <Route key={index} path={elem.path} element={elem.element} />
                            })}
                        </Routes>
                    </Suspense>
                </div>
            </div>
            }
        </>
    )
}

export default Admin