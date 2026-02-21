import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token from localStorage for authenticated requests
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore in non-browser env
  }
  return config
})

export default api
