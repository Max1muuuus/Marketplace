import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginPage.module.scss'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
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
      const user = await login({ email: form.email, password: form.password, name: 'Demo User' })
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (error) {
      setErrors({ password: error.message || 'Login failed. Please check your credentials.' })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Welcome back</span>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            {errors.email ? <small>{errors.email}</small> : null}
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            {errors.password ? <small>{errors.password}</small> : null}
          </div>
          <button type="submit" className={styles.primaryButton}>Login</button>
        </form>
        <p className={styles.hint}>Admin demo: <strong>admin@markethub.com</strong> / <strong>admin123</strong></p>
        <p>
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
