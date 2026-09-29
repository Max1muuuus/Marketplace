import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchBar from '../../components/Search/SearchBar'
import { getCategories, getProducts } from '../../services/marketplaceStore'
import { useLanguage } from '../../context/useLanguage'
import styles from './CatalogPage.module.scss'

export default function CatalogPage() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [view, setView] = useState('grid')
  const [products] = useState(getProducts)
  const [categories] = useState(getCategories)
  const [filters, setFilters] = useState({
    brand: '',
    rating: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  })

  const selectedCategory = searchParams.get('category') || ''

  const visibleProducts = useMemo(() => {
    let nextProducts = [...products]

    if (search.trim()) {
      const query = search.toLowerCase()
      nextProducts = nextProducts.filter((product) =>
        [product.name, product.brand, product.category, product.description].some((field) =>
          String(field).toLowerCase().includes(query),
        ),
      )
    }

    if (selectedCategory) {
      nextProducts = nextProducts.filter((product) => product.category === selectedCategory || categories.find((category) => category.slug === selectedCategory)?.id === product.category)
    }

    if (filters.brand) {
      nextProducts = nextProducts.filter((product) => product.brand === filters.brand)
    }

    if (filters.rating) {
      nextProducts = nextProducts.filter((product) => product.rating >= Number(filters.rating))
    }

    if (filters.status) {
      nextProducts = nextProducts.filter((product) => product.status === filters.status)
    }

    if (filters.minPrice) {
      nextProducts = nextProducts.filter((product) => product.price >= Number(filters.minPrice))
    }

    if (filters.maxPrice) {
      nextProducts = nextProducts.filter((product) => product.price <= Number(filters.maxPrice))
    }

    if (sort === 'price-asc') {
      nextProducts.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      nextProducts.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      nextProducts.sort((a, b) => b.rating - a.rating)
    }

    return nextProducts
  }, [search, filters, sort, products, categories, selectedCategory])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>{t('Catalog')}</span>
            <h1>{t('All gadgets and gear')}</h1>
          </div>
          <SearchBar value={search} onChange={setSearch} onSubmit={(event) => event.preventDefault()} />
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3>{t('Category')}</h3>
              <select value={selectedCategory} onChange={(event) => {
                const next = new URLSearchParams(searchParams)
                if (event.target.value) next.set('category', event.target.value)
                else next.delete('category')
                setSearchParams(next)
              }}>
                <option value="">{t('All categories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{t(category.name)}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3>{t('Brand')}</h3>
              <select value={filters.brand} onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value }))}>
                <option value="">{t('Any brand')}</option>
                {[...new Set(products.map((product) => product.brand))].map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3>{t('Price')}</h3>
              <div className={styles.inlineInputs}>
                <input type="number" placeholder={t('Min')} value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))} />
                <input type="number" placeholder={t('Max')} value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))} />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>{t('Rating')}</h3>
              <select value={filters.rating} onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))}>
                <option value="">{t('All ratings')}</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.9">4.9+</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3>{t('Availability')}</h3>
              <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                <option value="">{t('Any')}</option>
                <option value="in-stock">{t('In stock')}</option>
                <option value="limited">{t('Limited')}</option>
              </select>
            </div>
          </aside>

          <main className={styles.results}>
            <div className={styles.toolbar}>
              <p>{visibleProducts.length} {t('products found')}</p>
              <div className={styles.controls}>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">{t('Featured')}</option>
                  <option value="price-asc">{t('Price: low to high')}</option>
                  <option value="price-desc">{t('Price: high to low')}</option>
                  <option value="rating">{t('Top rated')}</option>
                </select>
                <div className={styles.viewToggle}>
                  <button type="button" className={view === 'grid' ? styles.active : ''} onClick={() => setView('grid')}>{t('Grid')}</button>
                  <button type="button" className={view === 'list' ? styles.active : ''} onClick={() => setView('list')}>{t('List')}</button>
                </div>
              </div>
            </div>

            <div className={view === 'grid' ? styles.grid : styles.listGrid}>
              {visibleProducts.length ? (
                visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className={styles.emptyState}>{t('No products match your search. Try another filter.')}</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
