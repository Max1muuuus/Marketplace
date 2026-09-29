import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { searchProducts } from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'
import styles from './SearchPage.module.scss'

export default function SearchPage() {
  const { t } = useLanguage()
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
          <span className={styles.eyebrow}>{t('Search')}</span>
          <h1>{searchParams.get('q') ? `${t('Results for')} “${searchParams.get('q')}”` : t('Search products')}</h1>
        </div>

        {loading ? (
          <p className={styles.status}>{t('Searching...')}</p>
        ) : results.length ? (
          <div className={styles.grid}>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>{t('No matches found. Try a broader keyword.')}</div>
        )}
      </div>
    </div>
  )
}
