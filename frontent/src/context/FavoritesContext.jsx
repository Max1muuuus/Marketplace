import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchAccountFavorites, saveAccountFavorites } from '../services/mockApi'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const ownerKey = userId ?? 'guest'
  const [favoritesByOwner, setFavoritesByOwner] = useState({ guest: [] })
  const [loadedUserIds, setLoadedUserIds] = useState([])
  const favorites = favoritesByOwner[ownerKey] || []

  useEffect(() => {
    if (userId == null) return
    let cancelled = false
    fetchAccountFavorites().then((savedFavorites) => {
      if (!cancelled) {
        setFavoritesByOwner((current) => ({ ...current, [userId]: savedFavorites }))
        setLoadedUserIds((current) => current.includes(userId) ? current : [...current, userId])
      }
    }).catch((error) => console.error('Unable to load account favorites', error))
    return () => { cancelled = true }
  }, [userId])

  useEffect(() => {
    if (userId != null && loadedUserIds.includes(userId)) {
      saveAccountFavorites(favoritesByOwner[userId] || []).catch((error) => console.error('Unable to save account favorites', error))
    }
  }, [favoritesByOwner, loadedUserIds, userId])

  const toggleFavorite = (id) => {
    setFavoritesByOwner((currentByOwner) => {
      const current = currentByOwner[ownerKey] || []
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      return { ...currentByOwner, [ownerKey]: next }
    })
  }
      })

  const removeFavorites = (ids) => {
    setFavoritesByOwner((current) => ({
      ...current,
      [ownerKey]: (current[ownerKey] || []).filter((id) => !ids.includes(id)),
    }))
  }

  const isFavorite = (id) => {
    return favorites.some((item) => (typeof item === 'object' ? item.id === id : item === id))
  }

  const value = { favorites, toggleFavorite, removeFavorites, isFavorite }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider')
  return context
}
