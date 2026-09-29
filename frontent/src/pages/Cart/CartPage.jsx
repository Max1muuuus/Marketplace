import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './CartPage.module.scss'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart()
  const shipping = subtotal > 0 ? 299 : 0
  const total = subtotal + shipping

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Cart</span>
          <h1>Your shopping cart</h1>
        </div>

        {items.length ? (
          <div className={styles.layout}>
            <div className={styles.items}>
              {items.map((item) => (
                <article key={item.id} className={styles.itemCard}>
                  <img src={item.image} alt={item.name} />
                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                      <h3>{item.name}</h3>
                      <button type="button" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                    <div className={styles.priceRow}>
                      <strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(item.price)}</strong>
                    </div>
                    <div className={styles.qtyRow}>
                      <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className={styles.summary}>
              <h3>Order summary</h3>
              <div className={styles.line}><span>Subtotal</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(subtotal)}</strong></div>
              <div className={styles.line}><span>Shipping</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(shipping)}</strong></div>
              <div className={`${styles.line} ${styles.total}`}><span>Total</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(total)}</strong></div>
              <Link to="/checkout" className={styles.checkoutButton}>Proceed to checkout</Link>
            </aside>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>Your cart is empty</h2>
            <p>Add a few products and come back.</p>
            <Link to="/catalog" className={styles.primaryButton}>Browse catalog</Link>
          </div>
        )}
      </div>
    </div>
  )
}
