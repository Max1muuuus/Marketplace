import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'
import { useLanguage } from '../../context/useLanguage'

export default function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>404</span>
        <h1>{t('Page not found')}</h1>
        <p>{t('The page you’re looking for doesn’t exist or was moved.')}</p>
        <Link to="/" className={styles.primaryButton}>{t('Back home')}</Link>
      </div>
    </div>
  )
}
