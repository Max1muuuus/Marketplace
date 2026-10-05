import api from './api'

const queryString = (filters) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value)
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const fetchProducts = async (filters = {}) => api.get(`/catalog/products${queryString(filters)}`)

export const fetchProductById = async (id) => {
  if (!id) return null
  try {
    return await api.get(`/catalog/products/${id}`)
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

export const fetchSellerById = async (id) => (await fetchProducts()).find((product) => product.sellerId === Number(id))?.seller || null

export const fetchCategories = async () => api.get('/catalog/categories')

export const fetchOrders = async () => (await api.get('/orders')).map((order) => ({
  ...order,
  date: order.createdAt?.slice(0, 10) || '',
  customer: order.customerName,
  total: order.totalAmount,
  items: order.items?.reduce((count, item) => count + item.quantity, 0) || 0,
  seller: '',
}))

export const fetchReviews = async (productId) => productId ? api.get(`/catalog/products/${productId}/reviews`) : []

export const fetchFeaturedProducts = async () => api.get('/catalog/featured')
export const fetchNewestProducts = async () => api.get('/catalog/newest')
export const fetchPopularProducts = async () => api.get('/catalog/popular')
export const searchProducts = async (query) => fetchProducts({ search: query })

export const loginRequest = async (payload) => api.post('/auth/login', payload)

export const registerRequest = async (payload) => api.post('/auth/register', payload)

export const createOrderRequest = async (payload) => api.post('/orders', payload)

export const createReviewRequest = async (productId, payload) => api.post(`/catalog/products/${productId}/reviews`, payload)

export const fetchAccountCart = async () => api.get('/account/cart')
export const saveAccountCart = async (items) => api.put('/account/cart', {
  items: items.map((item) => ({ productId: Number(item.id), quantity: item.quantity })),
})
export const fetchAccountFavorites = async () => api.get('/account/favorites')
export const saveAccountFavorites = async (productIds) => api.put('/account/favorites', { productIds })
export const fetchMyProducts = async () => api.get('/catalog/my-products')
export const createMyProduct = async (product) => api.post('/catalog/my-products', product)
export const updateMyProduct = async (id, product) => api.put(`/catalog/my-products/${id}`, product)
export const deleteMyProduct = async (id) => api.del(`/catalog/my-products/${id}`)
export const fetchAdminUsers = async () => api.get('/admin/users')
export const deleteAdminUser = async (id) => api.del(`/admin/users/${id}`)
export const deleteAdminOrder = async (id) => api.del(`/admin/orders/${id}`)
export const fetchMarketplaceRatings = async () => api.get('/catalog/ratings')
export const fetchAccountRating = async () => api.get('/account/rating')
export const saveAccountRating = async (rating) => api.put('/account/rating', rating)
export const fetchAdminReviews = async () => api.get('/admin/reviews')
export const fetchAdminRatings = async () => api.get('/admin/ratings')
export const deleteAdminReview = async (id) => api.del(`/admin/reviews/${id}`)
export const deleteAdminRating = async (id) => api.del(`/admin/ratings/${id}`)
export const createCategory = async (category) => api.post('/admin/categories', category)
export const updateCategory = async (id, category) => api.put(`/admin/categories/${id}`, category)
export const deleteCategory = async (id) => api.del(`/admin/categories/${id}`)
export const fetchSellers = async () => api.get('/catalog/sellers')
export const createSeller = async (seller) => api.post('/admin/sellers', seller)
export const updateSeller = async (id, seller) => api.put(`/admin/sellers/${id}`, seller)
export const deleteSeller = async (id) => api.del(`/admin/sellers/${id}`)
