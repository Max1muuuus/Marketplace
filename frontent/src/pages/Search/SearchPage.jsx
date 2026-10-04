import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { searchProducts } from '../../services/mockApi'
import styles from './SearchPage.module.scss'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const query = searchParams.get('q') || ''
      const data = await searchProducts(query)
      setResults(data)
      setLoading(false)
    }

    load()
  }, [searchParams])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Search</span>
          <h1>{searchParams.get('q') ? `Results for “${searchParams.get('q')}”` : 'Search products'}</h1>
        </div>

        {loading ? (
          <p className={styles.status}>Searching...</p>
        ) : results.length ? (
          <div className={styles.grid}>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No matches found. Try a broader keyword.</div>
        )}
      </div>
    </div>
  )
}
