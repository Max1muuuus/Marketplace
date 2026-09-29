import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'
import styles from './OrdersPage.module.scss'

export default function OrdersPage() {
  const { t, formatCurrency } = useLanguage()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders()
      setOrders(data)
    }

    load()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Orders')}</span>
          <h1>{t('My orders')}</h1>
        </div>

        <div className={styles.list}>
          {orders.map((order) => (
            <article key={order.id} className={styles.card}>
              <div className={styles.headerRow}>
                <div>
                  <p className={styles.label}>{t('Order #')}{order.id}</p>
                  <strong>{order.date}</strong>
                </div>
                <span className={styles.status}>{t(order.status)}</span>
              </div>

              <div className={styles.meta}>
                <span>{order.items} {t('items')}</span>
                <span>{order.customer}</span>
                <span>{order.seller}</span>
              </div>

              <div className={styles.footerRow}>
                <strong>{formatCurrency(order.total)}</strong>
                <Link to="/profile">{t('View details')}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
