import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchAccountCart, saveAccountCart } from '../services/mockApi'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const ownerKey = userId ?? 'guest'
  const [itemsByOwner, setItemsByOwner] = useState({ guest: [] })
  const [loadedUserIds, setLoadedUserIds] = useState([])
  const items = itemsByOwner[ownerKey] || []

  useEffect(() => {
    if (userId == null) return
    let cancelled = false
    fetchAccountCart().then((savedItems) => {
      if (!cancelled) {
        const inStockItems = savedItems.map((item) => ({
          ...item,
          quantity: Math.min(item.quantity, item.stock),
        })).filter((item) => item.quantity > 0)
        setItemsByOwner((current) => ({ ...current, [userId]: inStockItems }))
        setLoadedUserIds((current) => current.includes(userId) ? current : [...current, userId])
      }
    }).catch((error) => console.error('Unable to load account cart', error))
    return () => { cancelled = true }
  }, [userId])

  useEffect(() => {
    if (userId != null && loadedUserIds.includes(userId)) {
      saveAccountCart(itemsByOwner[userId] || []).catch((error) => console.error('Unable to save account cart', error))
    }
  }, [itemsByOwner, loadedUserIds, userId])

  const addToCart = (product, quantity = 1) => {
    setItemsByOwner((currentByOwner) => {
      const current = currentByOwner[ownerKey] || []
      const stock = Number(product.stock) || 0
      if (stock <= 0) return currentByOwner
      const existing = current.find((item) => item.id === product.id)
      const next = existing
        ? current.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(stock, item.quantity + quantity) } : item,
        )
        : [...current, { ...product, quantity: Math.min(stock, quantity) }]
      return { ...currentByOwner, [ownerKey]: next }
    })
  }
  }, [])

  const updateQuantity = (id, delta) => {
    setItemsByOwner((currentByOwner) => {
      const current = currentByOwner[ownerKey] || []
      const next = current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.min(Number(item.stock) || 0, Math.max(0, item.quantity + delta)) } : item,
        )
        .filter((item) => item.quantity > 0)
      return { ...currentByOwner, [ownerKey]: next }
    })
  }
}, [])

  const getCheckoutPayload = useCallback(() => {
    return items.map((item) => {
      // Гарантуємо, що productId є саме примітивом (string/number), а не об'єктом
      const rawId = item.productId ?? item.id ?? item.product?.id
      const cleanProductId = typeof rawId === 'object' ? (rawId.id || rawId._id) : rawId

  const removeFromCart = (id) => setItemsByOwner((current) => ({
    ...current,
    [ownerKey]: (current[ownerKey] || []).filter((item) => item.id !== id),
  }))

  const clearCart = () => setItemsByOwner((current) => ({ ...current, [ownerKey]: [] }))

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const value = { items, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, itemCount }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
