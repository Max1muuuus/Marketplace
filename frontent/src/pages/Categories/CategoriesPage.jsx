import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../services/marketplaceStore'
import { useLanguage } from '../../context/useLanguage'
import styles from './CategoriesPage.module.scss'

export default function CategoriesPage() {
  const { t } = useLanguage()
  const [categories] = useState(getCategories)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Categories')}</span>
          <h1>{t('Browse digital essentials')}</h1>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link key={category.id} to={`/catalog?category=${category.id}`} className={styles.card}>
              <span className={styles.icon}>{category.icon}</span>
              <h3>{t(category.name)}</h3>
              <p>{t(category.description)}</p>
              <strong>{t('Explore')}</strong>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
