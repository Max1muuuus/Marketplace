import { Link } from 'react-router-dom'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandBlock}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>M</span>
            <span className={styles.brandName}>MarketHub</span>
          </div>
          <p>Marketplace for everyday upgrades crafted for modern digital living.</p>
        </div>

        <div className={styles.linksWrap}>
          <div>
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/contacts">Contacts</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/contacts">Help center</Link>
            <Link to="/checkout">Shipping</Link>
            <Link to="/orders">Returns</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:hello@markethub.io">hello@markethub.io</a>
            <a href="tel:+14155550149">+1 (415) 555-0149</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
