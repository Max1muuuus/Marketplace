import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../../services/mockApi'
import styles from './OrdersPage.module.scss'

export default function OrdersPage() {
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
          <span className={styles.eyebrow}>Orders</span>
          <h1>My orders</h1>
        </div>

        <div className={styles.list}>
          {orders.map((order) => (
            <article key={order.id} className={styles.card}>
              <div className={styles.headerRow}>
                <div>
                  <p className={styles.label}>Order #{order.id}</p>
                  <strong>{order.date}</strong>
                </div>
                <span className={styles.status}>{order.status}</span>
              </div>

              <div className={styles.meta}>
                <span>{order.items} items</span>
                <span>{order.customer}</span>
                <span>{order.seller}</span>
              </div>

              <div className={styles.footerRow}>
                <strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(order.total)}</strong>
                <Link to="/profile">View details</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
