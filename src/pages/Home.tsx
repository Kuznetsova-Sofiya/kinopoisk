import React, { useState, useEffect } from 'react';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import { fetchPopularMovies } from '../services/api';
import type { Movie } from '../types/movie';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async (page: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const data = await fetchPopularMovies(page);
      
      if (reset) {
        setMovies(data.items);
      } else {
        setMovies(prev => [...prev, ...data.items]);
      }
      
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить фильмы');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMovies(1, true);
  }, []);

  const handleShowMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadMovies(nextPage, false);
  };

  const hasMorePages = currentPage < totalPages;

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '24px' }}>Популярные фильмы</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <MovieGrid movies={movies} />
      
      {loading && (
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '32px' }}>
          Загрузка
        </p>
      )}
      
      {!loading && hasMorePages && (
        <div style={styles.buttonWrapper}>
          <button onClick={handleShowMore} style={styles.button}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  button: {
    backgroundColor: '#242426',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '40px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};