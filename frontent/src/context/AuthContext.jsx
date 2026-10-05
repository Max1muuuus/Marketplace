import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loginRequest, registerRequest } from '../services/mockApi'

const AuthContext = createContext(null)

function normalizeRoleSuffix(name, role) {
  const suffix = role === 'admin' ? ' Admin' : role === 'customer' ? ' User' : ''
  return suffix && name?.endsWith(suffix) ? name.slice(0, -suffix.length).trim() : name
}

function readSavedUser() {
  try {
    const savedUser = JSON.parse(localStorage.getItem('marketplace-user') || 'null')
    return savedUser ? { ...savedUser, name: normalizeRoleSuffix(savedUser.name, savedUser.role) } : null
  } catch {
    localStorage.removeItem('marketplace-user')
    return null
  }
}

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

  const parseName = (name = '') => {
    const parts = name.trim().split(' ')
    return {
      firstName: parts[0] || 'User',
      lastName: parts.slice(1).join(' ') || 'Customer',
    }
  }

  const mapUser = (backendUser) => ({
    id: backendUser.id,
    name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    email: backendUser.email,
    role: backendUser.role,
  })

  const logout = useCallback(() => {
      localStorage.removeItem('marketplace-token')
    localStorage.removeItem('marketplace-user')
    setUser(null)
    setToken('')
  }, [])

  const login = useCallback(
    async (payload) => {
      try {
        const response = await loginRequest({
          email: payload.email,
          password: payload.password,
        })

        const nextUser = mapUser(response.user)

        if (response.token) {
          localStorage.setItem('marketplace-token', response.token)
    }
  }, [token])

        setToken(response.token || '')
    setUser(nextUser)
    return nextUser
      } catch (error) {
        logout()
        throw error
  }
    },
    [logout]
  )

  const register = useCallback(
    async (payload) => {
      const { firstName, lastName } = parseName(
        payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`
      )

      try {
    const response = await registerRequest({
          firstName: payload.firstName || firstName,
          lastName: payload.lastName || lastName,
      email: payload.email,
          password: payload.password,
    })

        const nextUser = mapUser(response.user)

        if (response.token) {
          localStorage.setItem('marketplace-token', response.token)
    }

        setToken(response.token || '')
    setUser(nextUser)
    return nextUser
      } catch (error) {
        logout()
        throw error
  }
    },
    [logout]
  )

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
