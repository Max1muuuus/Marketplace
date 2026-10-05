import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchCategories, fetchFeaturedProducts, fetchNewestProducts, fetchPopularProducts } from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'
import styles from './HomePage.module.scss'


export default function HomePage() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [popular, setPopular] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const load = async () => {
    // Promise.allSettled чекає виконання всіх запитів, незалежно від того, чи успішні вони
    const results = await Promise.allSettled([
      fetchCategories(6),
        fetchFeaturedProducts(),
        fetchNewestProducts(),
        fetchPopularProducts(),
      ])

    // Перевіряємо статус кожного запиту:
    const cats = results[0].status === 'fulfilled' ? results[0].value : []
    const fProducts = results[1].status === 'fulfilled' ? results[1].value : []
    const newest = results[2].status === 'fulfilled' ? results[2].value : []
    const pop = results[3].status === 'fulfilled' ? results[3].value : []

      setCategories(cats)
      setFeatured(fProducts)
      setNewProducts(newest)
      setPopular(pop)

    //console.log('Categories loaded:', cats)
    console.log('Featured products loaded:', fProducts)
    }

    load()
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{t('New season drop')}</span>
            <h1>{t('Smart shopping for the next wave of living.')}</h1>
            <p>{t('Explore premium essentials, tech finds, and home upgrades curated for modern life.')}</p>
            <div className={styles.ctaRow}>
              <Link to="/catalog" className={styles.primaryButton}>{t('Shop now')}</Link>
              <Link to="/categories" className={styles.secondaryButton}>{t('Explore categories')}</Link>
            </div>
            <div className={styles.statsGrid}>
              <div><strong>24k+</strong><span>{t('happy buyers')}</span></div>
              <div><strong>1.2k</strong><span>{t('new arrivals')}</span></div>
              <div><strong>4.9/5</strong><span>{t('average rating')}</span></div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.imageCard}>
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" alt="Tech product" />
            </div>
            <div className={styles.floatingCard}>
              <span>{t('Top seller')}</span>
              <strong>Smart Watch</strong>
              <em>$240</em>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{t('Popular categories')}</h2>
            <Link to="/categories">{t('View all')}</Link>
          </div>
          
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <Link key={category.id} to={`/catalog?category=${category.slug}`} className={styles.categoryCard}>
                <span>{category.icon}</span>
                <strong>{t(category.name)}</strong>
                <small>{t(category.description)}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{t('Featured products')}</h2>
            <Link to="/catalog">{t('View all')}</Link>
          </div>
          <div className={styles.productGrid}>
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{t('New arrivals')}</h2>
            <Link to="/catalog">{t('View all')}</Link>
          </div>
          <div className={styles.productGrid}>
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{t('Popular this week')}</h2>
            <Link to="/catalog">{t('View all')}</Link>
          </div>
          <div className={styles.productGrid}>
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.promoBanner}>
        <div className={styles.container}>
          <div>
            <span className={styles.eyebrow}>{t('Flash deal')}</span>
            <h2>{t('Mid-season sale')}</h2>
            <p>{t('Up to 50% off on selected gear and accessories for a smarter setup.')}</p>
          </div>
          <Link to="/catalog" className={styles.primaryButton}>{t('Claim offer')}</Link>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoRow}>
            <div>
              <span className={styles.eyebrow}>{t('Why choose us')}</span>
              <h2>{t('Built for better buying decisions.')}</h2>
            </div>
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <span>01</span>
                <h3>{t('Curated quality')}</h3>
                <p>{t('Only trusted brands and products selected for long-term value.')}</p>
              </div>
              <div className={styles.infoCard}>
                <span>02</span>
                <h3>{t('Fast delivery')}</h3>
                <p>{t('Tracked shipping and quick dispatch across the country.')}</p>
              </div>
              <div className={styles.infoCard}>
                <span>03</span>
                <h3>{t('Secure checkout')}</h3>
                <p>{t('Protected payments, easy returns, and clear order tracking.')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
