import { Link } from 'react-router-dom'
import styles from './Footer.module.scss'
import { useLanguage } from '../../context/useLanguage'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandBlock}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>M</span>
            <span className={styles.brandName}>MarketHub</span>
          </div>
          <p>{t('Marketplace for everyday upgrades crafted for modern digital living.')}</p>
        </div>

        <div className={styles.linksWrap}>
          <div>
            <h4>{t('Company')}</h4>
            <Link to="/about">{t('About')}</Link>
            <Link to="/catalog">{t('Catalog')}</Link>
            <Link to="/contacts">{t('Contacts')}</Link>
          </div>
          <div>
            <h4>{t('Support')}</h4>
            <Link to="/contacts">{t('Help center')}</Link>
            <Link to="/checkout">{t('Shipping')}</Link>
            <Link to="/orders">{t('Returns')}</Link>
          </div>
          <div>
            <h4>{t('Contact')}</h4>
            <a href="mailto:hello@markethub.io">hello@markethub.io</a>
            <a href="tel:+14155550149">+1 (415) 555-0149</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
