import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './ProfilePage.module.scss'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className={styles.empty}>
        <h1>Profile</h1>
        <p>Please log in to view your account.</p>
        <Link to="/login" className={styles.primaryButton}>Login</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Profile</span>
          <h1>Welcome, {user.name}</h1>
        </div>

        <div className={styles.layout}>
          <aside className={styles.card}>
            <h3>Account</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </aside>

          <div className={styles.card}>
            <h3>Quick actions</h3>
            <div className={styles.actions}>
              <Link to="/orders" className={styles.primaryButton}>Orders</Link>
              {user.role === 'admin' ? <Link to="/admin" className={styles.secondaryButton}>Admin panel</Link> : <Link to="/my-products" className={styles.secondaryButton}>My products</Link>}
              <Link to="/favorites" className={styles.secondaryButton}>Favorites</Link>
              <Link to="/cart" className={styles.secondaryButton}>Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
