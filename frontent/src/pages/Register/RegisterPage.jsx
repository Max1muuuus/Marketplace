import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext' // Переконайся у правильності шляху
import styles from './RegisterPage.module.scss'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    if (!form.password || form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    try {
      setLoading(true)
      setErrors({})

      // Викликаємо реєстрацію (надсилає RegisterDto: name, email, password)
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })

      // Після успішної реєстрації перенаправляємо на головну
      navigate('/')
    } catch (error) {
      const serverMessage =
        error.response?.data?.message || 'Registration failed. Please try again.'
      setErrors({ server: serverMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Create account</span>
        <h1>Register</h1>

        {errors.server && <div className={styles.serverError}>{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            {errors.name ? <small>{errors.name}</small> : null}
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            {errors.password ? <small>{errors.password}</small> : null}
          </div>

          <button type="submit" className={styles.primaryButton} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}