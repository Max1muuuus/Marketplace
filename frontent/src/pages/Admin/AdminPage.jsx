import { useEffect, useState } from 'react'
import {
  createCategory,
  createMyProduct,
  createSeller,
  deleteAdminRating,
  deleteAdminOrder,
  deleteAdminReview,
  deleteAdminUser,
  deleteCategory,
  deleteMyProduct,
  deleteSeller,
  fetchAdminRatings,
  fetchAdminReviews,
  fetchAdminUsers,
  fetchCategories,
  fetchOrders,
  fetchProducts,
  fetchSellers,
  updateCategory,
  updateMyProduct,
  updateSeller,
} from '../../services/mockApi'
import { useLanguage } from '../../context/useLanguage'
import styles from './AdminPage.module.scss'

const sections = ['Overview', 'Users', 'Sellers', 'Products', 'Categories', 'Orders', 'Reviews', 'Statistics']

function loadData() {
  return {
    users: [],
    sellers: [],
    products: [],
    categories: [],
    orders: [],
    reviews: [],
    ratings: [],
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

  const refresh = async () => {
    const nextData = loadData()
    try {
      [nextData.orders, nextData.users, nextData.products, nextData.categories, nextData.sellers, nextData.reviews, nextData.ratings] = await Promise.all([
        fetchOrders(), fetchAdminUsers(), fetchProducts(), fetchCategories(), fetchSellers(), fetchAdminReviews(), fetchAdminRatings(),
      ])
    } catch (error) {
      console.error('Unable to load administration data', error)
    }
    setData(nextData)
  }

  useEffect(() => {
    refresh()
  }, [])
  const updateEntity = async (collection, id, changes) => {
    if (collection === 'products') await updateMyProduct(id, changes)
    if (collection === 'categories') await updateCategory(id, changes)
    if (collection === 'sellers') await updateSeller(id, changes)
    await refresh()
  }

  const removeEntity = async (collection, id) => {
    if (collection === 'ratings') {
      await deleteAdminRating(id)
    } else if (collection === 'reviews') {
      await deleteAdminReview(id)
    } else if (collection === 'users') {
      await deleteAdminUser(id)
    } else if (collection === 'orders') {
      await deleteAdminOrder(id)
    } else if (collection === 'products') {
      await deleteMyProduct(id)
    } else if (collection === 'categories') {
      await deleteCategory(id)
    } else if (collection === 'sellers') {
      await deleteSeller(id)
    } else {
      return
    }
    await refresh()
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    const changes = { ...editor.values }
    if (editor.collection === 'products') {
      changes.price = Number(changes.price)
      changes.stock = Number(changes.stock)
      changes.gallery = [changes.image]
      changes.status = changes.stock > 0 ? 'in-stock' : 'out-of-stock'
    }
    if (editor.collection === 'orders') changes.total = Number(changes.total)
    try {
      if (editor.collection === 'products' && !editor.id) {
        await createMyProduct(changes)
      } else {
        await updateEntity(editor.collection, editor.id, changes)
      }
      await refresh()
      setEditor(null)
    } catch (error) {
      console.error('Unable to save administration changes', error)
    }
  }

  const addCategory = async (event) => {
    event.preventDefault()
    try {
      await createCategory(newCategory)
      setNewCategory({ name: '', slug: '', icon: '📦', description: '' })
      await refresh()
    } catch (error) {
      console.error('Unable to create category', error)
    }
  }

  const addSeller = async (event) => {
    event.preventDefault()
    try {
      await createSeller(newSeller)
      setNewSeller({ name: '', location: '', description: '' })
      await refresh()
    } catch (error) {
      console.error('Unable to create seller', error)
    }
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
      <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td><span className={styles.role}>{t(user.role)}</span></td><td>{actions('users', user, false, user.role !== 'Admin')}</td></tr>
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

    if (section === 'Orders') return table(['Order', 'Customer', 'Status', 'Total'], data.orders.map((order) => (
      <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{t(order.status)}</td><td>{formatCurrency(order.total)}</td><td><div className={styles.rowActions}><button type="button" className={styles.danger} onClick={() => { if (window.confirm(t('Delete this order permanently?'))) removeEntity('orders', order.id) }}>{t('Delete')}</button></div></td></tr>
    )))

    const reviewRows = [
      ...data.reviews.map((review) => <tr key={review.id}><td>{review.productName}</td><td>{review.user}</td><td>{review.rating} / 5</td><td>{t(review.text)}</td><td>{actions('reviews', review, false)}</td></tr>),
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
          <div className={styles.panelHeading}><h2>{t(section)}</h2><span>{section === 'Overview' ? t('Live database data') : `${t(section)} ${t('management')}`}</span></div>
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