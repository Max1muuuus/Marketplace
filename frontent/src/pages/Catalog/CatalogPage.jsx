import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchBar from '../../components/Search/SearchBar'
import { fetchCategories, fetchProducts } from '../../services/mockApi' // Переконайся в правильності шляху
import styles from './CatalogPage.module.scss'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [productsList, setProductsList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [view, setView] = useState('grid')

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    rating: '',
    minPrice: '',
    maxPrice: '',
  })

  // 1. Завантаження списку категорій для select-фільтра
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories()
      setCategoriesList(cats)
    }
    loadCategories()
  }, [])

  // 2. Синхронізація URL query-параметрів з фільтром категорії
  useEffect(() => {
    setFilters((current) => ({
      ...current,
      category: searchParams.get('category') || '',
    }))
  }, [searchParams])

  // 3. Завантаження товарів з бекенду при зміні фільтрів або сортування
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)

      // Маппінг значення UI sort на DTO поля бекенду
      let sortBy = 'createdat'
      let sortOrder = 'desc'

      if (sort === 'price-asc') {
        sortBy = 'price'
        sortOrder = 'asc'
      } else if (sort === 'price-desc') {
        sortBy = 'price'
        sortOrder = 'desc'
      } else if (sort === 'rating') {
        sortBy = 'rating'
        sortOrder = 'desc'
      }

      const data = await fetchProducts({
        search,
        category: filters.category,
        brand: filters.brand,
        rating: filters.rating,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy,
        sortOrder,
      })

      setProductsList(Array.isArray(data) ? data : [])
      setLoading(false)
    }

    // Додаємо невеликий debounce для текстового пошуку, щоб не спамити бекенд
    const timeoutId = setTimeout(() => {
      loadProducts()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, filters, sort])

  // Динамічний список брендів з отриманих товарів
  const brands = [...new Set(productsList.map((product) => product.brand).filter(Boolean))]

  const handleCategoryChange = (e) => {
    const val = e.target.value
    setFilters((current) => ({ ...current, category: val }))
    if (val) {
      setSearchParams({ category: val })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>Catalog</span>
            <h1>All gadgets and gear</h1>
          </div>
          <SearchBar value={search} onChange={setSearch} onSubmit={(e) => e.preventDefault()} />
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3>Category</h3>
              <select value={filters.category} onChange={handleCategoryChange}>
                <option value="">All categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id || cat.slug} value={cat.slug || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3>Brand</h3>
              <select
                value={filters.brand}
                onChange={(e) => setFilters((curr) => ({ ...curr, brand: e.target.value }))}
              >
                <option value="">Any brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3>Price</h3>
              <div className={styles.inlineInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((curr) => ({ ...curr, minPrice: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((curr) => ({ ...curr, maxPrice: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Rating</h3>
              <select
                value={filters.rating}
                onChange={(e) => setFilters((curr) => ({ ...curr, rating: e.target.value }))}
              >
                <option value="">All ratings</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.9">4.9+</option>
              </select>
            </div>
          </aside>

          <main className={styles.results}>
            <div className={styles.toolbar}>
              <p>{loading ? 'Loading...' : `${productsList.length} products found`}</p>
              <div className={styles.controls}>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
                <div className={styles.viewToggle}>
                  <button
                    type="button"
                    className={view === 'grid' ? styles.active : ''}
                    onClick={() => setView('grid')}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    className={view === 'list' ? styles.active : ''}
                    onClick={() => setView('list')}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            <div className={view === 'grid' ? styles.grid : styles.listGrid}>
              {loading ? (
                <div className={styles.emptyState}>Loading products...</div>
              ) : productsList.length ? (
                productsList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className={styles.emptyState}>No products match your search. Try another filter.</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}