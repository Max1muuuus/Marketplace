import styles from './SearchBar.module.scss'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search products' }) {
  return (
    <form className={styles.searchBar} onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  )
}
