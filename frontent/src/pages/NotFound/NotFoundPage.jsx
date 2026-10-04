import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>404</span>
        <h1>Page not found</h1>
        <p>The page you’re looking for doesn’t exist or was moved.</p>
        <Link to="/" className={styles.primaryButton}>Back home</Link>
      </div>
    </div>
  )
}
