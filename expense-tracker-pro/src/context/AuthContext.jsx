import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthContext = createContext(null)

// ---------------------------------------------------------------------------
// Provider — wraps the whole app, owns the single source of truth for auth
// ---------------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // On first mount, check if a user was already logged in (from localStorage)
  useEffect(() => {
    const storedUser  = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setAuthLoading(false)
  }, [])

  async function login(email, password) {
    const result = await loginUser({ email, password })
    const { token, ...userData } = result.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  async function register(name, email, password) {
    const result = await registerUser({ name, email, password })
    const { token, ...userData } = result.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    authLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Custom hook — components call useAuth() instead of useContext(AuthContext)
// ---------------------------------------------------------------------------

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}