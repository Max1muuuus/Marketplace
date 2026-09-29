import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchProductById, fetchReviews, fetchSellerById } from '../../services/mockApi'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import styles from './ProductPage.module.scss'
import { getProducts, saveProductReview } from '../../services/marketplaceStore'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { t, formatCurrency } = useLanguage()
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewRating, setReviewRating] = useState('5')
  const [reviewText, setReviewText] = useState('')
  const [reviewSaved, setReviewSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const currentProduct = await fetchProductById(id)
      setProduct(currentProduct)

      if (currentProduct) {
        const currentSeller = await fetchSellerById(currentProduct.sellerId)
        setSeller(currentSeller)
        const productReviews = await fetchReviews(currentProduct.id)
        setReviews(productReviews)
        const ownReview = productReviews.find((review) => review.userId === user?.id)
        if (ownReview) {
          setReviewRating(String(ownReview.rating))
          setReviewText(ownReview.text)
        }
      }
    }

    load()
  }, [id, user?.id])

  const submitReview = async (event) => {
    event.preventDefault()
    if (!user || !product) return

    saveProductReview(product.id, {
      userId: user.id,
      user: user.name,
      rating: Number(reviewRating),
      text: reviewText.trim(),
    })

    const [updatedProduct, updatedReviews] = await Promise.all([
      fetchProductById(product.id),
      fetchReviews(product.id),
    ])
    setProduct(updatedProduct)
    setReviews(updatedReviews)
    setReviewSaved(true)
  }

  if (!product) {
    return <div className={styles.empty}>{t('Product not found.')}</div>
  }

  const ratingAverage = Number(product.rating || 0).toFixed(1)

  const related = getProducts().filter((entry) => entry.category === product.category && entry.id !== product.id).slice(0, 4)

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
              <span className={styles.badge}>{t(product.tag)}</span>
              <span className={styles.stock}>{t(product.stock > 0 ? 'In stock' : 'Out of stock')}</span>
            </div>

            <h1>{product.name}</h1>
            <div className={styles.metaRow}>
              <span className={styles.rating}>★ {product.rating}</span>
              <span>{product.reviewCount} {t('reviews')}</span>
              <span>{t('Brand:')} {product.brand}</span>
            </div>

            <div className={styles.priceRow}>
              <strong>{formatCurrency(product.price)}</strong>
              {product.oldPrice ? <span>{formatCurrency(product.oldPrice)}</span> : null}
            </div>

            <p className={styles.description}>{t(product.description)}</p>

            <div className={styles.quantityRow}>
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryButton} onClick={() => addToCart(product, quantity)}>{t('Add to cart')}</button>
              <button type="button" className={styles.secondaryButton} onClick={() => toggleFavorite(product.id)}>
                {t(isFavorite(product.id) ? 'Saved' : 'Save')}
              </button>
            </div>

            <div className={styles.sellerCard}>
              <div>
                <strong>{seller?.name || t('Marketplace seller')}</strong>
                <p>{t(seller?.location || 'Ukraine')}</p>
              </div>
              <span>★ {seller?.rating || 4.8}</span>
            </div>
          </div>
        </div>

        <section className={styles.specsSection}>
          <div className={styles.sectionHeader}>
            <h2>{t('Specifications')}</h2>
          </div>
          <div className={styles.specGrid}>
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <span>{t(key)}</span>
                <strong>{t(value)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.reviewsSection}>
          <div className={styles.sectionHeader}>
            <h2>{t('Customer reviews')}</h2>
            <span className={styles.rating}>★ {ratingAverage}</span>
          </div>

          {user ? (
            <form className={styles.reviewForm} onSubmit={submitReview}>
              <label>
                {t('Your rating')}
                <select value={reviewRating} onChange={(event) => { setReviewRating(event.target.value); setReviewSaved(false) }}>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
                </select>
              </label>
              <label>
                {t('Write a review')}
                <textarea required maxLength="1000" value={reviewText} placeholder={t('Share your experience with this product')} onChange={(event) => { setReviewText(event.target.value); setReviewSaved(false) }} />
              </label>
              <div className={styles.reviewFormAction}>
                <button type="submit">{t(reviews.some((review) => review.userId === user.id) ? 'Update review' : 'Submit review')}</button>
                {reviewSaved ? <span role="status">{t('Review saved.')}</span> : null}
              </div>
            </form>
          ) : (
            <p className={styles.reviewSignIn}><Link to="/login">{t('Log in')}</Link> {t('to leave a review.')}</p>
          )}

          <div className={styles.reviewList}>
            {reviews.length ? reviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <strong>{review.user}</strong>
                  <span>{review.date}</span>
                </div>
                <div className={styles.reviewStars}>{'★'.repeat(review.rating)}</div>
                <p>{t(review.text)}</p>
              </article>
            )) : <p>{t('No reviews yet.')}</p>}
          </div>
        </section>

        <section className={styles.relatedSection}>
          <div className={styles.sectionHeader}>
            <h2>{t('Similar items')}</h2>
            <Link to="/catalog">{t('View all')}</Link>
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
