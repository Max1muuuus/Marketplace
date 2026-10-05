import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.scss'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useLanguage } from '../../context/useLanguage'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contacts', label: 'Contacts' },
]

const labels = {
  en: { search: 'Search', dark: 'Dark', light: 'Light', favorites: 'Favorites', cart: 'Cart', logout: 'Logout', login: 'Login', register: 'Register' },
  uk: { search: 'Пошук', dark: 'Темна', light: 'Світла', favorites: 'Обране', cart: 'Кошик', logout: 'Вийти', login: 'Увійти', register: 'Реєстрація' },
}

export default function Header({ language, setLanguage, theme, setTheme }) {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t } = useLanguage()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>M</span>
          <span className={styles.brandName}>MarketHub</span>
        </Link>

        <nav className={styles.nav} aria-label={t('Main navigation')}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.switchGroup} aria-label={t('Language switcher')}>
            <button
              type="button"
              className={language === 'en' ? styles.activeSwitch : ''}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={language === 'uk' ? styles.activeSwitch : ''}
              onClick={() => setLanguage('uk')}
            >
              UA
            </button>
          </div>

          <button
            type="button"
            className={styles.themeButton}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {t(theme === 'dark' ? 'Dark' : 'Light')}
          </button>

          <Link to="/search" className={styles.searchButton}>{t('Search')}</Link>
          <Link to="/favorites" className={styles.iconButton} aria-label={t('Favorites')}>
            ♥
            {favorites.length > 0 ? <span>{favorites.length}</span> : null}
          </Link>
          <Link to="/cart" className={styles.iconButton} aria-label={t('Cart')}>
            🛒
            {itemCount > 0 ? <span>{itemCount}</span> : null}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              {user.role === 'admin' ? <Link to="/admin" className={styles.profileButton}>{t('Admin')}</Link> : <Link to="/my-products" className={styles.profileButton}>{t('My products')}</Link>}
              <Link to="/profile" className={styles.profileButton}>{user.name}</Link>
              <button type="button" className={styles.logoutButton} onClick={logout}>{t('Logout')}</button>
            </div>
          ) : (
            <div className={styles.userMenu}>
              <Link to="/login" className={styles.profileButton}>{t('Login')}</Link>
              <Link to="/register" className={styles.registerButton}>{t('Register')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
