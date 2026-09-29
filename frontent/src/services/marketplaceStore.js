import { categories, orders, products, reviews, sellers, users } from '../data/mockData'

const seeds = { categories, orders, products, reviews, sellers, users }

function normalizeRoleSuffix(name, role) {
  const suffix = role === 'admin' ? ' Admin' : role === 'customer' ? ' User' : ''
  return suffix && name?.endsWith(suffix) ? name.slice(0, -suffix.length).trim() : name
}

export function getCollection(name) {
  const saved = localStorage.getItem(`marketplace-${name}`)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      localStorage.removeItem(`marketplace-${name}`)
    }
  }
  return structuredClone(seeds[name] || [])
}

export function saveCollection(name, items) {
  localStorage.setItem(`marketplace-${name}`, JSON.stringify(items))
  return items
}

export function getProducts() {
  return getCollection('products')
}

export function getCategories() {
  return getCollection('categories')
}

export function getSellers() {
  return getCollection('sellers')
}

export function getUsers() {
  const allUsers = getCollection('users').map((user) => ({
    ...user,
    name: normalizeRoleSuffix(user.name, user.role),
  }))
  const admin = { id: 'u-admin', name: 'MarketHub', email: 'admin@markethub.com', role: 'admin', createdAt: '2026-09-29' }
  return allUsers.some((user) => user.email === admin.email) ? allUsers : [...allUsers, admin]
}

export function getOrders() {
  return getCollection('orders')
}

export function getReviews() {
  return getCollection('reviews')
}

export function getMarketplaceRatings() {
  const usersById = new Map(getUsers().map((user) => [user.id, user]))
  return getCollection('marketplace-ratings').map((rating) => ({
    ...rating,
    userName: normalizeRoleSuffix(rating.userName, usersById.get(rating.userId)?.role),
  }))
}

export function saveMarketplaceRating(rating) {
  const ratings = getMarketplaceRatings()
  const previous = ratings.find((entry) => entry.userId === rating.userId)
  const nextRating = { ...rating, id: previous?.id || `mr-${Date.now()}` }
  return saveCollection(
    'marketplace-ratings',
    previous ? ratings.map((entry) => entry.userId === rating.userId ? nextRating : entry) : [...ratings, nextRating],
  )
}

export function createProduct(product) {
  const allProducts = getProducts()
  const nextProduct = {
    ...product,
    id: `p-${Date.now()}`,
    rating: 0,
    reviewCount: 0,
    condition: product.condition || 'Новий',
    gallery: [product.image],
    specs: {},
    status: Number(product.stock) > 0 ? 'in-stock' : 'out-of-stock',
    tag: product.tag || 'New',
  }
  return saveCollection('products', [...allProducts, nextProduct])
}

export function updateProduct(id, changes) {
  return saveCollection('products', getProducts().map((product) => product.id === id ? { ...product, ...changes } : product))
}

export function deleteProduct(id) {
  return saveCollection('products', getProducts().filter((product) => product.id !== id))
}

export function registerAccount({ firstName, lastName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = getCollection('accounts')
  if (accounts.some((account) => account.email === normalizedEmail) || normalizedEmail === 'admin@markethub.com') {
    throw new Error('An account with this email already exists')
  }

  const account = {
    id: `u-${Date.now()}`,
    name: `${firstName || ''} ${lastName || ''}`.trim(),
    email: normalizedEmail,
    password,
    role: 'customer',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  saveCollection('accounts', [...accounts, account])
  saveCollection('users', [...getCollection('users'), { ...account, password: undefined }])
  return account
}

export function authenticateAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail === 'admin@markethub.com' && password === 'admin123') {
    return { id: 'u-admin', name: 'MarketHub', email: normalizedEmail, role: 'admin' }
  }

  const account = getCollection('accounts').find((entry) => entry.email === normalizedEmail && entry.password === password)
  if (!account) throw new Error('Invalid email or password')
  const profile = getUsers().find((user) => user.id === account.id)
  if (!profile) throw new Error('This account is no longer active')
  return { ...account, ...profile }
}