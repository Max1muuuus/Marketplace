import { Link } from 'react-router-dom'
import styles from './ProductCard.module.scss'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useLanguage } from '../../context/useLanguage'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { t, formatCurrency } = useLanguage()

  if (!product) return null

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} />
        <button
          type="button"
          className={`${styles.favoriteButton} ${isFavorite(product.id) ? styles.active : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={t('Toggle favorite')}
        >
          ♥
        </button>
        <span className={styles.badge}>{t(product.tag || 'New')}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.headingRow}>
          <Link to={`/product/${product.id}`} className={styles.titleLink}>{product.name}</Link>
          <span className={styles.rating}>★ {product.rating}</span>
        </div>

        <div className={styles.priceRow}>
          <strong>{formatCurrency(product.price)}</strong>
          {product.oldPrice ? <span>{formatCurrency(product.oldPrice)}</span> : null}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} disabled={product.stock <= 0} onClick={() => addToCart(product, 1)}>
            {t(product.stock > 0 ? 'Add to cart' : 'Out of stock')}
          </button>
          <Link to={`/product/${product.id}`} className={styles.secondaryButton}>
            {t('View')}
          </Link>
        </div>
      </div>
    </article>
  )
}
