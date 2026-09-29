import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.scss'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contacts', label: 'Contacts' },
]

export default function Header({ language, setLanguage, theme, setTheme }) {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>M</span>
          <span className={styles.brandName}>MarketHub</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.switchGroup} aria-label="Language switcher">
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
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>

          <Link to="/search" className={styles.searchButton}>Search</Link>
          <Link to="/favorites" className={styles.iconButton} aria-label="Favorites">
            ♥
            {favorites.length > 0 ? <span>{favorites.length}</span> : null}
          </Link>
          <Link to="/cart" className={styles.iconButton} aria-label="Cart">
            🛒
            {itemCount > 0 ? <span>{itemCount}</span> : null}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              {user.role === 'admin' ? <Link to="/admin" className={styles.profileButton}>Admin</Link> : <Link to="/my-products" className={styles.profileButton}>My products</Link>}
              <Link to="/profile" className={styles.profileButton}>{user.name}</Link>
              <button type="button" className={styles.logoutButton} onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className={styles.userMenu}>
              <Link to="/login" className={styles.profileButton}>Login</Link>
              <Link to="/register" className={styles.registerButton}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
