import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchProductById, fetchProducts, fetchReviews, fetchSellerById } from '../../services/mockApi'
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
  const [related, setRelated] = useState([])
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setSelectedImage(0)
      setQuantity(1)

      try {
        const currentProduct = await fetchProductById(id)

        if (!active) return

        setProduct(currentProduct)

        if (currentProduct) {
          // Переконуємося, що беремо саме ID продавця (з урахуванням регістру C# / JS)
          const rawSellerId = currentProduct.sellerId ?? currentProduct.SellerId

          // Якщо sellerId виявився об'єктом, беремо його id, інакше саме значення
          const sellerId = typeof rawSellerId === 'object' 
            ? (rawSellerId?.id ?? rawSellerId?.Id) 
            : rawSellerId

          const sellerPromise = (currentProduct.seller || currentProduct.Seller)
            ? Promise.resolve(currentProduct.seller || currentProduct.Seller)
            : sellerId ? fetchSellerById(sellerId) : Promise.resolve(null)

          const categoryId = currentProduct.category ?? currentProduct.categoryId ?? currentProduct.CategoryId
          const productId = currentProduct.id ?? currentProduct.Id

          const [currentSeller, productReviews, categoryProducts] = await Promise.all([
            sellerPromise,
            fetchReviews(productId),
            fetchProducts({ category: categoryId }),
          ])

          if (active) {
            setSeller(currentSeller)
            setReviews(productReviews || [])

            const filteredRelated = (Array.isArray(categoryProducts) ? categoryProducts : [])
              .filter((entry) => String(entry.id || entry.Id) !== String(productId))
              .slice(0, 4)

            setRelated(filteredRelated)
          }
        }
      } catch (error) {
        console.error('Error loading product details:', error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div className={styles.empty}>Product not found.</div>
  }

  // Обробка полів товару для обидвох регістрів
  const productName = product.name || product.Name
  const productPrice = product.price ?? product.Price
  const productOldPrice = product.oldPrice ?? product.OldPrice
  const productRating = product.rating ?? product.Rating
  const productBrand = product.brand || product.Brand
  const productDescription = product.description || product.Description
  const productStock = product.stock ?? product.Stock ?? 1

  const gallery = product.gallery && product.gallery.length 
    ? product.gallery 
    : [product.image || product.Image || '']
    
  const specs = product.specs || product.Specs || {}

  const ratingAverage = reviews.length
    ? (reviews.reduce((sum, review) => sum + (review.rating ?? review.Rating ?? 0), 0) / reviews.length).toFixed(1)
    : productRating

  // Зчитування даних продавця з БД (Name, Location, Rating)
  const sellerName = seller?.name || seller?.Name || seller?.storeName || seller?.StoreName || 'Marketplace seller'
  const sellerLocation = seller?.location || seller?.Location || seller?.city || seller?.City || 'Ukraine'
  const sellerRating = seller?.rating ?? seller?.Rating ?? 4.8

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.gallerySection}>
          <div className={styles.gallery}>
            <div className={styles.thumbs}>
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={selectedImage === index ? styles.thumbActive : ''}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={productName} />
                </button>
              ))}
            </div>
            <div className={styles.mainImage}>
              <img src={gallery[selectedImage] || gallery[0]} alt={productName} />
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.badgeRow}>
              {product.tag && <span className={styles.badge}>{product.tag}</span>}
              <span className={styles.stock}>{productStock > 0 ? 'In stock' : 'Out of stock'}</span>
            </div>

            <h1>{productName}</h1>
            <div className={styles.metaRow}>
              <span className={styles.rating}>★ {productRating}</span>
              <span>{product.reviewCount || product.ReviewCount || reviews.length} reviews</span>
              {productBrand && <span>Brand: {productBrand}</span>}
            </div>

            <div className={styles.priceRow}>
              <strong>
                {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(productPrice)}
              </strong>
              {productOldPrice ? (
                <span>
                  {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(productOldPrice)}
                </span>
              ) : null}
            </div>

            <p className={styles.description}>{productDescription}</p>

            <div className={styles.quantityRow}>
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryButton} onClick={() => addToCart(product, quantity)}>
                Add to cart
              </button>
              <button type="button" className={styles.secondaryButton} onClick={() => toggleFavorite(product)}>
                {isFavorite(product.id || product.Id) ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className={styles.sellerCard}>
              <div>
                <strong>{sellerName}</strong>
                <p>{sellerLocation}</p>
              </div>
              <span>★ {sellerRating}</span>
            </div>
          </div>
        </div>

        {Object.keys(specs).length > 0 && (
          <section className={styles.specsSection}>
            <div className={styles.sectionHeader}>
              <h2>Specifications</h2>
            </div>
            <div className={styles.specGrid}>
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className={styles.specItem}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.reviewsSection}>
          <div className={styles.sectionHeader}>
            <h2>Customer reviews</h2>
            <span className={styles.rating}>★ {ratingAverage}</span>
          </div>

          <div className={styles.reviewList}>
            {reviews.map((review) => (
              <article key={review.id || review.Id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <strong>{review.user || review.userName || review.UserName}</strong>
                  <span>{review.date || review.Date}</span>
                </div>
                <div className={styles.reviewStars}>{'★'.repeat(review.rating || review.Rating || 5)}</div>
                <p>{review.text || review.comment || review.Comment}</p>
              </article>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.sectionHeader}>
              <h2>Similar items</h2>
              <Link to="/catalog">View all</Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <ProductCard key={item.id || item.Id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}