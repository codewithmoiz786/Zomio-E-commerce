const BASE_URL = "http://localhost:3000/api"

const apiFetch = async (endpoint, options = {}) => {

    const token = localStorage.getItem("accessToken")

    const isFormData = options.body instanceof FormData

    const config = {
        credentials: "include",

        headers: {
            ...(!isFormData && {
                "Content-Type": "application/json"
            }),

            ...options.headers,
        },

        ...options,
    }

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, config)

    const data = await res.json()

    if (!res.ok) {

        const error = new Error(
            data.message || "Something went wrong"
        )

        error.expiresIn = data.expiresIn

        error.status = res.status

        throw error
    }

    return data
}

export default apiFetch