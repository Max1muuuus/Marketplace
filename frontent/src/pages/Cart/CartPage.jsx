import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/useLanguage'
import styles from './CartPage.module.scss'

export default function CartPage() {
  const { t, formatCurrency } = useLanguage()
  const { items, updateQuantity, removeFromCart, subtotal, loading } = useCart()
  const shipping = subtotal > 0 ? 299 : 0
  const total = subtotal + shipping

  if (loading) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
          <p>Завантаження кошика...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Cart')}</span>
          <h1>{t('Your shopping cart')}</h1>
        </div>

        {items.length ? (
          <div className={styles.layout}>
            <div className={styles.items}>
              {items.map((item) => {
                const id = item.productId ?? item.id
                return (
                  <article key={id} className={styles.itemCard}>
                    <img src={item.image || item.productImage} alt={item.name || item.productName} />
                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                        <h3>{item.name || item.productName}</h3>
                        <button type="button" onClick={() => removeFromCart(id)}>
                          {t('Remove')}
                        </button>
                    </div>
                    <div className={styles.priceRow}>
                      <strong>{formatCurrency(item.price)}</strong>
                    </div>
                    <div className={styles.qtyRow}>
                        <button type="button" onClick={() => updateQuantity(id, -1)}>
                          -
                        </button>
                      <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(id, 1)}>
                          +
                        </button>
                    </div>
                  </div>
                </article>
                )
              })}
            </div>

            <aside className={styles.summary}>
              <h3>{t('Order summary')}</h3>
              <div className={styles.line}>
                <span>{t('Subtotal')}</span>
                <strong>
                  {formatCurrency(subtotal)}
                </strong>
              </div>
              <div className={styles.line}>
                <span>{t('Shipping')}</span>
                <strong>
                  {formatCurrency(shipping)}
                </strong>
              </div>
              <div className={`${styles.line} ${styles.total}`}>
                <span>{t('Total')}</span>
                <strong>
                  {formatCurrency(total)}
                </strong>
              </div>
              <Link to="/checkout" className={styles.checkoutButton}>
                {t('Proceed to checkout')}
              </Link>
            </aside>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>{t('Your cart is empty')}</h2>
            <p>{t('Add a few products and come back.')}</p>
            <Link to="/catalog" className={styles.primaryButton}>{t('Browse catalog')}</Link>
          </div>
        )}
      </div>
    </div>
  )
}
