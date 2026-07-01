import axios from 'axios'

// ---------------------------------------------------------------------------
// Centralized Axios instance
// ---------------------------------------------------------------------------



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---------------------------------------------------------------------------
// Request interceptor — automatically attaches the JWT to every request
// This runs BEFORE every single request leaves the browser
// ---------------------------------------------------------------------------

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ---------------------------------------------------------------------------
// Response interceptor — if a token is invalid/expired anywhere, log the user out
// ---------------------------------------------------------------------------

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Avoid infinite redirect loop if we're already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// ---------------------------------------------------------------------------
// Transaction endpoints
// ---------------------------------------------------------------------------

export const getTransactions = async () => {
  const response = await api.get('/transactions')
  return response.data
}

export const getTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`)
  return response.data
}

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData)
  return response.data
}

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData)
  return response.data
}

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`)
  return response.data
}

export default api