import React from 'react';

export const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <h1>Kinopoisk</h1>
      </div>
      <div style={styles.search}>
        <input 
          type="text" 
          placeholder="Поиск фильмов" 
          style={styles.searchInput}
        />
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderBottom: '1px solid #333',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
  },
  search: {
    width: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: 'white',
    outline: 'none',
  },
};