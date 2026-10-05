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

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/");
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrors({ server: serverMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Welcome back</span>
        <h1>{t('Login')}</h1>

        {errors.server && (
          <div className={styles.serverError}>{errors.server}</div>
        )}

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

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className={styles.hint}>{t('Admin demo:')} <strong>admin@marketplace.test</strong> / <strong>Admin123!</strong></p>
        <p>
          {t('No account yet?')} <Link to="/register">{t('Create one')}</Link>
        </p>
      </div>
    </div>
  );
}
