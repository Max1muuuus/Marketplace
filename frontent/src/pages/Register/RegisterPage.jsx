import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import styles from './RegisterPage.module.scss'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.name) nextErrors.name = 'Name is required'
    if (!form.email) nextErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address'
    if (!form.password || form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
      })
      navigate('/')
    } catch (error) {
      setErrors({ form: error.message || 'Registration failed. Please try again.' })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>{t('Create account')}</span>
        <h1>{t('Register')}</h1>
        <form onSubmit={handleSubmit}>
          {errors.form ? <p role="alert">{t(errors.form)}</p> : null}
          <div className={styles.field}>
            <label htmlFor="register-name">{t('Name')}</label>
            <input id="register-name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            {errors.name ? <small>{t(errors.name)}</small> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="register-email">{t('Email')}</label>
            <input id="register-email" autoComplete="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            {errors.email ? <small>{t(errors.email)}</small> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="register-password">{t('Password')}</label>
            <input id="register-password" autoComplete="new-password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            {errors.password ? <small>{t(errors.password)}</small> : null}
          </div>
          <button type="submit" className={styles.primaryButton}>{t('Register')}</button>
        </form>
        <p>
          {t('Already have an account?')} <Link to="/login">{t('Login')}</Link>
        </p>
      </div>
    </div>
  )
}
