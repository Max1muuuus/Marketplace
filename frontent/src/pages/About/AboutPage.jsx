import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { fetchAccountRating, fetchMarketplaceRatings, saveAccountRating } from '../../services/mockApi'
import styles from './AboutPage.module.scss'

const values = [
  {
    title: 'Curated tech',
    text: 'Every product is selected for real daily value, not noise or hype.',
  },
  {
    title: 'Transparent pricing',
    text: 'Clear offers, no hidden fees, and honest product details from the start.',
  },
  {
    title: 'Fast support',
    text: 'Real people help with delivery, setup, and product questions, fast.',
  },
]

export default function AboutPage() {
  const { user } = useAuth()
  const userId = user?.id
  const { t } = useLanguage()
  const [ratings, setRatings] = useState([])
  const [rating, setRating] = useState('5')
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const average = ratings.length ? (ratings.reduce((sum, entry) => sum + Number(entry.rating), 0) / ratings.length).toFixed(1) : '—'

  useEffect(() => {
    fetchMarketplaceRatings().then(setRatings).catch((error) => console.error('Unable to load marketplace ratings', error))
    if (userId != null) {
      fetchAccountRating().then((entry) => {
        setRating(String(entry.rating))
        setText(entry.text)
      }).catch((error) => {
        if (error.status !== 404) console.error('Unable to load your marketplace rating', error)
      })
    }
  }, [userId])

  const submitRating = async (event) => {
    event.preventDefault()
    if (!user) return
    try {
      await saveAccountRating({ rating: Number(rating), text: text.trim() })
      setRatings(await fetchMarketplaceRatings())
      setSaved(true)
    } catch (error) {
      console.error('Unable to save marketplace rating', error)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>{t('About us')}</span>
          <h1>{t('We build a smarter digital shopping experience.')}</h1>
          <p>
            {t('MarketHub connects buyers with premium devices, accessories, and everyday tech essentials in a clean, modern marketplace designed for speed and trust.')}
          </p>
        </div>

        <div className={styles.stats}>
          <div>
            <strong>24k+</strong>
            <span>{t('happy buyers')}</span>
          </div>
          <div>
            <strong>1.2k</strong>
            <span>{t('products in stock')}</span>
          </div>
          <div>
            <strong>{average}/5</strong>
            <span>{t('average rating')}</span>
          </div>
        </div>

        <div className={styles.valueGrid}>
          {values.map((value) => (
            <article key={value.title} className={styles.card}>
              <h3>{t(value.title)}</h3>
              <p>{t(value.text)}</p>
            </article>
          ))}
        </div>

        <section className={styles.ratingSection}>
          <div>
            <span className={styles.eyebrow}>{t('Marketplace feedback')}</span>
            <h2>{t('Rate your experience')}</h2>
            <p>{ratings.length} {t(ratings.length === 1 ? 'rating' : 'ratings')} · {t('Current average')} {average}/5</p>
          </div>
          {user ? (
            <form className={styles.ratingForm} onSubmit={submitRating}>
              <label>{t('Rating')}<select value={rating} onChange={(event) => { setRating(event.target.value); setSaved(false) }}><option value="5">{t('5 stars')}</option><option value="4">{t('4 stars')}</option><option value="3">{t('3 stars')}</option><option value="2">{t('2 stars')}</option><option value="1">{t('1 star')}</option></select></label>
              <label>{t('Comment')}<textarea rows="3" maxLength="500" value={text} onChange={(event) => { setText(event.target.value); setSaved(false) }} placeholder={t('Share a note about your marketplace experience')} /></label>
              <button type="submit">{t(ratings.some((entry) => entry.userId === user.id) ? 'Update rating' : 'Submit rating')}</button>
              {saved ? <span className={styles.saved}>{t('Your rating has been saved.')}</span> : null}
            </form>
          ) : <p className={styles.signIn}><Link to="/login">{t('Log in')}</Link> {t('to leave a marketplace rating.')}</p>}
          {ratings.length ? <div className={styles.ratingList}>{ratings.slice().reverse().slice(0, 4).map((entry) => <article key={entry.id}><strong>{entry.userName}</strong><span>{'★'.repeat(Number(entry.rating))} · {entry.date}</span>{entry.text ? <p>{entry.text}</p> : null}</article>)}</div> : null}
        </section>
      </div>
    </div>
  )
}
