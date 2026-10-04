import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useFavorites } from '../../context/FavoritesContext'
import { useLanguage } from '../../context/useLanguage'
import { getProducts } from '../../services/marketplaceStore'
import styles from './FavoritesPage.module.scss'

export default function FavoritesPage() {
  const { t } = useLanguage()
  const { favorites, loading } = useFavorites()

  // Нормалізуємо елементи з контексту обраного:
  // Якщо в масиві вже лежать об'єкти товарів — беремо їх,
  // якщо об'єкт має вкладений productId — розпаковуємо його.
  const items = favorites.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return item.product || item
    }
    return item
  }).filter(Boolean)

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p>Loading favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Favorites')}</span>
          <h1>{t('Your saved items')}</h1>
        </div>

        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((product) => {
              const key = typeof product === 'object' ? product.id : product
              return <ProductCard key={key} product={product} />
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>{t('No favorites yet')}</h2>
            <p>{t('Save products you like to compare and buy later.')}</p>
            <Link to="/catalog" className={styles.primaryButton}>{t('Browse catalog')}</Link>
          </div>
        )}
      </div>
    </div>
  )
}
