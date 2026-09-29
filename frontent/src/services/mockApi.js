import api from './api'

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams()

  if (filters.search) params.append('search', filters.search)
  if (filters.category) params.append('category', filters.category)
  if (filters.minPrice) params.append('minPrice', String(filters.minPrice))
  if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice))
  if (filters.brand) params.append('brand', filters.brand)
  if (filters.rating) params.append('rating', String(filters.rating))
  if (filters.sort) params.append('sort', filters.sort)

  return api.get(`/catalog/products?${params.toString()}`)
}

export const fetchCategories = async () => api.get('/catalog/categories')

export const fetchProductById = async (id) => {
  if (!id) return null
  try {
    return await api.get(`/catalog/products/${id}`)
  } catch (error) {
    return null
  }
}

export const fetchSellerById = async (id) => {
  if (!id) return null
  const products = await fetchProducts()
  const product = products.find((item) => item.sellerId === Number(id))
  return product?.seller || null
}

export const fetchOrders = async () => {
  const token = localStorage.getItem('marketplace-token')
  return api.get('/orders', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export const fetchReviews = async (productId) => {
  if (!productId) return []
  try {
    return await api.get(`/catalog/products/${productId}/reviews`)
  } catch (error) {
    return []
  }
}

export const fetchFeaturedProducts = async () => api.get('/catalog/featured')
export const fetchNewestProducts = async () => api.get('/catalog/newest')
export const fetchPopularProducts = async () => api.get('/catalog/popular')
export const searchProducts = async (query) => fetchProducts({ search: query })

export const loginRequest = async (payload) => api.post('/auth/login', payload)
export const registerRequest = async (payload) => api.post('/auth/register', payload)
export const createOrderRequest = async (payload, token) => api.post('/orders', payload, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
})
