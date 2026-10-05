import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  fetchCartRequest,
  addToCartRequest,
  updateCartQuantityRequest,
  removeFromCartRequest,
  clearCartRequest,
} from '../services/mockApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  // Допоміжна функція для безпечного витягування масиву елементів
  const extractItems = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray(data.items)) return data.items
    return []
  }

  const fetchCart = useCallback(async () => {
    if (!token) {
      setItems([])
      return
    }

    try {
      setLoading(true)
      const data = await fetchCartRequest()
      setItems(extractItems(data))
    } catch (error) {
      console.error('Помилка при завантаженні кошика:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      // Перевіряємо ID: якщо product є об'єктом з id/productId
      const productId = typeof product === 'object' ? (product.id ?? product.productId) : product
      const data = await addToCartRequest(productId, quantity)
      if (data) setItems(extractItems(data))
    } catch (error) {
      console.error('Помилка додавання товару в кошик:', error)
      }
  }, [])

  const updateQuantity = useCallback(async (productId, delta) => {
    try {
      const data = await updateCartQuantityRequest(productId, delta)
      if (data) setItems(extractItems(data))
    } catch (error) {
      console.error('Помилка оновлення кількості:', error)
    }
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    try {
      const data = await removeFromCartRequest(productId)
      if (data) setItems(extractItems(data))
    } catch (error) {
      console.error('Помилка видалення товару:', error)
  }
  }, [])

  const clearCart = useCallback(async () => {
  try {
    await clearCartRequest()
  } catch (error) {
    if (!error.message?.includes('JSON')) {
      console.error('Помилка очищення кошика:', error)
    }
  } finally {
    setItems([])
  }
}, [])

  const getCheckoutPayload = useCallback(() => {
    return items.map((item) => {
      // Гарантуємо, що productId є саме примітивом (string/number), а не об'єктом
      const rawId = item.productId ?? item.id ?? item.product?.id
      const cleanProductId = typeof rawId === 'object' ? (rawId.id || rawId._id) : rawId

      return {
        productId: cleanProductId,
        quantity: item.quantity,
  }
    })
  }, [items])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCheckoutPayload,
      subtotal,
      itemCount,
      refreshCart: fetchCart,
    }),
    [
      items,
      loading,
      subtotal,
      itemCount,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCheckoutPayload,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
