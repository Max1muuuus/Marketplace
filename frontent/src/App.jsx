import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'

import HomePage from './pages/Home/HomePage'
import CatalogPage from './pages/Catalog/CatalogPage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import ProductPage from './pages/Product/ProductPage'
import FavoritesPage from './pages/Favorites/FavoritesPage'
import CartPage from './pages/Cart/CartPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrdersPage from './pages/Orders/OrdersPage'
import ProfilePage from './pages/Profile/ProfilePage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import AboutPage from './pages/About/AboutPage'
import ContactsPage from './pages/Contacts/ContactsPage'
import SearchPage from './pages/Search/SearchPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

import './App.css'

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('marketplace-language') || 'en')
  const [theme, setTheme] = useState('dark')

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    localStorage.setItem('marketplace-language', nextLanguage)
  }

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <div className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
              <Header
                language={language}
                setLanguage={changeLanguage}
                theme={theme}
                setTheme={setTheme}
              />
              <main className="page-shell">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
