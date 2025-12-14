import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi } from '../services/AuthService'

const AuthContext = createContext(null)

/**
 * Provider quản lý authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load token và user từ localStorage khi component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  /**
   * Đăng nhập
   */
  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password)
      
      // Lưu token và user vào state và localStorage
      setToken(data.accessToken)
      setUser(data.user)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Đăng xuất
   */
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  /**
   * Lấy token hiện tại
   */
  const getToken = () => {
    return token || localStorage.getItem('accessToken')
  }

  const value = {
    user,
    token,
    login,
    logout,
    getToken,
    isAuthenticated: !!token,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook để sử dụng AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

