import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import styles from './LoginPage.module.scss'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.email) nextErrors.email = 'Email is required'
    if (!form.password) nextErrors.password = 'Password is required'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    try {
      const user = await login({ email: form.email, password: form.password, name: 'Demo' })
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (error) {
      setErrors({ password: error.message || 'Login failed. Please check your credentials.' })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>{t('Welcome back')}</span>
        <h1>{t('Login')}</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="login-email">{t('Email')}</label>
            <input id="login-email" autoComplete="username" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            {errors.email ? <small>{t(errors.email)}</small> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="login-password">{t('Password')}</label>
            <input id="login-password" autoComplete="current-password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            {errors.password ? <small>{t(errors.password)}</small> : null}
          </div>
          <button type="submit" className={styles.primaryButton}>{t('Login')}</button>
        </form>
        <p className={styles.hint}>{t('Admin demo:')} <strong>admin@marketplace.test</strong> / <strong>Admin123!</strong></p>
        <p>
          {t('No account yet?')} <Link to="/register">{t('Create one')}</Link>
        </p>
      </div>
    </div>
  )
}
