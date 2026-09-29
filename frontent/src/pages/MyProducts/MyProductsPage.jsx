import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { createProduct, deleteProduct, getCategories, getProducts, setUserRole, updateProduct } from '../../services/marketplaceStore'
import styles from './MyProductsPage.module.scss'

const emptyForm = { name: '', brand: '', category: '', price: '', stock: '', image: '', description: '' }

export default function MyProductsPage() {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()
  const [products, setProducts] = useState(() => getProducts().filter((product) => product.ownerId === user?.id))
  const [categories] = useState(getCategories)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role === 'customer' && products.length > 0) {
      setUserRole(user.id, 'seller')
      updateUser({ role: 'seller' })
    }
  }, [products.length, updateUser, user?.id, user?.role])

  const refresh = () => setProducts(getProducts().filter((product) => product.ownerId === user.id))
  const changeField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = (event) => {
    event.preventDefault()
    if (!form.category) {
      setError('Choose a category before saving.')
      return
    }

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      ownerId: user.id,
      sellerId: user.id,
    }

    if (editingId) {
      updateProduct(editingId, {
        ...productData,
        gallery: [productData.image],
        status: productData.stock > 0 ? 'in-stock' : 'out-of-stock',
      })
    } else {
      createProduct(productData)
      if (user.role === 'customer') {
        updateUser({ role: 'seller' })
      }
    }
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    refresh()
  }

  const beginEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
    })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = (productId) => {
    const ownedProduct = products.find((product) => product.id === productId && product.ownerId === user.id)
    if (!ownedProduct) return
    deleteProduct(productId)
    if (editingId === productId) {
      setEditingId(null)
      setForm(emptyForm)
    }
    refresh()
  }

  if (!user) {
    return <div className={styles.empty}><h1>{t('Sign in to list products')}</h1><Link to="/login">{t('Login')}</Link></div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}><div><span className={styles.eyebrow}>{t('Seller workspace')}</span><h1>{t('My products')}</h1></div><span>{products.length} {t('listings')}</span></header>
        <div className={styles.layout}>
          <form className={styles.form} onSubmit={submit}>
            <h2>{t(editingId ? 'Edit listing' : 'Add a product')}</h2>
            <label>{t('Product name')}<input required name="name" value={form.name} onChange={changeField} /></label>
            <div className={styles.twoCol}>
              <label>{t('Brand')}<input required name="brand" value={form.brand} onChange={changeField} /></label>
              <label>{t('Category')}<select required name="category" value={form.category} onChange={changeField}><option value="">{t('Select category')}</option>{categories.map((category) => <option key={category.id} value={category.id}>{t(category.name)}</option>)}</select></label>
            </div>
            <div className={styles.twoCol}>
              <label>{t('Price (UAH)')}<input required min="1" type="number" name="price" value={form.price} onChange={changeField} /></label>
              <label>{t('Stock')}<input required min="0" type="number" name="stock" value={form.stock} onChange={changeField} /></label>
            </div>
            <label>{t('Image URL')}<input required type="url" name="image" value={form.image} onChange={changeField} /></label>
            <label>{t('Description')}<textarea required rows="4" name="description" value={form.description} onChange={changeField} /></label>
            {error ? <p className={styles.error}>{t(error)}</p> : null}
            <div className={styles.formActions}><button type="submit" className={styles.primary}>{t(editingId ? 'Save changes' : 'Publish product')}</button>{editingId ? <button type="button" className={styles.cancel} onClick={() => { setEditingId(null); setForm(emptyForm) }}>{t('Cancel')}</button> : null}</div>
          </form>

          <section className={styles.listingSection}>
            <h2>{t('Your listings')}</h2>
            {products.length ? <div className={styles.list}>
              {products.map((product) => (
                <article className={styles.product} key={product.id}>
                  <img src={product.image} alt="" />
                  <div className={styles.productInfo}><Link to={`/product/${product.id}`}>{product.name}</Link><span>{product.price} UAH · {product.stock} {t('in stock')}</span></div>
                  <div className={styles.actions}><button type="button" onClick={() => beginEdit(product)}>{t('Edit')}</button><button type="button" className={styles.delete} onClick={() => remove(product.id)}>{t('Delete')}</button></div>
                </article>
              ))}
            </div> : <p className={styles.emptyList}>{t('You have not listed any products yet.')}</p>}
          </section>
        </div>
      </div>
    </div>
  )
}