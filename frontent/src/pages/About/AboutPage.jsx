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
            <strong>4.9/5</strong>
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
      </div>
    </div>
  )
}
