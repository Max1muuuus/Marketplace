import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../../services/mockApi'
import styles from './OrdersPage.module.scss'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Помилка завантаження замовлень:', error)
      }
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
          {orders.map((order) => {
            // Безпечно рахуємо кількість позицій/товарів
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((sum, i) => sum + (i.quantity || 1), 0)
              : typeof order.items === 'number'
              ? order.items
              : 0

            // Беремо дату та суму з урахуванням назв полів із C# DTO
            const orderDate = order.date || order.createdAt ? new Date(order.date || order.createdAt).toLocaleDateString('uk-UA') : '—'
            const totalAmount = order.total ?? order.totalAmount ?? order.price ?? 0

            return (
              <article key={order.id} className={styles.card}>
                <div className={styles.headerRow}>
                  <div>
                    <p className={styles.label}>Order #{order.id}</p>
                    <strong>{orderDate}</strong>
                  </div>
                  <span className={styles.status}>{order.status || 'Processing'}</span>
                </div>

                <div className={styles.meta}>
                  {/* ВИПРАВЛЕНО: виводимо число itemCount замість об'єкта order.items */}
                  <span>{itemCount} items</span>
                  {order.customer && <span>{typeof order.customer === 'object' ? order.customer.name : order.customer}</span>}
                  {order.seller && <span>{typeof order.seller === 'object' ? order.seller.name : order.seller}</span>}
                </div>

                <div className={styles.footerRow}>
                  <strong>
                    {new Intl.NumberFormat('uk-UA', {
                      style: 'currency',
                      currency: 'UAH',
                      maximumFractionDigits: 0,
                    }).format(totalAmount)}
                  </strong>
                  <Link to="/profile">View details</Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}