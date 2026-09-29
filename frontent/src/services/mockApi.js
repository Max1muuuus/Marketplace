import {
  authenticateAccount,
  getCategories,
  getMarketplaceRatings,
  getOrders,
  getProducts,
  getReviews,
  getSellers,
  registerAccount,
} from './marketplaceStore'

export const fetchProducts = async (filters = {}) => {
  let results = getProducts()
  if (filters.search) results = results.filter((product) => `${product.name} ${product.brand} ${product.description}`.toLowerCase().includes(filters.search.toLowerCase()))
  if (filters.category) results = results.filter((product) => product.category === filters.category)
  if (filters.brand) results = results.filter((product) => product.brand === filters.brand)
  if (filters.minPrice) results = results.filter((product) => product.price >= Number(filters.minPrice))
  if (filters.maxPrice) results = results.filter((product) => product.price <= Number(filters.maxPrice))
  if (filters.rating) results = results.filter((product) => product.rating >= Number(filters.rating))
  if (filters.sort === 'price-asc') results.sort((a, b) => a.price - b.price)
  if (filters.sort === 'price-desc') results.sort((a, b) => b.price - a.price)
  return results
}

export const fetchCategories = async () => getCategories()

export const fetchProductById = async (id) => {
  if (!id) return null
  return getProducts().find((product) => product.id === id) || null
}

export const fetchSellerById = async (id) => {
  if (!id) return null
  const products = getProducts()
  const product = products.find((item) => item.sellerId === Number(id))
  return getSellers().find((seller) => seller.id === id) || product?.seller || null
}

export const fetchOrders = async () => getOrders()

export const fetchReviews = async (productId) => {
  if (!productId) return []
  return getReviews().filter((review) => review.productId === productId)
}

export const fetchFeaturedProducts = async () => getProducts().slice(0, 4)
export const fetchNewestProducts = async () => getProducts().slice(-4).reverse()
export const fetchPopularProducts = async () => [...getProducts()].sort((a, b) => b.rating - a.rating).slice(0, 4)
export const searchProducts = async (query) => fetchProducts({ search: query })

export const loginRequest = async (payload) => ({
  user: authenticateAccount(payload.email, payload.password),
  token: `demo-token-${Date.now()}`,
})

export const registerRequest = async (payload) => ({
  user: registerAccount(payload),
  token: `demo-token-${Date.now()}`,
})

export const createOrderRequest = async (payload) => {
  const orders = getOrders()
  const order = { ...payload, id: `ord-${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: 'В обробці' }
  localStorage.setItem('marketplace-orders', JSON.stringify([order, ...orders]))
  return order
}

export const fetchMarketplaceRatings = async () => getMarketplaceRatings()
