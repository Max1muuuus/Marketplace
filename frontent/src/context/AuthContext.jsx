import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../services/mockApi'

const AuthContext = createContext(null)

function normalizeRoleSuffix(name, role) {
  const normalizedRole = role?.toLowerCase()
  const suffix = normalizedRole === 'admin' ? ' Admin' : normalizedRole === 'customer' ? ' User' : ''
  return suffix && name?.endsWith(suffix) ? name.slice(0, -suffix.length).trim() : name
}

function readSavedUser() {
  try {
    const savedUser = JSON.parse(localStorage.getItem('marketplace-user') || 'null')
    if (savedUser && !Number.isInteger(Number(savedUser.id))) {
      localStorage.removeItem('marketplace-user')
      return null
    }
    return savedUser ? { ...savedUser, name: normalizeRoleSuffix(savedUser.name, savedUser.role) } : null
  } catch {
    localStorage.removeItem('marketplace-user')
    return null
  }
}

function readSavedToken() {
  const token = localStorage.getItem('marketplace-token') || ''
  if (token.startsWith('demo-token-')) {
    localStorage.removeItem('marketplace-token')
    localStorage.removeItem('marketplace-user')
    return ''
  }
  return token
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser)

  const [token, setToken] = useState(readSavedToken)

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

  useEffect(() => {
    const clearDeletedSession = () => {
      setUser(null)
      setToken('')
    }
    window.addEventListener('marketplace:unauthorized', clearDeletedSession)
    return () => window.removeEventListener('marketplace:unauthorized', clearDeletedSession)
  }, [])

  const login = async (payload) => {
    const response = await loginRequest({ email: payload.email, password: payload.password })
    const nextUser = {
      id: response.user.id,
      name: normalizeRoleSuffix(response.user.name || `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || payload.name || 'Demo', response.user.role),
      email: response.user.email,
      role: response.user.role.toLowerCase(),
    }
    localStorage.setItem('marketplace-token', response.token)
    setToken(response.token)
    setUser(nextUser)
    return nextUser
  }

  const register = async (payload) => {
    const response = await registerRequest({
      firstName: payload.firstName || payload.name?.split(' ')[0] || 'New',
      lastName: payload.lastName || payload.name?.split(' ').slice(1).join(' ') || '',
      email: payload.email,
      password: payload.password || 'demo123',
    })
    const nextUser = {
      id: response.user.id,
      name: normalizeRoleSuffix(response.user.name || `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim(), response.user.role),
      email: response.user.email,
      role: response.user.role.toLowerCase(),
    }
    localStorage.setItem('marketplace-token', response.token)
    setToken(response.token)
    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    setUser(null)
    setToken('')
  }

  const updateUser = (changes) => {
    setUser((current) => current ? { ...current, ...changes } : current)
  }

  const value = useMemo(
    () => ({ user, token, login, register, logout, updateUser }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
