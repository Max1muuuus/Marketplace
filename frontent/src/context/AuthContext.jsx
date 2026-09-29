import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../services/mockApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('marketplace-user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('marketplace-token') || '')

  useEffect(() => {
    if (user) {
      localStorage.setItem('marketplace-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('marketplace-user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('marketplace-token', token)
    } else {
      localStorage.removeItem('marketplace-token')
    }
  }, [token])

  const login = async (payload) => {
    const response = await loginRequest({ email: payload.email, password: payload.password })
    const nextUser = {
      id: response.user.id,
      name: response.user.name || `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || payload.name || 'Demo User',
      email: response.user.email,
      role: response.user.role,
    }
    setToken(response.token)
    setUser(nextUser)
    return nextUser
  }

  const register = async (payload) => {
    const response = await registerRequest({
      firstName: payload.firstName || payload.name?.split(' ')[0] || 'New',
      lastName: payload.lastName || payload.name?.split(' ').slice(1).join(' ') || 'User',
      email: payload.email,
      password: payload.password || 'demo123',
    })
    const nextUser = {
      id: response.user.id,
      name: response.user.name || `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim(),
      email: response.user.email,
      role: response.user.role,
    }
    setToken(response.token)
    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    setUser(null)
    setToken('')
  }

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
