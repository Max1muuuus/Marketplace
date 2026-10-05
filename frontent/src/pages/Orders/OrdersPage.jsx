import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchOrders } from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'
import styles from './OrdersPage.module.scss'

export default function OrdersPage() {
  const { t, formatCurrency } = useLanguage()
  const { user } = useAuth()
  const userId = user?.id
  const [orders, setOrders] = useState([])
  const [loadedUserId, setLoadedUserId] = useState(null)
  const loading = userId != null && loadedUserId !== userId
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId == null) return

    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchOrders()
        if (!cancelled) {
          setOrders(data)
          setError('')
          setLoadedUserId(userId)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load orders.')
          setLoadedUserId(userId)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Orders')}</span>
          <h1>{t('My orders')}</h1>
        </div>

        {!user ? <div className={styles.empty}><p>{t('Sign in to view your orders.')}</p><Link to="/login">{t('Login')}</Link></div> : null}
        {user && loading ? <p className={styles.empty}>{t('Loading orders...')}</p> : null}
        {user && !loading && error ? <p className={styles.empty} role="alert">{t(error)}</p> : null}
        {user && !loading && !error && orders.length === 0 ? <div className={styles.empty}><p>{t('You have not placed any orders yet.')}</p><Link to="/catalog">{t('Browse catalog')}</Link></div> : null}
        {user && !loading && !error && orders.length > 0 ? <div className={styles.list}>
          {orders.map((order) => (
            <article key={order.id} className={styles.card}>
              <div className={styles.headerRow}>
                <div>
                    <p className={styles.label}>{t('Order #')} {order.id}</p>
                    <strong>{orderDate}</strong>
                </div>
                <span className={styles.status}>{t(order.status)}</span>
              </div>

              <div className={styles.meta}>
                <span>{order.items} {t(order.items === 1 ? 'item' : 'items')}</span>
                <span>{order.customer}</span>
                {order.seller ? <span>{order.seller}</span> : null}
              </div>

              <div className={styles.footerRow}>
                <strong>{formatCurrency(order.total)}</strong>
                <Link to="/profile">{t('View details')}</Link>
              </div>
            </article>
          ))}
        </div> : null}
      </div>
    </div>
  )
}
