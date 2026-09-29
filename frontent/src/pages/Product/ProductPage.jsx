import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchProductById, fetchReviews, fetchSellerById } from '../../services/mockApi'
import { products } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import styles from './ProductPage.module.scss'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const load = async () => {
      const currentProduct = await fetchProductById(id)
      setProduct(currentProduct)

      if (currentProduct) {
        const currentSeller = await fetchSellerById(currentProduct.sellerId)
        setSeller(currentSeller)
        const productReviews = await fetchReviews(currentProduct.id)
        setReviews(productReviews)
      }
    }

    load()
  }, [id])

  if (!product) {
    return <div className={styles.empty}>Product not found.</div>
  }

  const ratingAverage = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : product.rating

  const related = products.filter((entry) => entry.category === product.category && entry.id !== product.id).slice(0, 4)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.gallerySection}>
          <div className={styles.gallery}>
            <div className={styles.thumbs}>
              {product.gallery.map((image, index) => (
                <button key={image} type="button" className={selectedImage === index ? styles.thumbActive : ''} onClick={() => setSelectedImage(index)}>
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>
            <div className={styles.mainImage}>
              <img src={product.gallery[selectedImage]} alt={product.name} />
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>{product.tag}</span>
              <span className={styles.stock}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
            </div>

            <h1>{product.name}</h1>
            <div className={styles.metaRow}>
              <span className={styles.rating}>★ {product.rating}</span>
              <span>{product.reviewCount} reviews</span>
              <span>Brand: {product.brand}</span>
            </div>

            <div className={styles.priceRow}>
              <strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(product.price)}</strong>
              {product.oldPrice ? <span>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(product.oldPrice)}</span> : null}
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.quantityRow}>
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryButton} onClick={() => addToCart(product, quantity)}>Add to cart</button>
              <button type="button" className={styles.secondaryButton} onClick={() => toggleFavorite(product.id)}>
                {isFavorite(product.id) ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className={styles.sellerCard}>
              <div>
                <strong>{seller?.name || 'Marketplace seller'}</strong>
                <p>{seller?.location || 'Ukraine'}</p>
              </div>
              <span>★ {seller?.rating || 4.8}</span>
            </div>
          </div>
        </div>

        <section className={styles.specsSection}>
          <div className={styles.sectionHeader}>
            <h2>Specifications</h2>
          </div>
          <div className={styles.specGrid}>
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <span>{key}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.reviewsSection}>
          <div className={styles.sectionHeader}>
            <h2>Customer reviews</h2>
            <span className={styles.rating}>★ {ratingAverage}</span>
          </div>

          <div className={styles.reviewList}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <strong>{review.user}</strong>
                  <span>{review.date}</span>
                </div>
                <div className={styles.reviewStars}>{'★'.repeat(review.rating)}</div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.relatedSection}>
          <div className={styles.sectionHeader}>
            <h2>Similar items</h2>
            <Link to="/catalog">View all</Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
