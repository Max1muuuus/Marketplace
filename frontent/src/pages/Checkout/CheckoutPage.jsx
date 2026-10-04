import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrderRequest } from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'

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
  const navigate = useNavigate()
  const { user } = useAuth()
    const { items, subtotal, getCheckoutPayload, clearCart } = useCart()
    const { t, formatCurrency } = useLanguage()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const shipping = subtotal > 0 ? 299 : 0
  const total = subtotal + shipping

  // Автозаповнення даних з профілю користувача
  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        firstName: user.firstName || current.firstName,
        lastName: user.lastName || current.lastName,
        email: user.email || current.email,
      }))
    }
  }, [user])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setSubmitError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!items.length) {
      setSubmitError('Ваш кошик порожній')
      return
    }

    Object.entries(form).forEach(([key, value]) => {
      if (!value && key !== 'delivery' && key !== 'payment') {
        nextErrors[key] = 'Це поле є обов’язковим'
      }
    })

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    try {
      setLoading(true)
      setSubmitError('')

      // Формуємо структуру замовлення відповідно до вимог бетенду
      const orderPayload = {
        items: getCheckoutPayload(),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          address: form.address,
        },
        deliveryMethod: form.delivery,
        paymentMethod: form.payment,
        subtotal,
        shippingFee: shipping,
        totalAmount: total,
  }

      await createOrderRequest(orderPayload)

      // Очищаємо локальний кошик та перенаправляємо на сторінку замовлень
      await clearCart()
      navigate('/orders')
    } catch (error) {
      console.error('Помилка при оформленні замовлення:', error)
      setSubmitError(error.message || 'Не вдалося оформити замовлення. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Checkout')}</span>
          <h1>{t('Complete your order')}</h1>
        </div>

        {submitError && <div className={styles.errorMessage}>{submitError}</div>}

        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div>
                <label>First name</label>
                <input
                  value={form.firstName}
                  onChange={(event) => updateField('firstName', event.target.value)}
                  disabled={loading}
                />
                {errors.firstName ? <small>{errors.firstName}</small> : null}
              </div>
              <div>
                <label>Last name</label>
                <input
                  value={form.lastName}
                  onChange={(event) => updateField('lastName', event.target.value)}
                  disabled={loading}
                />
                {errors.lastName ? <small>{errors.lastName}</small> : null}
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label>{t('Email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  disabled={loading}
                />
                {errors.email ? <small>{errors.email}</small> : null}
              </div>
              <div>
                <label>{t('Phone')}</label>
                <input
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  disabled={loading}
                />
                {errors.phone ? <small>{errors.phone}</small> : null}
              </div>
            </div>

            <div className={styles.grid}>
              <div>
                <label>{t('City')}</label>
                <input
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  disabled={loading}
                />
                {errors.city ? <small>{errors.city}</small> : null}
              </div>
              <div>
                <label>{t('Address')}</label>
                <input
                  value={form.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  disabled={loading}
                />
                {errors.address ? <small>{errors.address}</small> : null}
              </div>
            </div>

            <div className={styles.optionGroup}>
              <label>{t('Delivery method')}</label>
              <select
                value={form.delivery}
                onChange={(event) => updateField('delivery', event.target.value)}
                disabled={loading}
              >
                <option value="courier">Courier delivery</option>
                <option value="pickup">Pickup</option>
                <option value="nova">Nova Poshta</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label>{t('Payment method')}</label>
              <select
                value={form.payment}
                onChange={(event) => updateField('payment', event.target.value)}
                disabled={loading}
              >
                <option value="card">Card</option>
                <option value="cash">Cash on delivery</option>
                <option value="wallet">Digital wallet</option>
              </select>
            </div>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading || !items.length}
            >
              {loading ? 'Processing...' : 'Place order'}
            </button>
          </form>

          <aside className={styles.summary}>
            <h3>{t('Order summary')}</h3>
            <div className={styles.productList}>
              {items.length ? (
                items.map((item) => (
                  <div key={item.id || item.productId} className={styles.itemRow}>
                    <span>
                      {item.name || item.title} x {item.quantity}
                    </span>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                ))
              ) : (
                <p>{t('Your cart is empty.')}</p>
              )}
            </div>

            <div className={styles.line}><span>{t('Subtotal')}</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className={styles.line}><span>{t('Delivery')}</span><strong>{formatCurrency(shipping)}</strong></div>
            <div className={styles.lineTotal}><span>{t('Total')}</span><strong>{formatCurrency(total)}</strong></div>

            <Link to="/cart" className={styles.secondaryButton}>{t('Back to cart')}</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
