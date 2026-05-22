import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);    
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Kinopoisk</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Поиск фильмов"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
    </header>
  );
};