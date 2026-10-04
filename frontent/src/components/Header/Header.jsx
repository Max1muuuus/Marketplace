import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.scss'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'

const navItems = [
  { to: '/', en: 'Home', uk: 'Головна' },
  { to: '/catalog', en: 'Catalog', uk: 'Каталог' },
  { to: '/categories', en: 'Categories', uk: 'Категорії' },
  { to: '/about', en: 'About', uk: 'Про нас' },
  { to: '/contacts', en: 'Contacts', uk: 'Контакти' },
]

const labels = {
  en: { search: 'Search', dark: 'Dark', light: 'Light', favorites: 'Favorites', cart: 'Cart', logout: 'Logout', login: 'Login', register: 'Register' },
  uk: { search: 'Пошук', dark: 'Темна', light: 'Світла', favorites: 'Обране', cart: 'Кошик', logout: 'Вийти', login: 'Увійти', register: 'Реєстрація' },
}

export default function Header({ language, setLanguage, theme, setTheme }) {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const text = labels[language] || labels.en

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
              {item[language] || item.en}
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
            {theme === 'dark' ? text.dark : text.light}
          </button>

          <Link to="/search" className={styles.searchButton}>{text.search}</Link>
          <Link to="/favorites" className={styles.iconButton} aria-label={text.favorites}>
            ♥
            {favorites.length > 0 ? <span>{favorites.length}</span> : null}
          </Link>
          <Link to="/cart" className={styles.iconButton} aria-label={text.cart}>
            🛒
            {itemCount > 0 ? <span>{itemCount}</span> : null}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <Link to="/profile" className={styles.profileButton}>{user.name}</Link>
              <button type="button" className={styles.logoutButton} onClick={logout}>{text.logout}</button>
            </div>
          ) : (
            <div className={styles.userMenu}>
              <Link to="/login" className={styles.profileButton}>{text.login}</Link>
              <Link to="/register" className={styles.registerButton}>{text.register}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
