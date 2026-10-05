import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useFavorites } from '../../context/FavoritesContext'
import { useLanguage } from '../../context/useLanguage'
import { fetchProducts } from '../../services/mockApi'
import styles from './FavoritesPage.module.scss'

export default function FavoritesPage() {
  const { t } = useLanguage()
  const { favorites } = useFavorites()
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts().then(setProducts).catch((error) => console.error('Unable to load products', error))
  }, [])

  const items = products.filter((product) => favorites.includes(product.id))

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Favorites')}</span>
          <h1>{t('Your saved items')}</h1>
        </div>

        {items.length ? (
          <div className={styles.grid}>
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
