import { useState } from 'react'
import styles from './ContactsPage.module.scss'
import { useLanguage } from '../../context/useLanguage'

export default function ContactsPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(t('Message sent successfully!'))
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{t('Contacts')}</span>
          <h1>{t('Let’s talk tech and support.')}</h1>
        </div>

        <div className={styles.layout}>
          <div className={styles.infoGrid}>
            <div className={styles.card}>
              <h3>{t('Email')}</h3>
              <a href="mailto:hello@markethub.io">hello@markethub.io</a>
            </div>
            <div className={styles.card}>
              <h3>{t('Phone')}</h3>
              <a href="tel:+14155550149">+1 (415) 555-0149</a>
            </div>
            <div className={styles.card}>
              <h3>{t('Office')}</h3>
              <p>1200 Market Street, San Francisco, CA</p>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="contact-name">{t('Name')}</label>
              <input id="contact-name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-email">{t('Email')}</label>
              <input id="contact-email" autoComplete="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-message">{t('Message')}</label>
              <textarea id="contact-message" rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </div>
            <button type="submit" className={styles.primaryButton}>{t('Send message')}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
