import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { fetchFavorites, toggleFavoriteRequest } from '../services/mockApi'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { token } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  const loadFavorites = useCallback(async () => {
    // Якщо токена немає, миттєво очищаємо
    if (!token) {
      setFavorites([])
      return
    }

    try {
      setLoading(true)
      const response = await fetchFavorites()
      
      // Розпаковуємо відповідь залежно від структури
      const data = response?.data || response
      const list = Array.isArray(data) ? data : (data?.favorites || data?.items || [])
      
      setFavorites(list)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadFavorites()
  }, [token, loadFavorites])

  const toggleFavorite = async (product) => {
    if (!token) {
      alert('Будь ласка, увійдіть у систему, щоб додавати товари в обране.')
      return
    }

    const productId = typeof product === 'object' ? product?.id : product

    try {
      await toggleFavoriteRequest(productId)

      setFavorites((prev) => {
        const exists = prev.some((item) => (typeof item === 'object' ? item.id === productId : item === productId))

        if (exists) {
          return prev.filter((item) => (typeof item === 'object' ? item.id !== productId : item !== productId))
        } else {
          return typeof product === 'object' ? [...prev, product] : prev
        }
      })

      if (typeof product !== 'object') {
        await loadFavorites()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const isFavorite = (id) => {
    return favorites.some((item) => (typeof item === 'object' ? item.id === id : item === id))
  }

  const value = useMemo(
    () => ({
      favorites,
      loading,
      toggleFavorite,
      isFavorite,
      refreshFavorites: loadFavorites,
    }),
    [favorites, loading, loadFavorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider')
  return context
}