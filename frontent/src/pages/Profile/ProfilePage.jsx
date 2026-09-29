import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import styles from './ProfilePage.module.scss'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  if (!user) {
    return (
      <div className={styles.empty}>
        <h1>{t('Profile')}</h1>
        <p>{t('Please log in to view your account.')}</p>
        <Link to="/login" className={styles.primaryButton}>{t('Login')}</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Profile')}</span>
          <h1>{t('Welcome,')} {user.name}</h1>
        </div>

        <div className={styles.layout}>
          <aside className={styles.card}>
            <h3>{t('Account')}</h3>
            <p><strong>{t('Name:')}</strong> {user.name}</p>
            <p><strong>{t('Email:')}</strong> {user.email}</p>
            <p><strong>{t('Role:')}</strong> {t(user.role === 'customer' ? 'User' : user.role)}</p>
          </aside>

          <div className={styles.card}>
            <h3>{t('Quick actions')}</h3>
            <div className={styles.actions}>
              <Link to="/orders" className={styles.primaryButton}>{t('Orders')}</Link>
              {user.role === 'admin' ? <Link to="/admin" className={styles.secondaryButton}>{t('Admin panel')}</Link> : <Link to="/my-products" className={styles.secondaryButton}>{t('My products')}</Link>}
              <Link to="/favorites" className={styles.secondaryButton}>{t('Favorites')}</Link>
              <Link to="/cart" className={styles.secondaryButton}>{t('Cart')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
