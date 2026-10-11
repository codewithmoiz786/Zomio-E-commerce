import React, { useEffect, useState } from 'react'
import api from '../utils/Api'

const Customers = () => {
    const [users, setusers] = useState([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUsers() {
            try {
                let res = await api('/auth/getAllUsers', {
                    method: "GET"
                })
                console.log(res);

                setusers(res.allUsers.reverse() || [])
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getUsers()
    }, [])

    if (loading) return <p className='text-center mt-10 animate-pulse '>Loading Customers...</p>

    return (
        <div className='bg-zinc-100 w-full min-h-screen lg:p-5'>

            <h1 className='text-2xl font-bold mb-6 px-2'>All Customers</h1>

            {users.length === 0 ? (
                <p className='text-center text-gray-500'>No Customers Found</p>
            ) : (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {users.map((user) => {
                    return (
                        <div
                            className='bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition'
                            key={user._id}
                        >
                            <div className='flex items-center gap-3'>
                                {/* Avatar */}
                                <div className='w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl'>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className='text-lg font-semibold'>{user.name}</h1>
                                    <h1 className='text-sm text-zinc-500'>{user.email}</h1>
                                </div>
                            </div>

                            {/* Extra Info */}
                            <div className='mt-3 pt-3 border-t text-sm text-gray-600'>
                                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            )}
        </div>

    )
}

export default Customers