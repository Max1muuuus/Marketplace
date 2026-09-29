import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMarketplaceRatings, saveMarketplaceRating } from '../../services/marketplaceStore'
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
  const [ratings, setRatings] = useState(getMarketplaceRatings)
  const [rating, setRating] = useState(() => ratings.find((entry) => entry.userId === user?.id)?.rating || '5')
  const [text, setText] = useState(() => ratings.find((entry) => entry.userId === user?.id)?.text || '')
  const [saved, setSaved] = useState(false)
  const average = ratings.length ? (ratings.reduce((sum, entry) => sum + Number(entry.rating), 0) / ratings.length).toFixed(1) : '—'

  const submitRating = (event) => {
    event.preventDefault()
    if (!user) return
    const nextRatings = saveMarketplaceRating({
      userId: user.id,
      userName: user.name,
      rating: Number(rating),
      text: text.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    setRatings(nextRatings)
    setSaved(true)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>About us</span>
          <h1>We build a smarter digital shopping experience.</h1>
          <p>
            MarketHub connects buyers with premium devices, accessories, and everyday tech essentials
            in a clean, modern marketplace designed for speed and trust.
          </p>
        </div>

        <div className={styles.stats}>
          <div>
            <strong>24k+</strong>
            <span>happy buyers</span>
          </div>
          <div>
            <strong>1.2k</strong>
            <span>products in stock</span>
          </div>
          <div>
            <strong>{average}/5</strong>
            <span>average rating</span>
          </div>
        </div>

        <div className={styles.valueGrid}>
          {values.map((value) => (
            <article key={value.title} className={styles.card}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>

        <section className={styles.ratingSection}>
          <div>
            <span className={styles.eyebrow}>Marketplace feedback</span>
            <h2>Rate your experience</h2>
            <p>{ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'} · Current average {average}/5</p>
          </div>
          {user ? (
            <form className={styles.ratingForm} onSubmit={submitRating}>
              <label>Rating<select value={rating} onChange={(event) => { setRating(event.target.value); setSaved(false) }}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
              <label>Comment<textarea rows="3" maxLength="500" value={text} onChange={(event) => { setText(event.target.value); setSaved(false) }} placeholder="Share a note about your marketplace experience" /></label>
              <button type="submit">{ratings.some((entry) => entry.userId === user.id) ? 'Update rating' : 'Submit rating'}</button>
              {saved ? <span className={styles.saved}>Your rating has been saved.</span> : null}
            </form>
          ) : <p className={styles.signIn}><Link to="/login">Log in</Link> to leave a marketplace rating.</p>}
          {ratings.length ? <div className={styles.ratingList}>{ratings.slice().reverse().slice(0, 4).map((entry) => <article key={entry.id}><strong>{entry.userName}</strong><span>{'★'.repeat(Number(entry.rating))} · {entry.date}</span>{entry.text ? <p>{entry.text}</p> : null}</article>)}</div> : null}
        </section>
      </div>
    </div>
  )
}
