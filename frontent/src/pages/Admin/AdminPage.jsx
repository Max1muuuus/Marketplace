import { useState } from 'react'
import { createProduct, getCategories, getCollection, getMarketplaceRatings, getOrders, getProducts, getReviews, getSellers, getUsers, saveCollection } from '../../services/marketplaceStore'
import { useLanguage } from '../../context/useLanguage'
import styles from './AdminPage.module.scss'

const sections = ['Overview', 'Users', 'Sellers', 'Products', 'Categories', 'Orders', 'Reviews', 'Statistics']

function loadData() {
  return {
    users: getUsers(),
    sellers: getSellers(),
    products: getProducts(),
    categories: getCategories(),
    orders: getOrders(),
    reviews: getReviews(),
    ratings: getMarketplaceRatings(),
  }
}

const fieldsFor = (collection, item) => {
  const fields = {
    users: ['name', 'email', 'role'],
    sellers: ['name', 'location', 'description'],
    products: ['name', 'brand', 'category', 'price', 'stock', 'description', 'image'],
    categories: ['name', 'slug', 'icon', 'description'],
    orders: ['status', 'total'],
  }
  return (fields[collection] || []).map((name) => ({
    name,
    value: item[name] ?? '',
    type: ['price', 'stock', 'total'].includes(name) ? 'number' : 'text',
  }))
}

export default function AdminPage() {
  const { t, formatCurrency } = useLanguage()
  const [section, setSection] = useState('Overview')
  const [data, setData] = useState(loadData)
  const [editor, setEditor] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', icon: '📦', description: '' })
  const [newSeller, setNewSeller] = useState({ name: '', location: '', description: '' })

  const refresh = () => setData(loadData())
  const updateEntity = (collection, id, changes) => {
    const next = data[collection].map((item) => item.id === id ? { ...item, ...changes } : item)
    saveCollection(collection, next)
    refresh()
  }

  const removeEntity = (collection, id) => {
    if (collection === 'ratings') {
      saveCollection('marketplace-ratings', data.ratings.filter((item) => item.id !== id))
    } else if (collection === 'reviews') {
      saveCollection('reviews', data.reviews.filter((item) => item.id !== id))
    } else if (collection === 'users') {
      saveCollection('accounts', getCollection('accounts').filter((account) => account.id !== id))
      saveCollection('users', data.users.filter((item) => item.id !== id))
    } else {
      saveCollection(collection, data[collection].filter((item) => item.id !== id))
    }
    refresh()
  }

  const saveEdit = (event) => {
    event.preventDefault()
    const changes = { ...editor.values }
    if (editor.collection === 'products') {
      changes.price = Number(changes.price)
      changes.stock = Number(changes.stock)
      changes.gallery = [changes.image]
      changes.status = changes.stock > 0 ? 'in-stock' : 'out-of-stock'
    }
    if (editor.collection === 'orders') changes.total = Number(changes.total)
    if (editor.collection === 'products' && !editor.id) {
      createProduct({ ...changes, ownerId: 'u-admin', sellerId: 'u-admin' })
      refresh()
    } else {
      updateEntity(editor.collection, editor.id, changes)
    }
    setEditor(null)
  }

  const addCategory = (event) => {
    event.preventDefault()
    const category = { ...newCategory, id: `category-${Date.now()}` }
    saveCollection('categories', [...data.categories, category])
    setNewCategory({ name: '', slug: '', icon: '📦', description: '' })
    refresh()
  }

  const addSeller = (event) => {
    event.preventDefault()
    const seller = { ...newSeller, id: `seller-${Date.now()}`, logo: newSeller.name.slice(0, 2).toUpperCase(), rating: 0, sales: 0 }
    saveCollection('sellers', [...data.sellers, seller])
    setNewSeller({ name: '', location: '', description: '' })
    refresh()
  }

  const metrics = [
    ['Users', data.users.length],
    ['Sellers', data.sellers.length],
    ['Products', data.products.length],
    ['Orders', data.orders.length],
    ['Reviews', data.reviews.length + data.ratings.length],
    ['Revenue', formatCurrency(data.orders.reduce((sum, order) => sum + Number(order.total || 0), 0))],
  ]

  const beginEdit = (collection, item) => {
    setEditor({ collection, id: item.id, values: Object.fromEntries(fieldsFor(collection, item).map(({ name, value }) => [name, value])) })
  }

  const table = (headers, rows) => (
    <div className={styles.tableWrap}>
      <table>
        <thead><tr>{headers.map((header) => <th key={header}>{t(header)}</th>)}<th>{t('Actions')}</th></tr></thead>
        <tbody>{rows.length ? rows : <tr><td colSpan={headers.length + 1} className={styles.empty}>{t('No records yet.')}</td></tr>}</tbody>
      </table>
    </div>
  )

  const actions = (collection, item, canEdit = true, canDelete = true) => (
    <div className={styles.rowActions}>
      {canEdit ? <button type="button" onClick={() => beginEdit(collection, item)}>{t('Edit')}</button> : null}
      {canDelete ? <button type="button" className={styles.danger} onClick={() => removeEntity(collection, item.id)}>{t('Delete')}</button> : null}
    </div>
  )

  const renderSection = () => {
    if (section === 'Overview' || section === 'Statistics') {
      const averageRating = data.ratings.length
        ? (data.ratings.reduce((sum, rating) => sum + Number(rating.rating), 0) / data.ratings.length).toFixed(1)
        : '—'
      return (
        <>
          <div className={styles.metricGrid}>{metrics.map(([label, value]) => <article key={label}><span>{t(label)}</span><strong>{value}</strong></article>)}</div>
          {section === 'Statistics' ? (
            <div className={styles.statsGrid}>
              <article><span>{t('Marketplace rating')}</span><strong>{averageRating}{averageRating !== '—' ? ' / 5' : ''}</strong></article>
              <article><span>{t('Categories')}</span><strong>{data.categories.length}</strong></article>
              <article><span>{t('Completed order value')}</span><strong>{formatCurrency(data.orders.reduce((sum, order) => sum + Number(order.total || 0), 0))}</strong></article>
              <article><span>{t('Products in stock')}</span><strong>{data.products.filter((product) => Number(product.stock) > 0).length}</strong></article>
            </div>
          ) : <p className={styles.note}>{t('Marketplace activity at a glance. Choose a section to manage its records.')}</p>}
        </>
      )
    }

    if (section === 'Users') return table(['Name', 'Email', 'Role'], data.users.map((user) => (
      <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td><span className={styles.role}>{user.role}</span></td><td>{actions('users', user, user.id !== 'u-admin', user.id !== 'u-admin')}</td></tr>
    )))

    if (section === 'Sellers') return (
      <>
        <form className={styles.addForm} onSubmit={addSeller}>
          <input required aria-label={t('Seller name')} placeholder={t('Seller name')} value={newSeller.name} onChange={(event) => setNewSeller({ ...newSeller, name: event.target.value })} />
          <input required aria-label={t('Location')} placeholder={t('Location')} value={newSeller.location} onChange={(event) => setNewSeller({ ...newSeller, location: event.target.value })} />
          <input required aria-label={t('Description')} placeholder={t('Description')} value={newSeller.description} onChange={(event) => setNewSeller({ ...newSeller, description: event.target.value })} />
          <button type="submit">{t('Add seller')}</button>
        </form>
        {table(['Seller', 'Location', 'Sales'], data.sellers.map((seller) => (
          <tr key={seller.id}><td>{seller.name}</td><td>{seller.location}</td><td>{seller.sales || 0}</td><td>{actions('sellers', seller)}</td></tr>
        )))}
      </>
    )

    if (section === 'Products') return (
      <>
        <div className={styles.toolbar}><span>{data.products.length} {t('marketplace listings')}</span><button type="button" onClick={() => setEditor({ collection: 'products', id: null, values: { name: '', brand: '', category: data.categories[0]?.id || '', price: '', stock: '', description: '', image: '' } })}>{t('Add product')}</button></div>
        {table(['Product', 'Category', 'Price', 'Stock'], data.products.map((product) => (
          <tr key={product.id}><td>{product.name}</td><td>{product.category}</td><td>{product.price} UAH</td><td>{product.stock}</td><td>{actions('products', product)}</td></tr>
        )))}
      </>
    )

    if (section === 'Categories') return (
      <>
        <form className={styles.addForm} onSubmit={addCategory}>
          <input required aria-label={t('Category name')} placeholder={t('Category name')} value={newCategory.name} onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })} />
          <input required aria-label={t('Category slug')} placeholder={t('Category slug')} value={newCategory.slug} onChange={(event) => setNewCategory({ ...newCategory, slug: event.target.value })} />
          <input aria-label={t('Category icon')} placeholder={t('Icon')} value={newCategory.icon} onChange={(event) => setNewCategory({ ...newCategory, icon: event.target.value })} />
          <button type="submit">{t('Add category')}</button>
        </form>
        {table(['Category', 'Slug', 'Description'], data.categories.map((category) => (
          <tr key={category.id}><td>{category.icon} {category.name}</td><td>{category.slug}</td><td>{category.description}</td><td>{actions('categories', category)}</td></tr>
        )))}
      </>
    )

    if (section === 'Orders') return table(['Order', 'Customer', 'Seller', 'Status', 'Total'], data.orders.map((order) => (
      <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{order.seller}</td><td>{t(order.status)}</td><td>{formatCurrency(order.total)}</td><td>{actions('orders', order)}</td></tr>
    )))

    const reviewRows = [
      ...data.reviews.map((review) => <tr key={review.id}><td>{t('Product')}</td><td>{review.user}</td><td>{review.rating} / 5</td><td>{t(review.text)}</td><td>{actions('reviews', review, false)}</td></tr>),
      ...data.ratings.map((rating) => <tr key={rating.id}><td>{t('Marketplace')}</td><td>{rating.userName}</td><td>{rating.rating} / 5</td><td>{rating.text ? t(rating.text) : t('Rating only')}</td><td>{actions('ratings', rating, false)}</td></tr>),
    ]
    return table(['Type', 'Author', 'Rating', 'Review'], reviewRows)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <div><span className={styles.eyebrow}>{t('MarketHub control')}</span><h1>{t('Admin panel')}</h1></div>
          <span className={styles.adminMark}>{t('Administrator')}</span>
        </header>
        <nav className={styles.tabs} aria-label={t('Admin sections')}>
          {sections.map((name) => <button key={name} type="button" className={section === name ? styles.activeTab : ''} onClick={() => setSection(name)}>{t(name)}</button>)}
        </nav>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><h2>{t(section)}</h2><span>{section === 'Overview' ? t('Live local data') : `${t(section)} ${t('management')}`}</span></div>
          {renderSection()}
        </section>
      </div>
      {editor ? (
        <div className={styles.overlay}>
          <form className={styles.editor} onSubmit={saveEdit}>
            <h2>{editor.id ? `${t('Edit')} ${t(editor.collection.slice(0, -1))}` : t('Create product')}</h2>
            {fieldsFor(editor.collection, editor.values).map(({ name, type }) => (
              <label key={name}>{t(name)}
                {name === 'role' ? (
                  <select value={editor.values[name]} onChange={(event) => setEditor({ ...editor, values: { ...editor.values, [name]: event.target.value } })}>
                    <option value="customer">{t('Customer')}</option><option value="seller">{t('Seller')}</option><option value="admin">{t('Admin')}</option>
                  </select>
                ) : name === 'category' ? (
                  <select value={editor.values[name]} onChange={(event) => setEditor({ ...editor, values: { ...editor.values, [name]: event.target.value } })}>{data.categories.map((category) => <option key={category.id} value={category.id}>{t(category.name)}</option>)}</select>
                ) : name === 'status' ? (
                  <select value={editor.values[name]} onChange={(event) => setEditor({ ...editor, values: { ...editor.values, [name]: event.target.value } })}><option>{t('В обробці')}</option><option>{t('Відправлено')}</option><option>{t('Доставлено')}</option><option>{t('Скасовано')}</option></select>
                ) : <input required={name !== 'description'} type={type} value={editor.values[name]} onChange={(event) => setEditor({ ...editor, values: { ...editor.values, [name]: event.target.value } })} />}
              </label>
            ))}
            <div className={styles.editorActions}><button type="button" className={styles.cancel} onClick={() => setEditor(null)}>{t('Cancel')}</button><button type="submit">{t('Save changes')}</button></div>
          </form>
        </div>
      ) : null}
    </div>
  )
}