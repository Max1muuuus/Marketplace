import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchCategories, fetchFeaturedProducts, fetchNewestProducts, fetchPopularProducts, fetchProducts } from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'
import styles from './HomePage.module.scss'


export default function HomePage() {
  const { t } = useLanguage()
  const { formatCurrency } = useLanguage()
  const [featured, setFeatured] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [popular, setPopular] = useState([])
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    const load = async () => {
      const [cats, fProducts, newest, pop, products] = await Promise.all([
        fetchCategories(),
        fetchFeaturedProducts(),
        fetchNewestProducts(),
        fetchPopularProducts(),
        fetchProducts(),
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
      setAllProducts(products)
    }

    load()
  }, [])

  const featuredProduct = featured[0]
  const averageRating = allProducts.length
    ? (allProducts.reduce((sum, product) => sum + Number(product.rating || 0), 0) / allProducts.length).toFixed(1)
    : '—'
  const discountedProduct = allProducts.find((product) => product.oldPrice && product.oldPrice > product.price)
  const discountPercent = discountedProduct
    ? Math.round((discountedProduct.oldPrice - discountedProduct.price) / discountedProduct.oldPrice * 100)
    : 0

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
              <div><strong>{allProducts.length}</strong><span>{t('products listed')}</span></div>
              <div><strong>{categories.length}</strong><span>{t('categories')}</span></div>
              <div><strong>{averageRating}{averageRating !== '—' ? '/5' : ''}</strong><span>{t('average product rating')}</span></div>
            </div>
          </div>

          {featuredProduct ? (
            <Link to={`/product/${featuredProduct.id}`} className={styles.heroVisual}>
              <div className={styles.imageCard}>
                <img src={featuredProduct.image} alt={featuredProduct.name} />
              </div>
              <div className={styles.floatingCard}>
                <span>{t('Featured product')}</span>
                <strong>{featuredProduct.name}</strong>
                <em>{formatCurrency(featuredProduct.price)}</em>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{t('Browse categories')}</h2>
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
            <h2>{t('Top rated products')}</h2>
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
            <span className={styles.eyebrow}>{t(discountedProduct ? 'Current offer' : 'Catalog')}</span>
            <h2>{discountedProduct ? discountedProduct.name : t('Browse the catalog')}</h2>
            <p>{discountedProduct ? `${discountPercent}% ${t('off')} · ${formatCurrency(discountedProduct.price)}` : t('Explore the available products and current prices.')}</p>
          </div>
          <Link to={discountedProduct ? `/product/${discountedProduct.id}` : '/catalog'} className={styles.primaryButton}>{t(discountedProduct ? 'View offer' : 'Browse catalog')}</Link>
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
