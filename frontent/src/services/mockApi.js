<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
