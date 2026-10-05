import api from './api'
import api from "./api";

// --- Cart API ---
export const fetchCartRequest = async () => api.get("/cart");

export const addToCartRequest = async (productId, quantity = 1) =>
  api.post("/cart/add", { productId, quantity });

export const updateCartQuantityRequest = async (productId, delta) =>
  api.put("/cart/quantity", { productId, delta });

export const removeFromCartRequest = async (productId) =>
  api.del(`/cart/remove/${productId}`);

export const clearCartRequest = async () => api.del("/cart/clear");

// --- Orders API ---
export const createOrder = async (orderData) =>
  api.post("/orders/postorders", orderData);

// --- Orders API ---
export const createOrderRequest = async (orderData) =>
  api.post("/orders/postorders", orderData);

export const fetchUserOrders = async () => api.get("/orders/getorders");

export const fetchOrders = async () => api.get("/orders/getorders");

// --- Favorites API ---
export const fetchFavorites = async () => api.get("/favorites");

export const toggleFavoriteRequest = async (productId) =>
  api.post("/favorites/toggle", { productId });

export const checkIsFavorite = async (productId) =>
  api.get(`/favorites/check/${productId}`);

// --- Catalog API ---
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.brand) params.append("brand", filters.brand);

  if (
    filters.minPrice !== undefined &&
    filters.minPrice !== null &&
    filters.minPrice !== ""
  ) {
    params.append("minPrice", String(filters.minPrice));
  }
  if (
    filters.maxPrice !== undefined &&
    filters.maxPrice !== null &&
    filters.maxPrice !== ""
  ) {
    params.append("maxPrice", String(filters.maxPrice));
  }
  if (
    filters.rating !== undefined &&
    filters.rating !== null &&
    filters.rating !== ""
  ) {
    params.append("rating", String(filters.rating));
  }

  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const queryString = params.toString();
  return api.get(`/catalog/products${queryString ? `?${queryString}` : ""}`);
};

export const fetchCategories = async (n) => {
  try {
    const categories = await api.get("/catalog/categories");
    return n ? categories.slice(0, n) : categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchFeaturedProducts = async () =>
  fetchProducts({ sortBy: "rating", sortOrder: "desc" });

export const fetchNewestProducts = async () =>
  fetchProducts({ sortBy: "createdat", sortOrder: "desc" });

export const fetchPopularProducts = async () =>
  fetchProducts({ sortBy: "rating", sortOrder: "desc" });

export const searchProducts = async (query) => fetchProducts({ search: query });

export const fetchProductById = async (id) => {
  if (!id) return null;
  try {
    return await api.get(`/catalog/products/${id}`);
  } catch (error) {
    return null;
  }
};

export const fetchSellerById = async (sellerId) => {
  if (!sellerId) return null;

  const cleanId = String(sellerId).split(":")[0].trim();

  try {
    const response = await api.get(`/sellers/${cleanId}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching seller:", error);
    return null;
  }
};

// --- Reviews API ---
export const fetchReviews = async (productId) => {
  if (!productId) return [];
  try {
    return await api.get(`/catalog/products/${productId}/reviews`);
  } catch (error) {
    return [];
  }
};

// --- Auth API ---
export const loginRequest = async (payload) => api.post("/auth/login", payload);

export const registerRequest = async (payload) =>
  api.post("/auth/register", payload);

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
