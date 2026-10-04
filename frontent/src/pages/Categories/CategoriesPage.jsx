import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../../services/mockApi' // Переконайся в правильності шляху
import styles from './CategoriesPage.module.scss'

export default function CategoriesPage() {
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategoriesList(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Categories</span>
          <h1>Browse digital essentials</h1>
        </div>

        {loading ? (
          <div className={styles.emptyState}>Loading categories...</div>
        ) : (
          <div className={styles.grid}>
            {categoriesList.map((category) => {
              const categoryKey = category.slug || category.id

              return (
                <Link
                  key={category.id || category.slug}
                  to={`/catalog?category=${categoryKey}`}
                  className={styles.card}
                >
                  {category.icon && <span className={styles.icon}>{category.icon}</span>}
                  <h3>{category.name}</h3>
                  {category.description && <p>{category.description}</p>}
                  <strong>Explore</strong>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}