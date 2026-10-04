import styles from './SearchBar.module.scss'
import { useLanguage } from '../../context/useLanguage'

export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  const { t } = useLanguage()
  const searchPlaceholder = t(placeholder || 'Search products')
  return (
    <form className={styles.searchBar} onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label={t('Search')}
      />
      <button type="submit">{t('Search')}</button>
    </form>
  )
}
