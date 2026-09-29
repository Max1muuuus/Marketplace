import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../services/marketplaceStore'
import styles from './CategoriesPage.module.scss'

export default function CategoriesPage() {
  const [categories] = useState(getCategories)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Categories</span>
          <h1>Browse digital essentials</h1>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link key={category.id} to={`/catalog?category=${category.id}`} className={styles.card}>
              <span className={styles.icon}>{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <strong>Explore</strong>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
