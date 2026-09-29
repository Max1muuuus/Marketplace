import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './CheckoutPage.module.scss'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  delivery: 'courier',
  payment: 'card',
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const shipping = subtotal > 0 ? 299 : 0
  const total = subtotal + shipping

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    Object.entries(form).forEach(([key, value]) => {
      if (!value && key !== 'delivery' && key !== 'payment') {
        nextErrors[key] = 'This field is required'
      }
    })

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    clearCart()
    alert('Order placed successfully')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Checkout</span>
          <h1>Complete your order</h1>
        </div>

        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div>
                <label>First name</label>
                <input value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} />
                {errors.firstName ? <small>{errors.firstName}</small> : null}
              </div>
              <div>
                <label>Last name</label>
                <input value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} />
                {errors.lastName ? <small>{errors.lastName}</small> : null}
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label>Email</label>
                <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                {errors.email ? <small>{errors.email}</small> : null}
              </div>
              <div>
                <label>Phone</label>
                <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
                {errors.phone ? <small>{errors.phone}</small> : null}
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label>City</label>
                <input value={form.city} onChange={(event) => updateField('city', event.target.value)} />
                {errors.city ? <small>{errors.city}</small> : null}
              </div>
              <div>
                <label>Address</label>
                <input value={form.address} onChange={(event) => updateField('address', event.target.value)} />
                {errors.address ? <small>{errors.address}</small> : null}
              </div>
            </div>

            <div className={styles.optionGroup}>
              <label>Delivery method</label>
              <select value={form.delivery} onChange={(event) => updateField('delivery', event.target.value)}>
                <option value="courier">Courier delivery</option>
                <option value="pickup">Pickup</option>
                <option value="nova">Nova Poshta</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label>Payment method</label>
              <select value={form.payment} onChange={(event) => updateField('payment', event.target.value)}>
                <option value="card">Card</option>
                <option value="cash">Cash on delivery</option>
                <option value="wallet">Digital wallet</option>
              </select>
            </div>

            <button type="submit" className={styles.primaryButton}>Place order</button>
          </form>

          <aside className={styles.summary}>
            <h3>Order summary</h3>
            <div className={styles.productList}>
              {items.length ? (
                items.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <span>{item.name} x {item.quantity}</span>
                    <strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(item.price * item.quantity)}</strong>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>

            <div className={styles.line}><span>Subtotal</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(subtotal)}</strong></div>
            <div className={styles.line}><span>Delivery</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(shipping)}</strong></div>
            <div className={styles.lineTotal}><span>Total</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(total)}</strong></div>

            <Link to="/cart" className={styles.secondaryButton}>Back to cart</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
