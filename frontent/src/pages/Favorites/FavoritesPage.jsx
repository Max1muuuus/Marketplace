import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { products } from '../../data/mockData'
import { useFavorites } from '../../context/FavoritesContext'
import styles from './FavoritesPage.module.scss'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const items = products.filter((product) => favorites.includes(product.id))

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Favorites</span>
          <h1>Your saved items</h1>
        </div>

        {items.length ? (
          <div className={styles.grid}>
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>No favorites yet</h2>
            <p>Save products you like to compare and buy later.</p>
            <Link to="/catalog" className={styles.primaryButton}>Browse catalog</Link>
          </div>
        )}
      </div>
    </div>
  )
}
