import { Link } from 'react-router-dom'
import styles from './ProductCard.module.scss'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  if (!product) return null

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} />
        <button
          type="button"
          className={`${styles.favoriteButton} ${isFavorite(product.id) ? styles.active : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label="Toggle favorite"
        >
          ♥
        </button>
        <span className={styles.badge}>{product.tag || 'New'}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.headingRow}>
          <Link to={`/product/${product.id}`} className={styles.titleLink}>{product.name}</Link>
          <span className={styles.rating}>★ {product.rating}</span>
        </div>

        <div className={styles.priceRow}>
          <strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(product.price)}</strong>
          {product.oldPrice ? <span>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(product.oldPrice)}</span> : null}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={() => addToCart(product, 1)}>
            Add to cart
          </button>
          <Link to={`/product/${product.id}`} className={styles.secondaryButton}>
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
